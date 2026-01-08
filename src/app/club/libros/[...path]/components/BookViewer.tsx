'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { Book } from '@/lib/books';
import React from 'react';

interface BookViewerProps {
  book: Book;
}

export default function BookViewer({ book }: BookViewerProps) {
  const { user, isAuthenticated, token } = useAuth();
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [totalPages, setTotalPages] = React.useState<number | undefined>(undefined);
  const [resumePage, setResumePage] = React.useState<number | null>(null);
  const timeSpentRef = React.useRef<number>(0);
  const saveTimeoutRef = React.useRef<number | null>(null);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  // Cargar progreso guardado
  React.useEffect(() => {
    const fetchProgress = async () => {
      try {
        if (!isAuthenticated || !user?.isSubscribed || !token) return;
        const res = await fetch(`/api/books/progress?bookFilename=${encodeURIComponent(book.filename)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const progress = data?.progress;
          if (progress && typeof progress.currentPage === 'number' && progress.currentPage > 1) {
            setResumePage(progress.currentPage);
            setCurrentPage(progress.currentPage);
            if (progress.totalPages) setTotalPages(progress.totalPages);
          } else {
            // Si no hay progreso guardado, guardar página inicial
            setCurrentPage(1);
          }
        } else {
          // Si hay error, empezar desde página 1
          setCurrentPage(1);
        }
      } catch (e) {
        console.error('Error obteniendo progreso del libro', e);
        setCurrentPage(1);
      }
    };
    fetchProgress();
  }, [book.filename, isAuthenticated, token, user?.isSubscribed]);

  // Detectar cambios de página y guardar progreso periódicamente
  React.useEffect(() => {
    if (!iframeRef.current || !isAuthenticated || !user?.isSubscribed || !token) return;

    let lastSavedPage = currentPage;
    let scrollTimeout: number | null = null;

    const saveProgress = async (page: number, force = false) => {
      // Guardar si es forzado, si cambió la página, o si es la primera vez
      if (!force && page === lastSavedPage && lastSavedPage !== 0) return;
      
      try {
        const response = await fetch('/api/books/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookTitle: book.title,
            bookFilename: book.filename,
            currentPage: page,
            totalPages: totalPages,
            timeSpent: timeSpentRef.current || undefined,
          }),
        });

        if (response.ok) {
          lastSavedPage = page;
          console.log('✅ Progreso guardado:', { page, totalPages, bookFilename: book.filename });
        } else {
          const errorText = await response.text();
          console.error('❌ Error guardando progreso:', errorText);
        }
      } catch (error) {
        console.error('❌ Error guardando progreso:', error);
      } finally {
        // No resetear timeSpent aquí, solo cuando se guarde exitosamente
      }
    };

    const handleScroll = () => {
      if (scrollTimeout) {
        window.clearTimeout(scrollTimeout);
      }

      scrollTimeout = window.setTimeout(() => {
        try {
          const iframe = iframeRef.current;
          if (!iframe) return;

          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (!iframeDoc) {
            // Si no podemos acceder al documento (CORS), usar estimación basada en tiempo
            // Incrementar página cada cierto tiempo de lectura
            if (timeSpentRef.current > 0 && timeSpentRef.current % 30 === 0) {
              const estimatedPage = Math.min((totalPages || 100), currentPage + 1);
              if (estimatedPage !== currentPage) {
                setCurrentPage(estimatedPage);
                saveProgress(estimatedPage);
              }
            }
            return;
          }

          const scrollTop = iframeDoc.documentElement.scrollTop || iframeDoc.body.scrollTop;
          const scrollHeight = iframeDoc.documentElement.scrollHeight || iframeDoc.body.scrollHeight;
          const clientHeight = iframeDoc.documentElement.clientHeight || iframeDoc.body.clientHeight;

          // Calcular página aproximada basada en scroll
          if (scrollHeight > clientHeight && totalPages) {
            const scrollPercent = scrollTop / (scrollHeight - clientHeight);
            const estimatedPage = Math.max(1, Math.min(totalPages, Math.ceil(scrollPercent * totalPages)));
            
            if (estimatedPage !== currentPage) {
              setCurrentPage(estimatedPage);
              saveProgress(estimatedPage);
            }
          }
        } catch (e) {
          // Cross-origin puede bloquear acceso al documento
          // Guardar progreso periódicamente de todas formas
        }
      }, 1000);
    };

    // Intentar agregar listener al iframe
    try {
      const iframeWindow = iframeRef.current.contentWindow;
      if (iframeWindow) {
        iframeWindow.addEventListener('scroll', handleScroll, true);
        iframeWindow.addEventListener('wheel', handleScroll, true);
      }
    } catch (e) {
      // Si hay restricciones CORS, usar un intervalo para guardar periódicamente
      console.log('⚠️ CORS detectado, usando guardado periódico');
    }

    // Guardar progreso periódicamente cada 30 segundos
    const periodicSave = window.setInterval(() => {
      if (currentPage > 0) {
        saveProgress(currentPage, currentPage === lastSavedPage); // Forzar guardado periódico
      }
    }, 30000);

    // Guardar inicialmente después de 2 segundos de carga
    const initialSave = window.setTimeout(() => {
      if (currentPage > 0) {
        saveProgress(currentPage, true);
      }
    }, 2000);

    // Guardar cuando el usuario sale de la página
    const handleBeforeUnload = () => {
      if (currentPage > 0 && currentPage !== lastSavedPage) {
        // Usar fetch con keepalive para guardar antes de cerrar
        fetch('/api/books/progress', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookTitle: book.title,
            bookFilename: book.filename,
            currentPage: currentPage,
            totalPages: totalPages,
            timeSpent: timeSpentRef.current || undefined,
          }),
          keepalive: true, // Permite que la petición continúe después de cerrar la página
        }).catch(() => {});
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('visibilitychange', () => {
      if (document.hidden && currentPage > 0) {
        saveProgress(currentPage);
      }
    });

    return () => {
      try {
        const iframeWindow = iframeRef.current?.contentWindow;
        if (iframeWindow) {
          iframeWindow.removeEventListener('scroll', handleScroll, true);
          iframeWindow.removeEventListener('wheel', handleScroll, true);
        }
      } catch (e) {
        // Ignorar errores
      }
      if (scrollTimeout) window.clearTimeout(scrollTimeout);
      window.clearInterval(periodicSave);
      window.clearTimeout(initialSave);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Guardar antes de desmontar
      if (currentPage > 0) {
        saveProgress(currentPage, true);
      }
    };
  }, [currentPage, totalPages, isAuthenticated, user?.isSubscribed, token, book.filename, book.title]);

  // Este efecto ahora está integrado en el efecto de detección de scroll arriba

  // Contador de tiempo invertido leyendo
  React.useEffect(() => {
    if (!(isAuthenticated && user?.isSubscribed)) return;
    const interval = window.setInterval(() => {
      timeSpentRef.current += 1;
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isAuthenticated, user?.isSubscribed]);

  // Scroll a la página guardada cuando se carga el PDF
  React.useEffect(() => {
    if (!resumePage || !iframeRef.current) return;

    const scrollToPage = () => {
      try {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc || !totalPages) return;

        // Calcular posición de scroll para la página guardada
        const scrollHeight = iframeDoc.documentElement.scrollHeight || iframeDoc.body.scrollHeight;
        const clientHeight = iframeDoc.documentElement.clientHeight || iframeDoc.body.clientHeight;
        const scrollPercent = (resumePage - 1) / totalPages;
        const targetScroll = scrollPercent * (scrollHeight - clientHeight);

        iframeDoc.documentElement.scrollTop = targetScroll;
        iframeDoc.body.scrollTop = targetScroll;
      } catch (e) {
        // Ignorar errores de CORS
      }
    };

    // Esperar a que el PDF se cargue
    const timeout = window.setTimeout(scrollToPage, 2000);
    return () => window.clearTimeout(timeout);
  }, [resumePage, totalPages]);

  // Si el usuario está autenticado y suscrito, mostrar el PDF
  if (isAuthenticated && user?.isSubscribed) {
    // URL del PDF con hash para página inicial si existe
    const pdfUrl = resumePage && resumePage > 1 
      ? `${book.pdfUrl}#page=${resumePage}`
      : book.pdfUrl;

    return (
      <div
        className="relative w-full h-full"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        style={{ 
          userSelect: 'none', 
          WebkitUserSelect: 'none', 
          MozUserSelect: 'none',
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden'
        }}
      >
        {/* Visor de PDF simple con iframe */}
        <iframe
          ref={iframeRef}
          src={pdfUrl}
          style={{
            width: '100%',
            height: '100vh',
            border: 'none',
            margin: 0,
            padding: 0,
          }}
          title={`Lector de ${book.title}`}
          onLoad={() => {
            // Intentar obtener el número total de páginas desde el iframe
            if (iframeRef.current && !totalPages) {
              try {
                const iframe = iframeRef.current;
                const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                if (iframeDoc) {
                  // Buscar elementos que indiquen el total de páginas
                  const pageElements = iframeDoc.querySelectorAll('[data-page-number], .page, canvas');
                  if (pageElements.length > 0) {
                    setTotalPages(pageElements.length);
                  }
                }
              } catch (e) {
                // Ignorar errores de CORS
              }
            }
          }}
        />
      </div>
    );
  }

  // Si no está suscrito, mostrar mensaje de bloqueo
  return (
    <div className="locked-content">
      <div className="tp-blog-locked-content p-relative">
        <div className="tp-blog-locked-overlay"></div>
        <div className="tp-blog-locked-info text-center">
          <div className="tp-blog-locked-icon mb-30">
            <svg width="50" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 10V8C6 5.79086 7.79086 4 10 4H14C16.2091 4 18 5.79086 18 8V10M6 10H4C2.89543 10 2 10.8954 2 12V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20V12C22 10.8954 21.1046 10 20 10H18M6 10H18" stroke="#D0FF71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h4 className="tp-blog-locked-title mb-20 text-white">Solo miembros del club pueden acceder a este libro</h4>
          <p className="tp-blog-locked-description mb-30 text-white">
            Este libro es exclusivo para miembros suscritos al Club de Programadores Argentina. 
            Únete para acceder a nuestra biblioteca de libros técnicos de programación, desarrollo y tecnología.
          </p>
          <div className="tp-blog-locked-actions">
            {!isAuthenticated && (
              <a 
                href={`/ingresar?redirect=${encodeURIComponent(pathname || '/')}`}
                className="tp-btn-black btn-green-light-bg"
              >
                <span className="tp-btn-black-filter-blur">
                  <svg width="0" height="0">
                    <defs>
                      <filter id="buttonFilterLocked">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"></feGaussianBlur>
                        <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"></feColorMatrix>
                        <feComposite in="SourceGraphic" in2="buttonFilterLocked" operator="atop"></feComposite>
                        <feBlend in="SourceGraphic" in2="buttonFilterLocked"></feBlend>
                      </filter>
                    </defs>
                  </svg>
                </span>
                <span className="tp-btn-black-filter d-inline-flex align-items-center" style={{filter: "url(#buttonFilterLocked)"}}>
                  <span className="tp-btn-black-text">Iniciar Sesión</span>
                  <span className="tp-btn-black-circle">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </span>
                </span>
              </a>
            )}
            {isAuthenticated && !user?.isSubscribed && (
              <a 
                href="/club"
                className="tp-btn-black btn-green-light-bg"
              >
                <span className="tp-btn-black-filter-blur">
                  <svg width="0" height="0">
                    <defs>
                      <filter id="buttonFilterSubscribe">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"></feGaussianBlur>
                        <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"></feColorMatrix>
                        <feComposite in="SourceGraphic" in2="buttonFilterSubscribe" operator="atop"></feComposite>
                        <feBlend in="SourceGraphic" in2="buttonFilterSubscribe"></feBlend>
                      </filter>
                    </defs>
                  </svg>
                </span>
                <span className="tp-btn-black-filter d-inline-flex align-items-center" style={{filter: "url(#buttonFilterSubscribe)"}}>
                  <span className="tp-btn-black-text">Unirse al Club</span>
                  <span className="tp-btn-black-circle">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </span>
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
