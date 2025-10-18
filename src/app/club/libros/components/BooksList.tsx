'use client'

import { useState, useEffect, useCallback } from 'react';
import { Book } from '@/lib/books';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

export default function BooksList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, isAuthenticated, token } = useAuth();
  const pathname = usePathname();

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Usar el token del contexto de autenticación
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
  }, [token]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

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

  // Eliminado el bloqueo - todos pueden ver la colección

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
                className="search-input-placeholder-white"
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
      {/* Estilo para placeholder blanco */}
      <style jsx global>{`
        .search-input-placeholder-white::placeholder {
          color: #ffffff !important;
          opacity: 0.7;
        }
        .search-input-placeholder-white::-webkit-input-placeholder {
          color: #ffffff !important;
          opacity: 0.7;
        }
        .search-input-placeholder-white::-moz-placeholder {
          color: #ffffff !important;
          opacity: 0.7;
        }
        .search-input-placeholder-white:-ms-input-placeholder {
          color: #ffffff !important;
          opacity: 0.7;
        }
      `}</style>
      
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
            className="search-input-placeholder-white"
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
          <div key={book.filename} className="col-12 mb-3">
            <a 
              href={`/club/libros/${book.filename}`}
              className="book-card"
              style={{
                background: 'linear-gradient(135deg, #2d2e32 0%, #1a1b1e 100%)',
                border: '1px solid #3a3b3f',
                borderRadius: '12px',
                padding: '20px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                textDecoration: 'none',
                color: 'inherit',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#D0FF71';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(208, 255, 113, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#3a3b3f';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* PDF Icon a la izquierda */}
              <div style={{
                flexShrink: 0,
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(208, 255, 113, 0.1)',
                borderRadius: '8px'
              }}>
                <svg 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ color: '#D0FF71' }}
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
                  <path 
                    d="M8 7H16M8 11H16M8 15H12" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Información del libro */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h5 
                  className="book-title"
                  style={{
                    color: '#ffffff',
                    fontSize: '18px',
                    fontWeight: '600',
                    lineHeight: '1.4',
                    margin: '0 0 8px 0'
                  }}
                >
                  {book.title}
                </h5>

                {/* Información adicional en una línea */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {book.size && (
                    <span style={{ color: '#a0a0a0', fontSize: '13px' }}>
                      📄 {(book.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  )}
                  
                  {/* Progress info - Solo si está logueado y hay progreso */}
                  {isAuthenticated && book.progress && book.progress.progress > 0 && (
                    <>
                      <span style={{ 
                        color: '#D0FF71', 
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>
                        {book.progress.progress > 98 
                          ? '✅ Leído' 
                          : `${Math.round(100 - book.progress.progress)}% por leer`}
                      </span>
                      {book.progress.currentPage && book.progress.totalPages && (
                        <span style={{ color: '#a0a0a0', fontSize: '12px' }}>
                          Página {book.progress.currentPage} de {book.progress.totalPages}
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Barra de progreso horizontal - Solo si hay progreso */}
                {isAuthenticated && book.progress && book.progress.progress > 0 && (
                  <div 
                    style={{
                      background: '#3a3b3f',
                      borderRadius: '10px',
                      height: '6px',
                      overflow: 'hidden',
                      marginTop: '12px',
                      maxWidth: '400px'
                    }}
                  >
                    <div 
                      style={{
                        background: 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)',
                        height: '100%',
                        width: `${Math.min(100, book.progress.progress)}%`,
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Badge a la derecha */}
              {isAuthenticated && (
                <div style={{ flexShrink: 0 }}>
                  <span 
                    className="badge"
                    style={{
                      background: (book.progress?.progress ?? 0) > 98
                        ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
                        : (book.progress?.progress ?? 0) > 0
                        ? 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)'
                        : 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)',
                      color: '#1a1b1e',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '700',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {(book.progress?.progress ?? 0) > 98
                      ? '✅ Leído' 
                      : (book.progress?.progress ?? 0) > 0
                      ? '📖 Continuar'
                      : '📚 Leer'}
                  </span>
                </div>
              )}
            </a>
          </div>
        ))}
      </div>
    </>
  );
}
