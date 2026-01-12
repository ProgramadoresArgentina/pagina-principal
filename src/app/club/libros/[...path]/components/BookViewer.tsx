'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Book } from '@/lib/books';
import React from 'react';

interface BookViewerProps {
  book: Book;
}

export default function BookViewer({ book }: BookViewerProps) {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  // Detectar si es móvil
  React.useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isMobileDevice || isSmallScreen);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Si el usuario está autenticado y suscrito, mostrar el visor PDF
  if (isAuthenticated && user?.isSubscribed) {
    return (
      <div
        className="pdf-viewer-container"
        onContextMenu={(e) => e.preventDefault()}
        style={{ 
          userSelect: 'none', 
          WebkitUserSelect: 'none',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100vh',
          backgroundColor: '#1a1a1a',
          overflow: 'hidden',
        }}
      >
        {/* Barra de controles superior */}
        <div 
          className="pdf-controls"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 15px',
            backgroundColor: '#2d2d2d',
            borderBottom: '1px solid #444',
            flexWrap: 'wrap',
            gap: '10px',
            minHeight: '60px',
          }}
        >
          {/* Botón volver */}
          <Link 
            href="/club/libros"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: '#D0FF71',
              textDecoration: 'none',
              fontSize: '14px',
              padding: '8px 12px',
              borderRadius: '6px',
              backgroundColor: 'rgba(208, 255, 113, 0.1)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span className="d-none d-sm-inline">Biblioteca</span>
          </Link>

          {/* Título del libro */}
          <h1 style={{ 
            color: '#fff', 
            fontSize: '14px', 
            margin: 0,
            flex: 1,
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            padding: '0 10px',
          }}>
            {book.title}
          </h1>

          {/* Botón descargar directo (fallback) */}
          <a
            href={book.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: '#D0FF71',
              textDecoration: 'none',
              fontSize: '14px',
              padding: '8px 12px',
              borderRadius: '6px',
              backgroundColor: 'rgba(208, 255, 113, 0.1)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            <span className="d-none d-sm-inline">Abrir PDF</span>
          </a>
        </div>

        {/* Área del PDF */}
        <div 
          style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {isMobile ? (
            // En móvil, mostrar opciones para abrir el PDF directamente
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              color: '#fff',
              gap: '24px',
              padding: '30px',
              textAlign: 'center',
            }}>
              {/* Imagen de portada si existe */}
              {book.coverUrl && (
                <img 
                  src={book.coverUrl} 
                  alt={book.title}
                  style={{
                    maxWidth: '200px',
                    maxHeight: '280px',
                    borderRadius: '8px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  }}
                />
              )}
              
              <div>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '20px' }}>{book.title}</h2>
                <p style={{ color: '#999', margin: 0, fontSize: '14px' }}>
                  {book.category || 'General'}
                </p>
              </div>
              
              <p style={{ color: '#a0a0a0', margin: 0, maxWidth: '300px', fontSize: '14px', lineHeight: '1.5' }}>
                Toca el botón para abrir el libro en el visor de PDF de tu dispositivo
              </p>
              
              <a
                href={book.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '16px 32px',
                  backgroundColor: '#D0FF71',
                  color: '#000',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  boxShadow: '0 4px 15px rgba(208, 255, 113, 0.3)',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                Abrir Libro
              </a>
              
              <p style={{ color: '#666', margin: '10px 0 0 0', fontSize: '12px' }}>
                El PDF se abrirá en una nueva pestaña
              </p>
            </div>
          ) : (
            // En desktop, usar iframe directo
            <>
              {isLoading && (
                <div style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#fff',
                  gap: '15px',
                  zIndex: 1,
                  backgroundColor: '#1a1a1a',
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #444',
                    borderTop: '3px solid #D0FF71',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }} />
                  <span>Cargando libro...</span>
                  <style>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
              )}
              <iframe
                src={book.pdfUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                onLoad={() => setIsLoading(false)}
                title={book.title}
                allow="fullscreen"
              />
            </>
          )}
        </div>
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
