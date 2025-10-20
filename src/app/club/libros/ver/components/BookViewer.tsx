'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { Book } from '@/lib/books';
import dynamic from 'next/dynamic';
import React from 'react';

type PDFReaderProps = {
  url: string | { url: string; withCredentials?: boolean };
  page?: number;
  scale?: number;
  width?: number;
  showAllPage?: boolean;
  onDocumentComplete?: (totalPage: number) => void;
};

type MobilePDFReaderProps = {
  url: string | { url: string; withCredentials?: boolean };
  page?: number;
  scale?: 'auto' | number;
  minScale?: number;
  maxScale?: number;
  isShowHeader?: boolean;
  isShowFooter?: boolean;
  onDocumentComplete?: (totalPage: number, title: string, otherObj: unknown) => void;
};

const PDFReader = dynamic<PDFReaderProps>(
  () => import('react-read-pdf').then((mod) => mod.PDFReader as unknown as React.ComponentType<PDFReaderProps>),
  { ssr: false }
);

const MobilePDFReader = dynamic<MobilePDFReaderProps>(
  () => import('react-read-pdf').then((mod) => mod.MobilePDFReader as unknown as React.ComponentType<MobilePDFReaderProps>),
  { ssr: false }
);

interface BookViewerProps {
  book: Book;
}

export default function BookViewer({ book }: BookViewerProps) {
  const { user, isAuthenticated, token } = useAuth();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = React.useState(false);
  const [desktopWidth, setDesktopWidth] = React.useState<number | undefined>(undefined);
  const [totalPages, setTotalPages] = React.useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [resumePage, setResumePage] = React.useState<number | null>(null);
  const [viewerKey, setViewerKey] = React.useState<number>(0);
  const timeSpentRef = React.useRef<number>(0);
  const saveTimeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const checkMobile = () => {
      if (typeof window === 'undefined') return false;
      const mq = window.matchMedia('(max-width: 768px)');
      return mq.matches;
    };
    setIsMobile(checkMobile());
    const listener = () => setIsMobile(checkMobile());
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', listener);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', listener);
      }
    };
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const recalc = () => {
      if (!isMobile) {
        setDesktopWidth(Math.floor(window.innerWidth * 0.5));
      } else {
        setDesktopWidth(undefined);
      }
    };
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [isMobile]);

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
            if (progress.totalPages) setTotalPages(progress.totalPages);
          }
        }
      } catch (e) {
        console.error('Error obteniendo progreso del libro', e);
      }
    };
    fetchProgress();
  }, [book.filename, isAuthenticated, token, user?.isSubscribed]);

  // Listener de cambio de página del visor (pdf.js emite 'pagechange')
  React.useEffect(() => {
    const handler = (evt: any) => {
      const pageNum = (evt && (evt.pageNumber || evt.detail?.pageNumber)) as number | undefined;
      if (typeof pageNum === 'number') {
        setCurrentPage(pageNum);
        // Programar guardado con debounce
        if (saveTimeoutRef.current) {
          window.clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = window.setTimeout(() => {
          // Enviar progreso
          if (isAuthenticated && user?.isSubscribed && token) {
            void fetch('/api/books/progress', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                bookTitle: book.title,
                bookFilename: book.filename,
                currentPage: pageNum,
                totalPages: totalPages,
                timeSpent: timeSpentRef.current || undefined,
              }),
            }).catch(() => {}).finally(() => {
              timeSpentRef.current = 0; // reset parcial tras enviar
            });
          }
        }, 800);
      }
    };
    document.addEventListener('pagechange', handler as EventListener);
    return () => {
      document.removeEventListener('pagechange', handler as EventListener);
      if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current);
    };
  }, [book.filename, book.title, isAuthenticated, token, totalPages, user?.isSubscribed]);

  // Contador de tiempo invertido leyendo mientras el visor está montado
  React.useEffect(() => {
    if (!(isAuthenticated && user?.isSubscribed)) return;
    const interval = window.setInterval(() => {
      timeSpentRef.current += 1;
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isAuthenticated, user?.isSubscribed]);

  // Si el usuario está autenticado y suscrito, mostrar el PDF con react-read-pdf
  if (isAuthenticated && user?.isSubscribed) {
    return (
      <div
        className="relative w-full h-full"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          const isCmdOrCtrl = e.ctrlKey || e.metaKey;
          const key = e.key.toLowerCase();
          if (isCmdOrCtrl && (key === 's' || key === 'p')) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
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
        {/* Barra flotante superior con acciones del lector */}
        <div 
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            background: 'rgba(26, 27, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(208, 255, 113, 0.2)',
            padding: '12px 20px',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            flexWrap: 'wrap'
          }}
        >
          <a 
            href="/club/libros"
            style={{
              background: 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)',
              color: '#1a1b1e',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: '700',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'transform 0.2s ease',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ← Volver a la biblioteca
          </a>
          
          {totalPages ? (
            <span style={{ fontSize: 13, color: '#a0a0a0', whiteSpace: 'nowrap' }}>
              📖 Progreso: {Math.min(100, Math.max(0, Math.round((currentPage / totalPages) * 100)))}% • Página {currentPage} de {totalPages}
            </span>
          ) : (
            <span style={{ fontSize: 13, color: '#a0a0a0' }}>
              📄 Página {currentPage}
            </span>
          )}
          
          {resumePage && resumePage > 1 && currentPage < resumePage && (
            <button
              type="button"
              onClick={() => {
                setViewerKey((k) => k + 1);
                setCurrentPage(resumePage);
              }}
              style={{
                background: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
                color: '#1a1b1e',
                border: 'none',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              📖 Continuar donde quedaste
            </button>
          )}
        </div>
        
        {/* Espaciador para compensar la barra flotante */}
        <div style={{ height: '60px' }} />
        {/* Ocultar cualquier toolbar/acciones de pdf.js viewer */}
        <style jsx global>{`
          #toolbarContainer,
          #secondaryToolbar,
          .toolbar,
          .secondaryToolbar,
          .download,
          .openFile,
          .print,
          .toolbarButton#download,
          .toolbarButton#print,
          .toolbarButton#openFile,
          .editorModeButtons,
          .spreadModeButtons {
            display: none !important;
          }
          
          /* Eliminar margin/padding en mobile */
          @media (max-width: 768px) {
            body, html {
              margin: 0 !important;
              padding: 0 !important;
              overflow: hidden !important;
            }
            #smooth-wrapper, #smooth-content {
              margin: 0 !important;
              padding: 0 !important;
            }
          }
        `}</style>
        {isMobile ? (
          <div style={{ 
            height: 'calc(100vh - 60px)', 
            width: '100vw', 
            overflow: 'auto',
            margin: 0,
            padding: 0,
            position: 'fixed',
            top: '60px',
            left: 0
          }}>
            <MobilePDFReader
              key={viewerKey}
              url={book.pdfUrl}
              page={resumePage && resumePage > 1 ? resumePage : undefined}
              scale="auto"
              minScale={0.25}
              maxScale={10}
              isShowHeader={false}
              isShowFooter={false}
              onDocumentComplete={(tp) => setTotalPages(tp)}
            />
          </div>
        ) : (
          <div style={{ width: '50%', margin: '0 auto', height: 'calc(100vh - 60px)', overflow: 'auto' }}>
            <MobilePDFReader
              key={viewerKey}
              url={book.pdfUrl}
              page={resumePage && resumePage > 1 ? resumePage : undefined}
              scale="auto"
              minScale={0.25}
              maxScale={10}
              isShowHeader={false}
              isShowFooter={false}
              onDocumentComplete={(tp) => setTotalPages(tp)}
            />
          </div>
        )}
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

