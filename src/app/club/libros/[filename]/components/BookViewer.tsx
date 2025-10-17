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
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = React.useState(false);
  const [desktopWidth, setDesktopWidth] = React.useState<number | undefined>(undefined);

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
        style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none' }}
      >
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
        `}</style>
        {isMobile ? (
          <div style={{ height: '100vh', width: '100vw', overflow: 'auto' }}>
            <MobilePDFReader
              url={book.pdfUrl}
              scale="auto"
              minScale={0.25}
              maxScale={10}
              isShowHeader={false}
              isShowFooter={false}
            />
          </div>
        ) : (
          <div style={{ width: '50%', margin: '0 auto' }}>
            <PDFReader
              url={{ url: book.pdfUrl, withCredentials: true }}
              showAllPage={true}
              width={desktopWidth}
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
