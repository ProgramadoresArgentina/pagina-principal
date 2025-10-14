'use client'

import { useState, useEffect } from 'react';
import { Book } from '@/lib/books';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

export default function BooksList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    // Solo cargar libros si el usuario está autenticado y suscrito
    if (isAuthenticated && user?.isSubscribed) {
      fetchBooks();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user?.isSubscribed]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      
      // Obtener token del localStorage
      const token = localStorage.getItem('token');
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/books', { headers });
      
      if (!response.ok) {
        throw new Error('Error al cargar los libros');
      }
      
      const data = await response.json();
      const booksData = data.books || [];
      setBooks(booksData);
      setFilteredBooks(booksData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  // Ya no necesitamos el modal, los libros se abren en páginas separadas

  // Función para normalizar texto (quitar acentos y convertir a minúsculas)
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Quitar acentos
      .trim();
  };

  // Función para filtrar libros
  const filterBooks = (books: Book[], searchTerm: string): Book[] => {
    if (!searchTerm.trim()) {
      return books;
    }

    const normalizedSearchTerm = normalizeText(searchTerm);
    
    return books.filter(book => {
      const normalizedTitle = normalizeText(book.title);
      return normalizedTitle.includes(normalizedSearchTerm);
    });
  };

  // Efecto para filtrar libros cuando cambia el término de búsqueda
  useEffect(() => {
    const filtered = filterBooks(books, searchTerm);
    setFilteredBooks(filtered);
  }, [books, searchTerm]);

  // Si no está autenticado o no está suscrito, mostrar mensaje de bloqueo
  if (!isAuthenticated || !user?.isSubscribed) {
    return (
      <div className="row">
        <div className="col-12">
          <div className="locked-content">
            <div className="tp-blog-locked-content p-relative">
              <div className="tp-blog-locked-overlay"></div>
              <div className="tp-blog-locked-info text-center">
                <div className="tp-blog-locked-icon mb-30">
                  <svg width="50" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 10V8C6 5.79086 7.79086 4 10 4H14C16.2091 4 18 5.79086 18 8V10M6 10H4C2.89543 10 2 10.8954 2 12V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20V12C22 10.8954 21.1046 10 20 10H18M6 10H18" stroke="#D0FF71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h4 className="tp-blog-locked-title mb-20 text-white">Solo miembros del club pueden acceder a la biblioteca</h4>
                <p className="tp-blog-locked-description mb-30 text-white">
                  Esta biblioteca de libros técnicos es exclusiva para miembros suscritos al Club de Programadores Argentina. 
                  Únete para acceder a nuestra colección de libros de programación, desarrollo y tecnología.
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
                        <span className="tp-btn-black-text">Suscribirse al Club</span>
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
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="row">
        <div className="col-12 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3" style={{ color: '#ffffff' }}>Cargando biblioteca...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="row">
        <div className="col-12 text-center">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error</h4>
            <p>{error}</p>
            <hr />
            <button 
              className="btn btn-outline-danger" 
              onClick={fetchBooks}
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="row">
        <div className="col-12 text-center">
          <div className="alert alert-info" role="alert">
            <h4 className="alert-heading">Biblioteca Vacía</h4>
            <p>No hay libros disponibles en este momento.</p>
            <p className="mb-0">Estamos trabajando para agregar contenido exclusivo.</p>
          </div>
        </div>
      </div>
    );
  }

  if (filteredBooks.length === 0 && searchTerm.trim()) {
    return (
      <div className="row">
        <div className="col-12">
          {/* Buscador */}
          <div className="search-container mb-4">
            <div className="search-box" style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
              <input
                type="text"
                placeholder="Buscar libros por título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 20px 12px 50px',
                  border: '2px solid #3a3b3f',
                  borderRadius: '25px',
                  backgroundColor: '#2d2e32',
                  color: '#ffffff',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#D0FF71';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3a3b3f';
                }}
              />
              <div 
                style={{
                  position: 'absolute',
                  left: '18px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#a0a0a0'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="alert alert-warning" role="alert">
              <h4 className="alert-heading">No se encontraron libros</h4>
              <p>No hay libros que coincidan con tu búsqueda: <strong>"{searchTerm}"</strong></p>
              <p className="mb-0">Intenta con otros términos de búsqueda.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Buscador */}
      <div className="search-container mb-4">
        <div className="search-box" style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
          <input
            type="text"
            placeholder="Buscar libros por título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 20px 12px 50px',
              border: '2px solid #3a3b3f',
              borderRadius: '25px',
              backgroundColor: '#2d2e32',
              color: '#ffffff',
              fontSize: '16px',
              outline: 'none',
              transition: 'border-color 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#D0FF71';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#3a3b3f';
            }}
          />
          <div 
            style={{
              position: 'absolute',
              left: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#a0a0a0'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Contador de resultados */}
      {searchTerm.trim() && (
        <div className="text-center mb-3">
          <p style={{ color: '#a0a0a0', fontSize: '14px', margin: 0 }}>
            {filteredBooks.length === 1 
              ? '1 libro encontrado' 
              : `${filteredBooks.length} libros encontrados`
            }
            {searchTerm.trim() && ` para "${searchTerm}"`}
          </p>
        </div>
      )}

      <div className="row">
        {filteredBooks.map((book, index) => (
          <div key={book.filename} className="col-lg-4 col-md-6 mb-4">
            <a 
              href={`/club/libros/${book.filename}`}
              className="book-card"
              style={{
                background: 'linear-gradient(135deg, #2d2e32 0%, #1a1b1e 100%)',
                border: '1px solid #3a3b3f',
                borderRadius: '12px',
                padding: '20px',
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                display: 'block',
                textDecoration: 'none',
                color: 'inherit'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = '#D0FF71';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(208, 255, 113, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#3a3b3f';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Book Icon */}
              <div className="book-icon mb-3 text-center">
                <svg 
                  width="48" 
                  height="48" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ color: '#D0FF71' }}
                >
                  <path 
                    d="M4 19.5C4 18.1193 5.11929 17 6.5 17H20" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                  <path 
                    d="M6.5 2H20V22H6.5C5.11929 22 4 20.8807 4 19.5V4.5C4 3.11929 5.11929 2 6.5 2Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Book Title */}
              <h5 
                className="book-title mb-3"
                style={{
                  color: '#ffffff',
                  fontSize: '18px',
                  fontWeight: '600',
                  lineHeight: '1.4',
                  textAlign: 'center'
                }}
              >
                {book.title}
              </h5>

              {/* Book Info */}
              <div className="book-info">
                {book.size && (
                  <p 
                    className="mb-2"
                    style={{ 
                      color: '#a0a0a0', 
                      fontSize: '14px',
                      textAlign: 'center'
                    }}
                  >
                    Tamaño: {(book.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                )}
                
                {/* Progress Bar */}
                {book.progress && (
                  <div className="mb-3">
                    <div 
                      style={{
                        background: '#3a3b3f',
                        borderRadius: '10px',
                        height: '6px',
                        overflow: 'hidden',
                        marginBottom: '8px'
                      }}
                    >
                      <div 
                        style={{
                          background: 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)',
                          height: '100%',
                          width: `${book.progress.progress}%`,
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                    <p 
                      style={{ 
                        color: '#D0FF71', 
                        fontSize: '12px',
                        textAlign: 'center',
                        margin: 0
                      }}
                    >
                      {book.progress.isCompleted ? '✅ Completado' : `${book.progress.progress.toFixed(1)}% leído`}
                    </p>
                    {book.progress.currentPage && book.progress.totalPages && (
                      <p 
                        style={{ 
                          color: '#a0a0a0', 
                          fontSize: '11px',
                          textAlign: 'center',
                          margin: '2px 0 0 0'
                        }}
                      >
                        Página {book.progress.currentPage} de {book.progress.totalPages}
                      </p>
                    )}
                  </div>
                )}
                
                <div className="text-center">
                  <span 
                    className="badge"
                    style={{
                      background: book.progress?.isCompleted 
                        ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
                        : 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)',
                      color: '#1a1b1e',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  >
                    {book.progress?.isCompleted ? '✅ Completado' : '📖 PDF Disponible'}
                  </span>
                </div>
              </div>

              {/* Hover Effect */}
              <div 
                className="book-hover-effect"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(135deg, rgba(208, 255, 113, 0.1) 0%, rgba(168, 214, 90, 0.1) 100%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  pointerEvents: 'none'
                }}
              />
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
