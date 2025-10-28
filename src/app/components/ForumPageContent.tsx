'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

interface ForumPost {
  id: string
  title: string
  content: string
  slug: string
  isPinned: boolean
  isLocked: boolean
  viewCount: number
  multimedia?: any[] | null
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    username: string
  }
  commentCount: number
}

export default function ForumPageContent() {
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'recent' | 'top'>('recent')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { user, isAuthenticated } = useAuth()

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/forum/posts?page=${currentPage}&sort=${sortBy}`)
      
      if (!response.ok) {
        throw new Error('Error al cargar los posts')
      }
      
      const data = await response.json()
      setPosts(data.posts || [])
      setFilteredPosts(data.posts || [])
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [currentPage, sortBy])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="row">
        <div className="col-12 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3" style={{ color: '#ffffff' }}>Cargando foro...</p>
        </div>
      </div>
    )
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
              onClick={fetchPosts}
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="row">
        <div className="col-12 text-center">
          <div className="alert alert-info" role="alert" style={{
            background: 'rgba(13, 110, 253, 0.1)',
            border: '1px solid rgba(13, 110, 253, 0.3)',
            color: '#0d6efd',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <h4 className="alert-heading">📝 Foro Vacío</h4>
            <p>No hay posts disponibles en este momento.</p>
            <p className="mb-0">¡Sé el primero en iniciar una discusión!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Filtros de ordenamiento */}
      <div className="text-center mb-4" style={{ padding: '0 16px' }}>
        <div className="d-flex justify-content-center gap-3">
          <button
            onClick={() => setSortBy('recent')}
            className={`btn ${sortBy === 'recent' ? 'btn-primary' : 'btn-outline-secondary'}`}
            style={{
              borderRadius: '20px',
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: '600',
              border: sortBy === 'recent' ? 'none' : '1px solid #3a3b3f',
              background: sortBy === 'recent' 
                ? 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)' 
                : 'rgba(58, 59, 63, 0.5)',
              color: sortBy === 'recent' ? '#1a1b1e' : '#ffffff',
              transition: 'all 0.3s ease'
            }}
          >
            🕒 Más Recientes
          </button>
          <button
            onClick={() => setSortBy('top')}
            className={`btn ${sortBy === 'top' ? 'btn-primary' : 'btn-outline-secondary'}`}
            style={{
              borderRadius: '20px',
              padding: '8px 20px',
              fontSize: '14px',
              fontWeight: '600',
              border: sortBy === 'top' ? 'none' : '1px solid #3a3b3f',
              background: sortBy === 'top' 
                ? 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)' 
                : 'rgba(58, 59, 63, 0.5)',
              color: sortBy === 'top' ? '#1a1b1e' : '#ffffff',
              transition: 'all 0.3s ease'
            }}
          >
            ⭐ Más Puntuados
          </button>
        </div>
      </div>

      {/* Lista horizontal de posts */}
      <div className="row">
        <div className="col-12">
          <div style={{
            background: 'rgba(26, 27, 30, 0.8)',
            borderRadius: '12px',
            border: '1px solid #3a3b3f',
            overflow: 'hidden'
          }}>
            {/* Header de la tabla */}
            <div style={{
              background: 'linear-gradient(135deg, #2d2e32 0%, #1a1b1e 100%)',
              padding: '16px 20px',
              borderBottom: '1px solid #3a3b3f',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#ffffff'
            }}>
              <div style={{ flex: '2', minWidth: '0' }}>Título</div>
              <div style={{ flex: '1', minWidth: '120px' }}>Autor</div>
              <div style={{ flex: '1', minWidth: '100px' }}>Fecha</div>
              <div style={{ flex: '0.5', minWidth: '60px', textAlign: 'center' }}>Vistas</div>
              <div style={{ flex: '0.5', minWidth: '60px', textAlign: 'center' }}>Comentarios</div>
            </div>

            {/* Lista de posts */}
            {filteredPosts.map((post, index) => (
              <Link 
                key={post.id}
                href={`/foro/${post.slug}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '16px 20px',
                  borderBottom: index < filteredPosts.length - 1 ? '1px solid #3a3b3f' : 'none',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(208, 255, 113, 0.05)'
                  e.currentTarget.style.borderLeft = '3px solid #D0FF71'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderLeft = '3px solid transparent'
                }}
              >
                {/* Título y estado */}
                <div style={{ flex: '2', minWidth: '0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    {post.isPinned && (
                      <span style={{
                        background: 'rgba(255, 193, 7, 0.2)',
                        color: '#ffc107',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        fontSize: '10px',
                        fontWeight: '600'
                      }}>
                        📌
                      </span>
                    )}
                    {post.isLocked && (
                      <span style={{
                        background: 'rgba(220, 53, 69, 0.2)',
                        color: '#dc3545',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        fontSize: '10px',
                        fontWeight: '600'
                      }}>
                        🔒
                      </span>
                    )}
                  </div>
                  <h6 style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: '0',
                    lineHeight: '1.3',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {post.title}
                  </h6>
                  <p style={{
                    color: '#a0a0a0',
                    fontSize: '13px',
                    margin: '4px 0 0 0',
                    lineHeight: '1.3',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {post.content.substring(0, 80)}...
                  </p>
                  
                  {/* Multimedia preview */}
                  {post.multimedia && post.multimedia.length > 0 && (
                    <div style={{
                      display: 'flex',
                      gap: '4px',
                      marginTop: '8px',
                      flexWrap: 'wrap'
                    }}>
                      {post.multimedia.slice(0, 3).map((file: any, index: number) => (
                        <div
                          key={index}
                          style={{
                            background: 'rgba(208, 255, 113, 0.1)',
                            border: '1px solid rgba(208, 255, 113, 0.3)',
                            borderRadius: '4px',
                            padding: '2px 6px',
                            fontSize: '11px',
                            color: '#D0FF71',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span>
                            {file.type === 'image' ? '🖼️' : file.type === 'video' ? '🎥' : '📄'}
                          </span>
                          <span style={{ 
                            maxWidth: '60px', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {file.originalName}
                          </span>
                        </div>
                      ))}
                      {post.multimedia.length > 3 && (
                        <div style={{
                          background: 'rgba(160, 160, 160, 0.1)',
                          border: '1px solid rgba(160, 160, 160, 0.3)',
                          borderRadius: '4px',
                          padding: '2px 6px',
                          fontSize: '11px',
                          color: '#a0a0a0'
                        }}>
                          +{post.multimedia.length - 3} más
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Autor */}
                <div style={{ flex: '1', minWidth: '120px' }}>
                  <div style={{ color: '#a0a0a0', fontSize: '14px' }}>
                    {post.author.name || post.author.username}
                  </div>
                </div>

                {/* Fecha */}
                <div style={{ flex: '1', minWidth: '100px' }}>
                  <div style={{ color: '#a0a0a0', fontSize: '13px' }}>
                    {formatDate(post.createdAt)}
                  </div>
                </div>

                {/* Vistas */}
                <div style={{ flex: '0.5', minWidth: '60px', textAlign: 'center' }}>
                  <span style={{ color: '#a0a0a0', fontSize: '13px' }}>
                    {post.viewCount}
                  </span>
                </div>

                {/* Comentarios */}
                <div style={{ flex: '0.5', minWidth: '60px', textAlign: 'center' }}>
                  <span style={{ color: '#a0a0a0', fontSize: '13px' }}>
                    {post.commentCount}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="text-center mt-4" style={{ padding: '0 16px' }}>
          <div className="d-flex justify-content-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              style={{
                background: currentPage === 1 ? 'rgba(58, 59, 63, 0.3)' : 'rgba(58, 59, 63, 0.5)',
                color: currentPage === 1 ? '#666' : '#ffffff',
                border: '1px solid #3a3b3f',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              ← Anterior
            </button>
            
            <span style={{
              color: '#a0a0a0',
              padding: '8px 16px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center'
            }}>
              Página {currentPage} de {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              style={{
                background: currentPage === totalPages ? 'rgba(58, 59, 63, 0.3)' : 'rgba(58, 59, 63, 0.5)',
                color: currentPage === totalPages ? '#666' : '#ffffff',
                border: '1px solid #3a3b3f',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}
    </>
  )
}