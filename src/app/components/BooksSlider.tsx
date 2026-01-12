'use client'

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Book } from '@/lib/books';

export default function BooksSlider() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(5);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Calcular slides por vista según el ancho de pantalla
  useEffect(() => {
    const updateSlidesPerView = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 480) {
          setSlidesPerView(1);
        } else if (window.innerWidth < 768) {
          setSlidesPerView(2);
        } else if (window.innerWidth < 992) {
          setSlidesPerView(3);
        } else {
          setSlidesPerView(5);
        }
      }
    };

    updateSlidesPerView();
    window.addEventListener('resize', updateSlidesPerView);
    return () => window.removeEventListener('resize', updateSlidesPerView);
  }, []);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/books');
      
      if (!response.ok) {
        throw new Error('Error al cargar los libros');
      }
      
      const data = await response.json();
      const booksData = data.books || [];
      // Solo tomamos los primeros 10 libros
      setBooks(booksData.slice(0, 10));
    } catch (err) {
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Navegación del slider
  const goToSlide = (index: number) => {
    const maxIndex = books.length; // +1 para incluir el "Ver más"
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  const nextSlide = () => goToSlide(currentIndex + 1);
  const prevSlide = () => goToSlide(currentIndex - 1);

  // Touch handlers para mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  if (loading) {
    return (
      <div className="books-slider-section" style={{ padding: '80px 0', background: '#1a1b1e' }}>
        <div className="container container-1430">
          <div className="text-center">
            <div className="spinner-border" role="status" style={{ color: '#6c9fff' }}>
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return null;
  }

  // Total de slides: libros + 1 (ver más)
  const totalSlides = books.length + 1;

  return (
    <div className="books-slider-section" style={{ padding: '80px 0', background: '#1a1b1e', overflow: 'hidden' }}>
      <style jsx global>{`
        .books-slider-container {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 60px;
        }
        
        .books-slider-track {
          display: flex;
          gap: 20px;
          transition: transform 0.4s ease-out;
        }
        
        .book-slide {
          flex: 0 0 calc(20% - 16px);
          min-width: 200px;
        }
        
        .book-slide-card {
          background: linear-gradient(135deg, #2d2e32 0%, #1a1b1e 100%);
          border: 1px solid #3a3b3f;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          text-decoration: none;
          display: block;
          height: 100%;
        }
        
        .book-slide-card:hover {
          border-color: #6c9fff;
          box-shadow: 0 8px 25px rgba(108, 159, 255, 0.2);
          transform: translateY(-4px);
        }
        
        .book-slide-cover {
          width: 100%;
          aspect-ratio: 3/4;
          background: rgba(108, 159, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        
        .book-slide-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .book-slide-content {
          padding: 16px;
        }
        
        .book-slide-category {
          background: rgba(108, 159, 255, 0.15);
          color: #8bb4ff;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          display: inline-block;
          margin-bottom: 8px;
        }
        
        .book-slide-title {
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.4;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .slider-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #2d2e32;
          border: 1px solid #3a3b3f;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 10;
        }
        
        .slider-nav-btn:hover:not(:disabled) {
          background: #6c9fff;
          border-color: #6c9fff;
        }
        
        .slider-nav-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        
        .slider-nav-prev {
          left: 0;
        }
        
        .slider-nav-next {
          right: 0;
        }
        
        .see-more-card {
          background: linear-gradient(135deg, #2d2e32 0%, #1a1b1e 100%);
          border: 2px dashed #3a3b3f;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: all 0.3s ease;
          min-height: 320px;
          height: 100%;
        }
        
        .see-more-card:hover {
          border-color: #6c9fff;
          background: rgba(108, 159, 255, 0.05);
        }
        
        .see-more-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(108, 159, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          color: #6c9fff;
        }
        
        .see-more-text {
          color: #ffffff;
          font-size: 16px;
          font-weight: 600;
        }
        
        .slider-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
        }
        
        .slider-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #3a3b3f;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }
        
        .slider-dot.active {
          background: #6c9fff;
          width: 24px;
          border-radius: 4px;
        }
        
        @media (max-width: 992px) {
          .book-slide {
            flex: 0 0 calc(33.33% - 14px);
            min-width: 180px;
          }
          .books-slider-container {
            padding: 0 50px;
          }
        }
        
        @media (max-width: 768px) {
          .book-slide {
            flex: 0 0 calc(50% - 10px);
            min-width: 150px;
          }
          .books-slider-container {
            padding: 0 40px;
          }
          .slider-nav-btn {
            width: 36px;
            height: 36px;
          }
        }
        
        @media (max-width: 480px) {
          .book-slide {
            flex: 0 0 100%;
            min-width: auto;
          }
          .books-slider-container {
            padding: 0 50px;
          }
          .see-more-card {
            min-height: 280px;
          }
        }
      `}</style>

      <div className="container container-1430">
        {/* Header */}
        <div className="row mb-40">
          <div className="col-lg-3">
            <span className="tp-section-subtitle-clash clash-subtitle-pos body-ff" style={{ color: '#ffffff' }}>
              BIBLIOTECA
              <i>
                <svg width="102" height="9" viewBox="0 0 102 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M98 8L101.5 4.5L98 1M1 4H101V5H1V4Z" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </i>
            </span>
          </div>
          <div className="col-lg-9">
            <h2 className="tp-section-title-teko fs-80" style={{ color: '#ffffff' }}>
              Biblioteca de la <span style={{ color: '#6c9fff' }}>Comunidad</span>
            </h2>
            <p style={{ color: '#a0a0a0', fontSize: '16px', marginTop: '10px' }}>
              Accede a nuestra biblioteca digital con recursos técnicos seleccionados para la comunidad
            </p>
          </div>
        </div>

        {/* Slider */}
        <div className="books-slider-container">
          {/* Botón anterior */}
          <button 
            className="slider-nav-btn slider-nav-prev"
            onClick={prevSlide}
            disabled={currentIndex === 0}
            aria-label="Anterior"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          {/* Track del slider */}
          <div 
            ref={sliderRef}
            className="books-slider-track"
            style={{
              transform: `translateX(calc(-${currentIndex * (100 / slidesPerView)}% - ${currentIndex * 20}px))`
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Tarjeta Ver Más */}
            <div className="book-slide">
              <Link href="/club/libros" className="see-more-card">
                <div className="see-more-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5v14"/>
                  </svg>
                </div>
                <span className="see-more-text">Ver todos los libros</span>
              </Link>
            </div>

            {/* Libros */}
            {books.map((book) => (
              <div key={book.filename} className="book-slide">
                <a 
                  href={book.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="book-slide-card"
                >
                  <div className="book-slide-cover">
                    {book.coverUrl ? (
                      <img src={book.coverUrl} alt={book.title} />
                    ) : (
                      <svg 
                        width="48" 
                        height="48" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ color: '#6c9fff' }}
                      >
                        <path 
                          d="M4 19.5C4 18.1193 5.11929 17 6.5 17H20" 
                          stroke="currentColor" 
                          strokeWidth="1.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                        <path 
                          d="M6.5 2H20V22H6.5C5.11929 22 4 20.8807 4 19.5V4.5C4 3.11929 5.11929 2 6.5 2Z" 
                          stroke="currentColor" 
                          strokeWidth="1.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="book-slide-content">
                    <span className="book-slide-category">{book.category || 'General'}</span>
                    <h5 className="book-slide-title">{book.title}</h5>
                  </div>
                </a>
              </div>
            ))}
          </div>

          {/* Botón siguiente */}
          <button 
            className="slider-nav-btn slider-nav-next"
            onClick={nextSlide}
            disabled={currentIndex >= totalSlides - slidesPerView}
            aria-label="Siguiente"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        {/* Dots de navegación (para mobile) */}
        <div className="slider-dots d-md-none">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${currentIndex === index ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
