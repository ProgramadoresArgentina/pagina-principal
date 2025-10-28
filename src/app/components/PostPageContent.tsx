'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ForumPost {
  id: string
  title: string
  content: string
  slug: string
  isPinned: boolean
  isLocked: boolean
  viewCount: number
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    username: string
    avatar: string
  }
  comments: ForumComment[]
  commentCount: number
}

interface ForumComment {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    username: string
    avatar: string
  }
  replies: ForumComment[]
}

interface PostPageContentProps {
  slug: string
}

export default function PostPageContent({ slug }: PostPageContentProps) {
  const [post, setPost] = useState<ForumPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const { user, isAuthenticated, token } = useAuth()
  const router = useRouter()

  const fetchPost = async () => {
    try {
      setLoading(true)
      // No requiere autenticación para leer posts
      const response = await fetch(`/api/forum/posts/${slug}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Post no encontrado')
        }
        throw new Error('Error al cargar el post')
      }
      
      const data = await response.json()
      setPost(data.post)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPost()
  }, [slug])

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

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para comentar')
      return
    }

    if (!newComment.trim()) {
      setError('El comentario no puede estar vacío')
      return
    }

    setSubmittingComment(true)
    setError('')

    try {
      const response = await fetch(`/api/forum/posts/${slug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment })
      })

      const data = await response.json()

      if (response.ok) {
        setNewComment('')
        // Recargar el post para mostrar el nuevo comentario
        fetchPost()
      } else {
        setError(data.error || 'Error al crear comentario')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para responder')
      return
    }

    if (!replyContent.trim()) {
      setError('La respuesta no puede estar vacía')
      return
    }

    setSubmittingComment(true)
    setError('')

    try {
      const response = await fetch(`/api/forum/posts/${slug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          content: replyContent,
          parentId: parentId
        })
      })

      const data = await response.json()

      if (response.ok) {
        setReplyContent('')
        setReplyingTo(null)
        // Recargar el post para mostrar la nueva respuesta
        fetchPost()
      } else {
        setError(data.error || 'Error al crear respuesta')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setSubmittingComment(false)
    }
  }

  if (loading) {
    return (
      <div className="row">
        <div className="col-12 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3" style={{ color: '#ffffff' }}>Cargando post...</p>
        </div>
      </div>
    )
  }

  if (error && !post) {
    return (
      <div className="row">
        <div className="col-12 text-center">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error</h4>
            <p>{error}</p>
            <hr />
            <button 
              className="btn btn-outline-danger" 
              onClick={fetchPost}
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="row">
        <div className="col-12 text-center">
          <div className="alert alert-warning" role="alert">
            <h4 className="alert-heading">Post no encontrado</h4>
            <p>El post que buscas no existe o ha sido eliminado.</p>
            <Link href="/foro" className="btn btn-primary">
              Volver al Foro
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-10">
        {/* Post principal */}
        <div style={{
          background: 'linear-gradient(135deg, #2d2e32 0%, #1a1b1e 100%)',
          border: '1px solid #3a3b3f',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px'
        }}>
          {/* Header del post */}
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h1 style={{ color: '#ffffff', marginBottom: '8px', fontSize: '28px', lineHeight: '1.3' }}>
                {post.title}
              </h1>
              <div className="d-flex align-items-center gap-3" style={{ color: '#a0a0a0', fontSize: '14px' }}>
                <span>👤 {post.author.name || post.author.username}</span>
                <span>📅 {formatDate(post.createdAt)}</span>
                <span>👁️ {post.viewCount} vistas</span>
                <span>💬 {post.commentCount} comentarios</span>
              </div>
            </div>
            <div className="d-flex gap-2">
              {post.isPinned && (
                <span style={{
                  background: 'rgba(255, 193, 7, 0.2)',
                  color: '#ffc107',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  📌 Fijado
                </span>
              )}
              {post.isLocked && (
                <span style={{
                  background: 'rgba(220, 53, 69, 0.2)',
                  color: '#dc3545',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  🔒 Bloqueado
                </span>
              )}
            </div>
          </div>

          {/* Contenido del post */}
          <div style={{
            color: '#ffffff',
            fontSize: '16px',
            lineHeight: '1.6',
            marginBottom: '24px',
            whiteSpace: 'pre-wrap'
          }}>
            {post.content}
          </div>

          {/* Acciones del post */}
          <div className="d-flex justify-content-between align-items-center">
            <Link 
              href="/foro" 
              className="btn"
              style={{
                background: 'rgba(58, 59, 63, 0.5)',
                color: '#ffffff',
                border: '1px solid #3a3b3f',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                textDecoration: 'none'
              }}
            >
              ← Volver al Foro
            </Link>
            
            {isAuthenticated && user?.id === post.author.id && (
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-outline-warning">
                  ✏️ Editar
                </button>
                <button className="btn btn-sm btn-outline-danger">
                  🗑️ Eliminar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Comentarios */}
        <div style={{
          background: 'linear-gradient(135deg, #2d2e32 0%, #1a1b1e 100%)',
          border: '1px solid #3a3b3f',
          borderRadius: '16px',
          padding: '32px'
        }}>
          <h3 style={{ color: '#ffffff', marginBottom: '24px' }}>
            💬 Comentarios ({post.commentCount})
          </h3>

          {/* Formulario de comentario */}
          {!post.isLocked && (
            <div className="mb-4">
              {!isAuthenticated ? (
                <div className="alert alert-warning" role="alert" style={{
                  background: 'rgba(255, 193, 7, 0.1)',
                  border: '1px solid rgba(255, 193, 7, 0.3)',
                  color: '#ffc107',
                  borderRadius: '12px',
                  padding: '16px'
                }}>
                  <p className="mb-2">
                    <strong>🔒 Inicia sesión para comentar</strong>
                  </p>
                  <p className="mb-3">
                    Para participar en la discusión necesitas iniciar sesión.
                  </p>
                  <div className="d-flex gap-2">
                    <Link 
                      href="/ingresar"
                      className="btn btn-sm"
                      style={{
                        background: 'rgba(255, 193, 7, 0.2)',
                        color: '#ffc107',
                        border: '1px solid #ffc107',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        textDecoration: 'none'
                      }}
                    >
                      Iniciar Sesión
                    </Link>
                    <Link 
                      href="/registro"
                      className="btn btn-sm"
                      style={{
                        background: 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)',
                        color: '#1a1b1e',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '8px 16px',
                        fontSize: '14px',
                        textDecoration: 'none'
                      }}
                    >
                      Registrarse
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitComment}>
                  <div className="mb-3">
                    <label htmlFor="newComment" className="form-label" style={{ color: '#ffffff', fontWeight: '600' }}>
                      Escribe tu comentario
                    </label>
                    <textarea
                      id="newComment"
                      className="form-control"
                      placeholder="Participa en la discusión..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={4}
                      style={{
                        background: '#1a1b1e',
                        border: '2px solid #3a3b3f',
                        borderRadius: '8px',
                        color: '#ffffff',
                        padding: '12px 16px',
                        fontSize: '16px',
                        resize: 'vertical',
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#D0FF71'
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#3a3b3f'
                      }}
                      required
                    />
                  </div>
                  <div className="d-flex justify-content-end">
                    <button
                      type="submit"
                      className="btn"
                      disabled={submittingComment || !newComment.trim()}
                      style={{
                        background: submittingComment 
                          ? 'rgba(208, 255, 113, 0.5)' 
                          : 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)',
                        color: '#1a1b1e',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: submittingComment ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {submittingComment ? 'Enviando...' : '💬 Comentar'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="alert alert-danger mb-4" role="alert" style={{
              background: 'rgba(220, 53, 69, 0.1)',
              border: '1px solid rgba(220, 53, 69, 0.3)',
              color: '#dc3545',
              borderRadius: '8px',
              padding: '12px 16px'
            }}>
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          {/* Lista de comentarios */}
          {post.comments.length === 0 ? (
            <div className="text-center" style={{ color: '#a0a0a0', padding: '40px 0' }}>
              <i className="fas fa-comments fa-3x mb-3"></i>
              <p>No hay comentarios aún. ¡Sé el primero en participar!</p>
            </div>
          ) : (
            <div className="comments-list">
              {post.comments.map((comment) => (
                <div key={comment.id} style={{
                  border: '1px solid #3a3b3f',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '16px',
                  background: 'rgba(26, 27, 30, 0.5)'
                }}>
                  {/* Comentario principal */}
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <div style={{ color: '#ffffff', fontWeight: '600', fontSize: '14px' }}>
                        {comment.author.name || comment.author.username}
                      </div>
                      <div style={{ color: '#a0a0a0', fontSize: '12px' }}>
                        {formatDate(comment.createdAt)}
                      </div>
                    </div>
                    {isAuthenticated && !post.isLocked && (
                      <button
                        className="btn btn-sm"
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        style={{
                          background: 'rgba(58, 59, 63, 0.5)',
                          color: '#ffffff',
                          border: '1px solid #3a3b3f',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          fontSize: '12px'
                        }}
                      >
                        💬 Responder
                      </button>
                    )}
                  </div>
                  
                  <div style={{ color: '#ffffff', fontSize: '14px', lineHeight: '1.5', marginBottom: '16px' }}>
                    {comment.content}
                  </div>

                  {/* Formulario de respuesta */}
                  {replyingTo === comment.id && isAuthenticated && !post.isLocked && (
                    <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="mb-3">
                      <div className="mb-2">
                        <textarea
                          className="form-control"
                          placeholder="Escribe tu respuesta..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          rows={2}
                          style={{
                            background: '#1a1b1e',
                            border: '2px solid #3a3b3f',
                            borderRadius: '6px',
                            color: '#ffffff',
                            padding: '8px 12px',
                            fontSize: '14px',
                            resize: 'vertical'
                          }}
                          required
                        />
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          type="submit"
                          className="btn btn-sm"
                          disabled={submittingComment || !replyContent.trim()}
                          style={{
                            background: 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)',
                            color: '#1a1b1e',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '12px'
                          }}
                        >
                          Responder
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => {
                            setReplyingTo(null)
                            setReplyContent('')
                          }}
                          style={{
                            background: 'rgba(58, 59, 63, 0.5)',
                            color: '#ffffff',
                            border: '1px solid #3a3b3f',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '12px'
                          }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Respuestas */}
                  {comment.replies.length > 0 && (
                    <div style={{ marginLeft: '20px' }}>
                      {comment.replies.map((reply) => (
                        <div key={reply.id} style={{
                          border: '1px solid #3a3b3f',
                          borderRadius: '8px',
                          padding: '12px',
                          marginBottom: '8px',
                          background: 'rgba(26, 27, 30, 0.3)'
                        }}>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <div style={{ color: '#ffffff', fontWeight: '600', fontSize: '13px' }}>
                                {reply.author.name || reply.author.username}
                              </div>
                              <div style={{ color: '#a0a0a0', fontSize: '11px' }}>
                                {formatDate(reply.createdAt)}
                              </div>
                            </div>
                          </div>
                          <div style={{ color: '#ffffff', fontSize: '13px', lineHeight: '1.4' }}>
                            {reply.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}