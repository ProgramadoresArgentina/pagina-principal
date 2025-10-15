'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useAuth } from '@/contexts/AuthContext';
import { Book } from '@/lib/books';

// Configurar worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  book: Book;
  onProgressUpdate?: (page: number, totalPages: number) => void;
}

export default function PDFViewer({ book, onProgressUpdate }: PDFViewerProps) {
  const { user, token } = useAuth();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSaveTime = useRef<number>(0);
  const saveInterval = 5000; // Guardar cada 5 segundos

  // Cargar progreso guardado al montar el componente
  useEffect(() => {
    if (book.progress && book.progress.currentPage > 0) {
      setPageNumber(book.progress.currentPage);
    }
  }, [book.progress]);

  // Función para guardar progreso
  const saveProgress = useCallback(async (currentPage: number, totalPages: number) => {
    if (!user?.id || !token || Date.now() - lastSaveTime.current < saveInterval) {
      return;
    }

    try {
      const response = await fetch('/api/books/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookTitle: book.title,
          bookFilename: book.filename,
          currentPage,
          totalPages,
        }),
      });

      if (response.ok) {
        lastSaveTime.current = Date.now();
        onProgressUpdate?.(currentPage, totalPages);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }, [user?.id, token, book.title, book.filename, onProgressUpdate]);

  // Guardar progreso cuando cambie la página
  useEffect(() => {
    if (numPages > 0 && pageNumber > 0) {
      saveProgress(pageNumber, numPages);
    }
  }, [pageNumber, numPages, saveProgress]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setError('Error al cargar el PDF');
    setLoading(false);
  };

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  const goToPage = (page: number) => {
    const pageNum = Math.max(1, Math.min(page, numPages));
    setPageNumber(pageNum);
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const resetZoom = () => {
    setScale(1.0);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Prevenir descarga del PDF
  const preventDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const preventContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  if (loading) {
    return (
      <div className="pdf-viewer-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando PDF...</span>
        </div>
        <p className="mt-3">Cargando {book.title}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pdf-viewer-error">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error al cargar el PDF</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">Por favor, intenta recargar la página.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`pdf-viewer-container ${isFullscreen ? 'fullscreen' : ''}`}
      onContextMenu={preventContextMenu}
      onClick={preventDownload}
    >
      {/* Controles de navegación */}
      <div className="pdf-controls">
        <div className="pdf-controls-left">
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            title="Página anterior"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <span className="page-info">
            <input
              type="number"
              className="form-control form-control-sm page-input"
              value={pageNumber}
              onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
              min={1}
              max={numPages}
              title="Ir a página"
            />
            <span className="page-total">de {numPages}</span>
          </span>
          
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={goToNextPage}
            disabled={pageNumber >= numPages}
            title="Página siguiente"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        <div className="pdf-controls-center">
          <span className="book-title">{book.title}</span>
        </div>

        <div className="pdf-controls-right">
          <div className="zoom-controls">
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={zoomOut}
              title="Alejar"
            >
              <i className="fas fa-search-minus"></i>
            </button>
            <span className="zoom-level">{Math.round(scale * 100)}%</span>
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={zoomIn}
              title="Acercar"
            >
              <i className="fas fa-search-plus"></i>
            </button>
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={resetZoom}
              title="Zoom original"
            >
              <i className="fas fa-expand-arrows-alt"></i>
            </button>
          </div>
          
          <button 
            className="btn btn-outline-secondary btn-sm"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
          >
            <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
          </button>
        </div>
      </div>

      {/* Contenedor del PDF */}
      <div className="pdf-content" onContextMenu={preventContextMenu}>
        <Document
          file={book.pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<div className="pdf-loading">Cargando página...</div>}
          error={<div className="pdf-error">Error al cargar la página</div>}
          options={{
            cMapUrl: `//unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
            cMapPacked: true,
            disableAutoFetch: false,
            disableStream: false,
          }}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            onLoadSuccess={() => {
              // Prevenir descarga desde el canvas
              const canvas = document.querySelector('canvas');
              if (canvas) {
                canvas.oncontextmenu = (e: Event) => {
                  e.preventDefault();
                };
                canvas.onclick = (e: Event) => {
                  e.preventDefault();
                  e.stopPropagation();
                };
              }
            }}
          />
        </Document>
      </div>

      {/* Barra de progreso */}
      <div className="pdf-progress">
        <div className="progress">
          <div 
            className="progress-bar" 
            role="progressbar" 
            style={{ width: `${(pageNumber / numPages) * 100}%` }}
            aria-valuenow={pageNumber} 
            aria-valuemin={0} 
            aria-valuemax={numPages}
          >
            {Math.round((pageNumber / numPages) * 100)}%
          </div>
        </div>
      </div>

      <style jsx>{`
        .pdf-viewer-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: #f8f9fa;
          position: relative;
        }

        .pdf-viewer-container.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9999;
          background: white;
        }

        .pdf-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 15px;
          background: white;
          border-bottom: 1px solid #dee2e6;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          z-index: 10;
        }

        .pdf-controls-left,
        .pdf-controls-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pdf-controls-center {
          flex: 1;
          text-align: center;
        }

        .book-title {
          font-weight: 600;
          color: #495057;
          font-size: 16px;
        }

        .page-info {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .page-input {
          width: 60px;
          text-align: center;
        }

        .page-total {
          color: #6c757d;
          font-size: 14px;
        }

        .zoom-controls {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .zoom-level {
          min-width: 40px;
          text-align: center;
          font-size: 14px;
          color: #495057;
        }

        .pdf-content {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 20px;
          overflow: auto;
          background: #f8f9fa;
        }

        .pdf-progress {
          padding: 10px 15px;
          background: white;
          border-top: 1px solid #dee2e6;
        }

        .pdf-viewer-loading,
        .pdf-viewer-error {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
          padding: 20px;
        }

        .pdf-loading,
        .pdf-error {
          padding: 20px;
          text-align: center;
          color: #6c757d;
        }

        /* Prevenir selección de texto y descarga */
        .pdf-content canvas {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          pointer-events: none;
        }

        .pdf-content {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .pdf-controls {
            flex-direction: column;
            gap: 10px;
            padding: 10px;
          }

          .pdf-controls-left,
          .pdf-controls-right {
            width: 100%;
            justify-content: center;
          }

          .pdf-controls-center {
            order: -1;
          }

          .book-title {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}