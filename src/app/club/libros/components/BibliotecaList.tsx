'use client'

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface BibliotecaItem {
  id: string;
  type: 'book' | 'article';
  title: string;
  description?: string;
  category: string;
  imageUrl?: string;
  url: string;
  isSubscriberOnly: boolean;
  author?: string;
  authorImage?: string;
  publishedAt?: Date;
  size?: number;
}

interface BibliotecaResponse {
  items: BibliotecaItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

const ITEMS_PER_PAGE = 10;

export default function BibliotecaList() {
  const [items, setItems] = useState<BibliotecaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<BibliotecaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { user, isAuthenticated, token } = useAuth();

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const params = new URLSearchParams({
        page: '1',
        limit: '1000', // Obtener todos para filtrar en cliente
      });
      
      const response = await fetch(`/api/biblioteca?${params}`, { headers });
      
      if (!response.ok) {
        throw new Error('Error al cargar la biblioteca');
      }
      
      const data: BibliotecaResponse = await response.json();
      const itemsData = data.items || [];
      
      setItems(itemsData);
      setFilteredItems(itemsData);
      
      // Extraer categorías únicas (solo de libros)
      const uniqueCategories = Array.from(
        new Set(itemsData.filter(item => item.type === 'book').map((item) => item.category))
      ) as string[];
      setCategories(['Todas', ...uniqueCategories.sort(), 'Solo Artículos']);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Función para normalizar texto
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  };

  // Función para filtrar items
  const filterItems = (
    items: BibliotecaItem[],
    searchTerm: string,
    category: string
  ): BibliotecaItem[] => {
    let filtered = items;
    
    // Filtrar por categoría o tipo
    if (category === 'Solo Artículos') {
      filtered = filtered.filter(item => item.type === 'article');
    } else if (category !== 'Todas') {
      filtered = filtered.filter(item => item.category === category && item.type === 'book');
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const normalizedSearchTerm = normalizeText(searchTerm);
      filtered = filtered.filter(item => {
        const normalizedTitle = normalizeText(item.title);
        return normalizedTitle.includes(normalizedSearchTerm);
      });
    }
    
    return filtered;
  };

  // Efecto para filtrar items
  useEffect(() => {
    const filtered = filterItems(items, searchTerm, selectedCategory);
    setFilteredItems(filtered);
    setCurrentPage(1);
  }, [items, searchTerm, selectedCategory]);

  // Calcular items paginados
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);

  // Funciones de navegación
  const goToPage = (page: number) => {
    const validPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(validPage);
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

  // Generar números de página
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
              onClick={fetchItems}
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="row">
        <div className="col-12 text-center">
          <div className="alert alert-info" role="alert">
            <h4 className="alert-heading">Biblioteca Vacía</h4>
            <p>No hay contenido disponible en este momento.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-12">
        {/* Filtros */}
        <div className="search-filter-container mb-4" style={{ 
          padding: '0 16px',
          display: 'flex',
          flexDirection: 'row',
          gap: '12px',
          maxWidth: '1000px',
          margin: '0 auto',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {/* Búsqueda */}
          <div className="search-box" style={{ 
            position: 'relative', 
            flex: '1 1 300px',
            maxWidth: '400px',
            minWidth: '200px'
          }}>
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-placeholder-white"
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
              onFocus={(e) => e.target.style.borderColor = '#6c9fff'}
              onBlur={(e) => e.target.style.borderColor = '#3a3b3f'}
            />
            <div style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6c9fff',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
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
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#ffffff'
                }}
              >
                ×
              </button>
            )}
          </div>

          {/* Filtro de categoría */}
          <div style={{ position: 'relative', minWidth: '160px' }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '2px solid #3a3b3f',
                borderRadius: '12px',
                backgroundColor: '#2d2e32',
                color: '#ffffff',
                fontSize: '15px',
                outline: 'none',
                cursor: 'pointer',
                transition: 'border-color 0.3s ease',
                height: '48px',
                minWidth: '160px',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                paddingRight: '40px',
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236c9fff' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                backgroundSize: '20px'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6c9fff'}
              onBlur={(e) => e.target.style.borderColor = '#3a3b3f'}
            >
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))
              ) : (
                <option value="Todas">Todas</option>
              )}
            </select>
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="mb-4 text-center">
          <p style={{ color: '#9e9e9e', fontSize: '14px' }}>
            Mostrando {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} de {filteredItems.length} resultados
          </p>
        </div>

        {/* Lista de items */}
        {paginatedItems.length === 0 ? (
          <div className="text-center py-5">
            <p style={{ color: '#9e9e9e', fontSize: '16px' }}>
              No se encontraron resultados para tu búsqueda
            </p>
          </div>
        ) : (
          <div className="biblioteca-list" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '20px',
            padding: '0 16px'
          }}>
            {paginatedItems.map((item) => {
              const categoryColors = getCategoryColor(item.category);
              const isLocked = item.isSubscriberOnly && (!isAuthenticated || !user?.isSubscribed);

              return (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: '#2d2e32',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    transition: 'transform 0.3s ease',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '300px'
                  }}
                  className="biblioteca-item"
                >
                  {/* Imagen o icono (arriba) */}
                  {item.type === 'book' && item.imageUrl ? (
                    <div style={{
                      width: '100%',
                      height: '160px',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      {isLocked && (
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          borderRadius: '50%',
                          width: '48px',
                          height: '48px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="5" y="11" width="14" height="10" rx="2" stroke="#6c9fff" strokeWidth="2"/>
                            <path d="M7 11V7C7 4.79086 8.79086 3 11 3H13C15.2091 3 17 4.79086 17 7V11" stroke="#6c9fff" strokeWidth="2"/>
                            <circle cx="12" cy="16" r="1.5" fill="#6c9fff"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '160px',
                      background: 'linear-gradient(135deg, #2d2e32 0%, #3a3b3f 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      {item.type === 'article' ? (
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#6c9fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M14 2V8H20" stroke="#6c9fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 13H8" stroke="#6c9fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 17H8" stroke="#6c9fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 9H9H8" stroke="#6c9fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="#6c9fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" stroke="#6c9fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                      {isLocked && (
                        <div style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          borderRadius: '50%',
                          width: '44px',
                          height: '44px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="5" y="11" width="14" height="10" rx="2" stroke="#6c9fff" strokeWidth="2"/>
                            <path d="M7 11V7C7 4.79086 8.79086 3 11 3H13C15.2091 3 17 4.79086 17 7V11" stroke="#6c9fff" strokeWidth="2"/>
                            <circle cx="12" cy="16" r="1.5" fill="#6c9fff"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Contenido (abajo) */}
                  <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    {/* Badge de tipo y título en una columna */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: '5px',
                          fontSize: '10px',
                          fontWeight: '600',
                          backgroundColor: item.type === 'book' ? 'rgba(108, 159, 255, 0.15)' : 'rgba(76, 175, 80, 0.15)',
                          color: item.type === 'book' ? '#6c9fff' : '#4caf50',
                          textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {item.type === 'book' ? 'Libro' : 'Artículo'}
                      </span>
                      
                      {/* Categoría */}
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 10px',
                        borderRadius: '5px',
                        fontSize: '10px',
                        fontWeight: '500',
                        backgroundColor: categoryColors.bg,
                        color: categoryColors.text
                      }}>
                        {item.category}
                      </span>
                      
                      {/* Candado si está bloqueado */}
                      {isLocked && (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 8px',
                          borderRadius: '5px',
                          fontSize: '10px',
                          fontWeight: '600',
                          backgroundColor: 'rgba(108, 159, 255, 0.1)',
                          color: '#6c9fff'
                        }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
                            <path d="M7 11V7C7 4.79086 8.79086 3 11 3H13C15.2091 3 17 4.79086 17 7V11" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          Club
                        </span>
                      )}
                      </div>
                    </div>

                    {/* Título */}
                    {item.type === 'book' ? (
                      <a 
                        href={item.url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none' }}
                      >
                        <h3 style={{
                          color: '#ffffff',
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '0',
                          lineHeight: '1.4',
                          cursor: 'pointer',
                          transition: 'color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#6c9fff'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                        >
                          {item.title}
                        </h3>
                      </a>
                    ) : (
                      <Link href={item.url} style={{ textDecoration: 'none' }}>
                        <h3 style={{
                          color: '#ffffff',
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '0',
                          lineHeight: '1.4',
                          cursor: 'pointer',
                          transition: 'color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#6c9fff'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
                        >
                          {item.title}
                        </h3>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="pagination-container mt-5" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              style={{
                padding: '10px 16px',
                backgroundColor: currentPage === 1 ? '#3a3b3f' : '#6c9fff',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                opacity: currentPage === 1 ? 0.5 : 1,
                transition: 'background-color 0.3s ease'
              }}
            >
              Anterior
            </button>

            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} style={{ color: '#9e9e9e', padding: '0 8px' }}>
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => goToPage(page as number)}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: currentPage === page ? '#6c9fff' : '#3a3b3f',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    minWidth: '44px',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== page) {
                      e.currentTarget.style.backgroundColor = '#4a4b4f';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== page) {
                      e.currentTarget.style.backgroundColor = '#3a3b3f';
                    }
                  }}
                >
                  {page}
                </button>
              )
            ))}

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              style={{
                padding: '10px 16px',
                backgroundColor: currentPage === totalPages ? '#3a3b3f' : '#6c9fff',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                opacity: currentPage === totalPages ? 0.5 : 1,
                transition: 'background-color 0.3s ease'
              }}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .biblioteca-item:hover {
          transform: scale(1.02);
        }
        
        .search-input-placeholder-white::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        
        @media (max-width: 768px) {
          .biblioteca-list {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)) !important;
          }
        }
        
        @media (max-width: 480px) {
          .biblioteca-list {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)) !important;
          }
        }
      `}</style>
    </div>
  );
}
