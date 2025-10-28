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
  applauseCount: number
  userApplauseCount: number
  multimedia?: any[] | null
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
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [submittingEdit, setSubmittingEdit] = useState(false)
  const [submittingApplause, setSubmittingApplause] = useState(false)
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

  const handleEditPost = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para editar')
      return
    }

    if (!editTitle.trim() || !editContent.trim()) {
      setError('El título y contenido no pueden estar vacíos')
      return
    }

    setSubmittingEdit(true)
    setError('')

    try {
      const response = await fetch(`/api/forum/posts/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title: editTitle,
          content: editContent
        })
      })

      const data = await response.json()

      if (response.ok) {
        setIsEditing(false)
        // Recargar el post para mostrar los cambios
        fetchPost()
      } else {
        setError(data.error || 'Error al editar post')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setSubmittingEdit(false)
    }
  }

  const handleDeletePost = async () => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para eliminar')
      return
    }

    if (!confirm('¿Estás seguro de que quieres eliminar este post? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      const response = await fetch(`/api/forum/posts/${slug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        // Redirigir al foro después de eliminar
        router.push('/foro')
      } else {
        const data = await response.json()
        setError(data.error || 'Error al eliminar post')
      }
    } catch (err) {
      setError('Error de conexión')
    }
  }

  const handleApplause = async () => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para aplaudir')
      return
    }

    if (!post) return

    if (post.userApplauseCount >= 10) {
      setError('Ya has dado el máximo de aplausos (10)')
      return
    }

    setSubmittingApplause(true)
    setError('')

    // Optimistic update - actualizar UI inmediatamente
    const previousPost = post
    setPost(prev => prev ? {
      ...prev,
      applauseCount: prev.applauseCount + 1,
      userApplauseCount: prev.userApplauseCount + 1
    } : null)

    try {
      const response = await fetch(`/api/forum/posts/${slug}/applause`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok) {
        // Revertir cambios si hay error
        setPost(previousPost)
        setError(data.error || 'Error al aplaudir')
      }
    } catch (err) {
      // Revertir cambios si hay error de conexión
      setPost(previousPost)
      setError('Error de conexión')
    } finally {
      setSubmittingApplause(false)
    }
  }

  const startEditing = () => {
    if (post) {
      setEditTitle(post.title)
      setEditContent(post.content)
      setIsEditing(true)
    }
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setEditTitle('')
    setEditContent('')
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
          {isEditing ? (
            <form onSubmit={handleEditPost}>
              <div className="mb-3">
                <label htmlFor="editTitle" className="form-label" style={{ color: '#ffffff', fontWeight: '600' }}>
                  Título
                </label>
                <input
                  type="text"
                  id="editTitle"
                  className="form-control"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{
                    background: '#1a1b1e',
                    border: '2px solid #3a3b3f',
                    borderRadius: '8px',
                    color: '#ffffff',
                    padding: '12px 16px',
                    fontSize: '16px'
                  }}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="editContent" className="form-label" style={{ color: '#ffffff', fontWeight: '600' }}>
                  Contenido
                </label>
                <textarea
                  id="editContent"
                  className="form-control"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={8}
                  style={{
                    background: '#1a1b1e',
                    border: '2px solid #3a3b3f',
                    borderRadius: '8px',
                    color: '#ffffff',
                    padding: '12px 16px',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                  required
                />
              </div>
              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn"
                  disabled={submittingEdit || !editTitle.trim() || !editContent.trim()}
                  style={{
                    background: submittingEdit 
                      ? 'rgba(208, 255, 113, 0.5)' 
                      : 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)',
                    color: '#1a1b1e',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  {submittingEdit ? 'Guardando...' : '💾 Guardar'}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={cancelEditing}
                  style={{
                    background: 'rgba(58, 59, 63, 0.5)',
                    color: '#ffffff',
                    border: '1px solid #3a3b3f',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '14px'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div style={{
              color: '#ffffff',
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '24px',
              whiteSpace: 'pre-wrap'
            }}>
              {post.content}
            </div>
          )}

          {/* Multimedia */}
          {post.multimedia && post.multimedia.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h5 style={{ color: '#ffffff', marginBottom: '16px' }}>📎 Archivos adjuntos</h5>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {post.multimedia.map((file: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(208, 255, 113, 0.1)',
                      border: '1px solid rgba(208, 255, 113, 0.3)',
                      borderRadius: '8px',
                      padding: '12px',
                      minWidth: '200px',
                      flex: '1'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '20px' }}>
                        {file.type === 'image' ? '🖼️' : file.type === 'video' ? '🎥' : '📄'}
                      </span>
                      <span style={{ color: '#D0FF71', fontWeight: '600', fontSize: '14px' }}>
                        {file.originalName}
                      </span>
                    </div>
                    <div style={{ color: '#a0a0a0', fontSize: '12px' }}>
                      Tipo: {file.type} | Tamaño: {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'N/A'}
                    </div>
                    {file.type === 'image' && (
                      <div style={{ marginTop: '8px' }}>
                        <img
                          src={file.url || `/api/forum/media/${file.filename}`}
                          alt={file.originalName}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '200px',
                            borderRadius: '4px',
                            border: '1px solid #3a3b3f'
                          }}
                          onError={(e) => {
                            console.error('Error loading image:', file.filename)
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

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
            
            <div className="d-flex gap-3 align-items-center">
              {/* Botón de aplausos */}
              {isAuthenticated && (
                <div className="d-flex align-items-center gap-2">
                  <button
                    onClick={handleApplause}
                    disabled={submittingApplause || post.userApplauseCount >= 10}
                    className="btn btn-sm"
                    style={{
                      background: post.userApplauseCount > 0 
                        ? 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)' 
                        : 'rgba(58, 59, 63, 0.5)',
                      color: post.userApplauseCount > 0 ? '#1a1b1e' : '#ffffff',
                      border: post.userApplauseCount > 0 
                        ? '1px solid #D0FF71' 
                        : '1px solid #3a3b3f',
                      borderRadius: '20px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      cursor: post.userApplauseCount >= 10 ? 'not-allowed' : 'pointer'
                    }}
                    title={post.userApplauseCount >= 10 
                      ? 'Ya has dado el máximo de aplausos (10)' 
                      : `Dar aplauso (${post.userApplauseCount}/10)`
                    }
                  >
                    👏 {post.applauseCount} {post.userApplauseCount > 0 && `(${post.userApplauseCount})`}
                  </button>
                </div>
              )}
              
              {/* Botones de editar/eliminar */}
              {isAuthenticated && (user?.id === post.author.id || user?.role?.name === 'Administrador') && (
                <div className="d-flex gap-2">
                  <button 
                    onClick={startEditing}
                    className="btn btn-sm btn-outline-warning"
                    style={{
                      borderRadius: '20px',
                      padding: '8px 16px',
                      fontSize: '14px'
                    }}
                  >
                    ✏️ Editar
                  </button>
                  <button 
                    onClick={handleDeletePost}
                    className="btn btn-sm btn-outline-danger"
                    style={{
                      borderRadius: '20px',
                      padding: '8px 16px',
                      fontSize: '14px'
                    }}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              )}
            </div>
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
            <div className="text-center" style={{ color: '#FFF', padding: '40px 0' }}>
              <i className="fas fa-comments fa-3x mb-3"></i>
              <p style={{ color: '#FFF' }}>No hay comentarios aún. ¡Sé el primero en participar!</p>
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