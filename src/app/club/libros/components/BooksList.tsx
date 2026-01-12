'use client'

import { useState, useEffect, useCallback } from 'react';
import { Book } from '@/lib/books';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

const BOOKS_PER_PAGE = 5;

export default function BooksList() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
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
      
      // Extraer categorías únicas
      const uniqueCategories = Array.from(new Set(booksData.map((book: Book) => book.category || 'General'))) as string[];
      setCategories(['Todas', ...uniqueCategories.sort()]);
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
  const filterBooks = (books: Book[], searchTerm: string, category: string): Book[] => {
    let filtered = books;
    
    // Filtrar por categoría
    if (category !== 'Todas') {
      filtered = filtered.filter(book => (book.category || 'General') === category);
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const normalizedSearchTerm = normalizeText(searchTerm);
      filtered = filtered.filter(book => {
        const normalizedTitle = normalizeText(book.title);
        return normalizedTitle.includes(normalizedSearchTerm);
      });
    }
    
    return filtered;
  };

  // Efecto para filtrar libros cuando cambia el término de búsqueda o categoría
  useEffect(() => {
    const filtered = filterBooks(books, searchTerm, selectedCategory);
    setFilteredBooks(filtered);
    setCurrentPage(1); // Resetear a la primera página cuando cambia el filtro
  }, [books, searchTerm, selectedCategory]);

  // Calcular libros paginados
  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);
  const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
  const endIndex = startIndex + BOOKS_PER_PAGE;
  const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

  // Funciones de navegación
  const goToPage = (page: number) => {
    const validPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(validPage);
    // Scroll suave hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevPage = () => goToPage(currentPage - 1);
  const nextPage = () => goToPage(currentPage + 1);

  // Función para obtener el color de cada categoría
  const getCategoryColor = (category: string): { bg: string; text: string } => {
    const colors: Record<string, { bg: string; text: string }> = {
      'JavaScript': { bg: 'rgba(247, 223, 30, 0.15)', text: '#f7df1e' },
      'Python': { bg: 'rgba(55, 118, 171, 0.15)', text: '#3776ab' },
      'TypeScript': { bg: 'rgba(49, 120, 198, 0.15)', text: '#3178c6' },
      'React': { bg: 'rgba(97, 218, 251, 0.15)', text: '#61dafb' },
      'Node.js': { bg: 'rgba(104, 160, 99, 0.15)', text: '#68a063' },
      'DevOps': { bg: 'rgba(255, 107, 107, 0.15)', text: '#ff6b6b' },
      'Database': { bg: 'rgba(255, 159, 64, 0.15)', text: '#ff9f40' },
      'Web': { bg: 'rgba(108, 159, 255, 0.15)', text: '#6c9fff' },
      'Mobile': { bg: 'rgba(156, 39, 176, 0.15)', text: '#9c27b0' },
      'Design': { bg: 'rgba(233, 30, 99, 0.15)', text: '#e91e63' },
      'Security': { bg: 'rgba(244, 67, 54, 0.15)', text: '#f44336' },
      'AI': { bg: 'rgba(76, 175, 80, 0.15)', text: '#4caf50' },
      'Backend': { bg: 'rgba(255, 152, 0, 0.15)', text: '#ff9800' },
      'Frontend': { bg: 'rgba(0, 188, 212, 0.15)', text: '#00bcd4' },
      'General': { bg: 'rgba(158, 158, 158, 0.15)', text: '#9e9e9e' },
    };

    return colors[category] || colors['General'];
  };

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

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

  // Si no hay libros filtrados y hay término de búsqueda, mostrar mensaje de no encontrados
  if (filteredBooks.length === 0 && searchTerm.trim()) {
    return (
      <div className="row">
        <div className="col-12">
          {/* Buscador + Dropdown en línea */}
          <div className="search-filter-container mb-4" style={{ 
            padding: '0 16px',
            display: 'flex',
            flexDirection: 'row',
            gap: '12px',
            maxWidth: '800px',
            margin: '0 auto',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <div className="search-box" style={{ 
              position: 'relative', 
              flex: '1 1 300px',
              maxWidth: '500px',
              minWidth: '200px'
            }}>
              <input
                type="text"
                placeholder="Buscar libros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 44px 12px 44px',
                  border: '2px solid #3a3b3f',
                  borderRadius: '12px',
                  backgroundColor: '#2d2e32',
                  color: '#ffffff',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  height: '48px'
                }}
                className="search-input-placeholder-white"
                onFocus={(e) => {
                  e.target.style.borderColor = '#6c9fff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3a3b3f';
                }}
              />
              <div 
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6c9fff',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                  <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: '#a0a0a0',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    width: '24px',
                    height: '24px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#a0a0a0';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
            </div>

            <div style={{ position: 'relative', flex: '0 0 auto', minWidth: '160px' }}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 36px 12px 14px',
                  backgroundColor: '#2d2e32',
                  color: '#ffffff',
                  border: '2px solid #3a3b3f',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  appearance: 'none',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  height: '48px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6c9fff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3a3b3f';
                }}
              >
                {categories.map((category) => (
                  <option key={category} value={category} style={{ backgroundColor: '#2d2e32', color: '#ffffff' }}>
                    {category}
                  </option>
                ))}
              </select>
              <div style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#6c9fff'
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="alert alert-warning" role="alert">
              <h4 className="alert-heading">No se encontraron libros</h4>
              <p>No hay libros que coincidan con tu búsqueda: <strong>&quot;{searchTerm}&quot;</strong></p>
              <p className="mb-0">Intenta con otros términos de búsqueda.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si no hay libros filtrados y no hay término de búsqueda, mostrar mensaje de categoría vacía
  if (filteredBooks.length === 0 && !searchTerm.trim()) {
    return (
      <div className="row">
        <div className="col-12">
          {/* Buscador + Dropdown en línea */}
          <div className="search-filter-container mb-4" style={{ 
            padding: '0 16px',
            display: 'flex',
            flexDirection: 'row',
            gap: '12px',
            maxWidth: '800px',
            margin: '0 auto',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <div className="search-box" style={{ 
              position: 'relative', 
              flex: '1 1 300px',
              maxWidth: '500px',
              minWidth: '200px'
            }}>
              <input
                type="text"
                placeholder="Buscar libros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 44px 12px 44px',
                  border: '2px solid #3a3b3f',
                  borderRadius: '12px',
                  backgroundColor: '#2d2e32',
                  color: '#ffffff',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  height: '48px'
                }}
                className="search-input-placeholder-white"
                onFocus={(e) => {
                  e.target.style.borderColor = '#6c9fff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3a3b3f';
                }}
              />
              <div 
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6c9fff',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
                  <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            <div style={{ position: 'relative', flex: '0 0 auto', minWidth: '160px' }}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 36px 12px 14px',
                  backgroundColor: '#2d2e32',
                  color: '#ffffff',
                  border: '2px solid #3a3b3f',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  appearance: 'none',
                  outline: 'none',
                  transition: 'border-color 0.3s ease',
                  height: '48px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#6c9fff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#3a3b3f';
                }}
              >
                {categories.map((category) => (
                  <option key={category} value={category} style={{ backgroundColor: '#2d2e32', color: '#ffffff' }}>
                    {category}
                  </option>
                ))}
              </select>
              <div style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: '#6c9fff'
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="alert alert-info" role="alert">
              <h4 className="alert-heading">Categoría vacía</h4>
              <p>No hay libros disponibles en la categoría <strong>&quot;{selectedCategory}&quot;</strong>.</p>
              <p className="mb-0">Prueba con otra categoría o busca en &quot;Todas&quot;.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Estilos para mobile y placeholder */}
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
        
        /* Estilos mobile para la biblioteca */
        @media (max-width: 768px) {
          .book-card {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center;
            padding: 0 !important;
          }
          
          .book-card .book-cover {
            width: 100% !important;
            min-width: 100% !important;
            height: auto !important;
            aspect-ratio: 3/4;
            border-radius: 12px 12px 0 0 !important;
          }
          
          .book-card .book-content {
            padding: 16px !important;
            width: 100%;
          }
          
          .book-title {
            font-size: 15px !important;
            line-height: 1.3 !important;
          }
          
          .search-container {
            margin-bottom: 20px !important;
          }
          
          .search-box {
            padding: 0 8px !important;
          }
          
          .search-box input {
            font-size: 16px !important;
            padding: 12px 20px 12px 45px !important;
          }
        }
        
        /* Mejoras para touch en mobile */
        @media (max-width: 768px) {
          .book-card {
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
          }
          
          .search-box button {
            min-width: 32px !important;
            min-height: 32px !important;
          }
        }
      `}</style>
      
      {/* Buscador + Dropdown en una línea */}
      <div className="search-filter-container mb-4" style={{ 
        padding: '0 16px',
        display: 'flex',
        flexDirection: 'row',
        gap: '12px',
        maxWidth: '800px',
        margin: '0 auto',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {/* Buscador */}
        <div className="search-box" style={{ 
          position: 'relative', 
          flex: '1 1 300px',
          maxWidth: '500px',
          minWidth: '200px'
        }}>
          <input
            type="text"
            placeholder="Buscar libros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 44px 12px 44px',
              border: '2px solid #3a3b3f',
              borderRadius: '12px',
              backgroundColor: '#2d2e32',
              color: '#ffffff',
              fontSize: '15px',
              outline: 'none',
              transition: 'border-color 0.3s ease',
              height: '48px'
            }}
            className="search-input-placeholder-white"
            onFocus={(e) => {
              e.target.style.borderColor = '#6c9fff';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#3a3b3f';
            }}
          />
          <div 
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6c9fff',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
              <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          
          {/* Botón de limpiar búsqueda */}
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#a0a0a0',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                width: '24px',
                height: '24px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#a0a0a0';
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Dropdown de categoría */}
        <div style={{ position: 'relative', flex: '0 0 auto', minWidth: '160px' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 36px 12px 14px',
              backgroundColor: '#2d2e32',
              color: '#ffffff',
              border: '2px solid #3a3b3f',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer',
              appearance: 'none',
              outline: 'none',
              transition: 'border-color 0.3s ease',
              height: '48px'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#6c9fff';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#3a3b3f';
            }}
          >
            {categories.map((category) => (
              <option key={category} value={category} style={{ backgroundColor: '#2d2e32', color: '#ffffff' }}>
                {category}
              </option>
            ))}
          </select>
          <div style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: '#6c9fff'
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Contador de resultados mobile-friendly */}
      {(searchTerm.trim() || selectedCategory !== 'Todas') && (
        <div className="text-center mb-3" style={{ padding: '0 16px' }}>
          <p style={{ 
            color: '#a0a0a0', 
            fontSize: '14px', 
            margin: 0,
            lineHeight: '1.4'
          }}>
            {filteredBooks.length === 1 
              ? '1 libro encontrado' 
              : `${filteredBooks.length} libros encontrados`
            }
            {searchTerm.trim() && (
              <span style={{ display: 'block', fontSize: '12px', marginTop: '2px' }}>
                para &quot;{searchTerm}&quot;
              </span>
            )}
            {selectedCategory !== 'Todas' && (
              <span style={{ display: 'block', fontSize: '12px', marginTop: '2px' }}>
                en categoría &quot;{selectedCategory}&quot;
              </span>
            )}
          </p>
        </div>
      )}

      {/* Lista de libros en filas */}
      <div className="books-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 16px' }}>
        {paginatedBooks.map((book, index) => {
          const categoryColors = getCategoryColor(book.category || 'General');
          return (
            <a 
              key={book.filename}
              href={book.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="book-card"
              style={{
                background: 'linear-gradient(135deg, #2d2e32 0%, #1a1b1e 100%)',
                border: '1px solid #3a3b3f',
                borderRadius: '12px',
                padding: '0',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'stretch',
                gap: '0',
                textDecoration: 'none',
                color: 'inherit',
                width: '100%'
              }}
            >
              {/* Portada del libro */}
              <div 
                className="book-cover"
                style={{
                  width: '120px',
                  minWidth: '120px',
                  height: '160px',
                  overflow: 'hidden',
                  position: 'relative',
                  background: 'rgba(108, 159, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  borderRadius: '12px 0 0 12px'
                }}
              >
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.setAttribute('style', 'display: flex');
                    }}
                  />
                ) : null}
                
                {/* Icono por defecto cuando no hay portada */}
                <div style={{
                  display: book.coverUrl ? 'none' : 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  background: 'rgba(108, 159, 255, 0.1)',
                  borderRadius: '8px'
                }}>
                  <svg 
                    width="32" 
                    height="32" 
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
                    <path 
                      d="M8 7H16M8 11H16M8 15H12" 
                      stroke="currentColor" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Contenido del libro */}
              <div className="book-content" style={{ flex: 1, minWidth: 0, padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {/* Categoría con color distintivo */}
                <span style={{
                  background: categoryColors.bg,
                  color: categoryColors.text,
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  display: 'inline-block',
                  marginBottom: '10px',
                  width: 'fit-content'
                }}>
                  {book.category || 'General'}
                </span>

                {/* Título del libro */}
                <h5 
                  className="book-title"
                  style={{
                    color: '#ffffff',
                    fontSize: '17px',
                    fontWeight: '600',
                    lineHeight: '1.4',
                    margin: '0 0 8px 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {book.title}
                </h5>

                {/* Información del libro */}
                {book.size && (
                  <div style={{ 
                    color: '#a0a0a0', 
                    fontSize: '13px'
                  }}>
                    📄 {(book.size / 1024 / 1024).toFixed(1)} MB
                  </div>
                )}
              </div>
            </a>
          );
        })}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div 
          className="pagination-container"
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '40px',
            marginBottom: '20px',
            flexWrap: 'wrap',
            padding: '0 16px'
          }}
        >
          {/* Botón anterior */}
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            style={{
              padding: '10px 16px',
              backgroundColor: currentPage === 1 ? '#2d2e32' : '#6c9fff',
              color: currentPage === 1 ? '#666' : '#ffffff',
              border: '1px solid #3a3b3f',
              borderRadius: '8px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            <span className="d-none d-sm-inline">Anterior</span>
          </button>

          {/* Números de página */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && goToPage(page)}
                disabled={page === '...'}
                style={{
                  padding: '10px 14px',
                  backgroundColor: page === currentPage 
                    ? '#6c9fff' 
                    : page === '...' 
                      ? 'transparent' 
                      : '#2d2e32',
                  color: page === currentPage 
                    ? '#ffffff' 
                    : page === '...' 
                      ? '#666' 
                      : '#ffffff',
                  border: page === '...' ? 'none' : '1px solid #3a3b3f',
                  borderRadius: '8px',
                  cursor: page === '...' ? 'default' : 'pointer',
                  fontWeight: page === currentPage ? '700' : '500',
                  fontSize: '14px',
                  minWidth: '42px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (page !== currentPage && page !== '...') {
                    e.currentTarget.style.backgroundColor = 'rgba(108, 159, 255, 0.2)';
                    e.currentTarget.style.borderColor = '#6c9fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (page !== currentPage && page !== '...') {
                    e.currentTarget.style.backgroundColor = '#2d2e32';
                    e.currentTarget.style.borderColor = '#3a3b3f';
                  }
                }}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Botón siguiente */}
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            style={{
              padding: '10px 16px',
              backgroundColor: currentPage === totalPages ? '#2d2e32' : '#6c9fff',
              color: currentPage === totalPages ? '#666' : '#ffffff',
              border: '1px solid #3a3b3f',
              borderRadius: '8px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span className="d-none d-sm-inline">Siguiente</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      )}

      {/* Info de página actual */}
      {totalPages > 1 && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ color: '#a0a0a0', fontSize: '14px' }}>
            Página {currentPage} de {totalPages} • Mostrando {startIndex + 1}-{Math.min(endIndex, filteredBooks.length)} de {filteredBooks.length} libros
          </span>
        </div>
      )}
    </>
  );
}
