'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface Comment {
  id: string
  content: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string | null
    username: string | null
    avatar: string | null
  }
}

interface ArticleCommentsProps {
  articleSlug: string
}

export default function ArticleComments({ articleSlug }: ArticleCommentsProps) {
  const { isAuthenticated, token, user } = useAuth()
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadComments()
  }, [articleSlug])

  const loadComments = async () => {
    try {
      const res = await fetch(`/api/articles/${articleSlug}/comments`)
      if (res.ok) {
        const data = await res.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      // Error silencioso
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      const currentPath = window.location.pathname
      router.push(`/ingresar?redirect=${encodeURIComponent(currentPath)}`)
      return
    }

    if (!token || !newComment.trim() || submitting) return

    try {
      setSubmitting(true)
      setError(null)

      const res = await fetch(`/api/articles/${articleSlug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment.trim() })
      })

      if (res.ok) {
        const data = await res.json()
        setComments(prev => [data.comment, ...prev])
        setNewComment('')
      } else if (res.status === 401) {
        router.push(`/ingresar?redirect=${encodeURIComponent(window.location.pathname)}`)
      } else {
        const errorData = await res.json()
        setError(errorData.error || 'Error al publicar comentario')
      }
    } catch (error) {
      setError('Error de red al publicar comentario')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Hace un momento'
    if (minutes < 60) return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`
    if (hours < 24) return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`
    if (days < 7) return `Hace ${days} ${days === 1 ? 'día' : 'días'}`
    
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
  }

  return (
    <div style={{ 
      marginTop: '3rem',
      paddingTop: '3rem',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <h3 style={{ 
        color: '#ffffff', 
        fontSize: '24px', 
        fontWeight: '600',
        marginBottom: '24px'
      }}>
        Comentarios ({comments.length})
      </h3>

      {/* Formulario de comentario */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: '32px' }}>
          <div style={{ marginBottom: '12px' }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe tu comentario..."
              rows={4}
              maxLength={2000}
              style={{
                width: '100%',
                background: '#2d2e32',
                border: '1px solid #3a3b3f',
                borderRadius: '8px',
                padding: '12px',
                color: '#ffffff',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                minHeight: '100px'
              }}
            />
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '8px'
            }}>
              <span style={{ 
                color: '#a0a0a0', 
                fontSize: '12px' 
              }}>
                {newComment.length}/2000 caracteres
              </span>
              <button
                type="submit"
                disabled={!newComment.trim() || submitting}
                style={{
                  background: (!newComment.trim() || submitting)
                    ? '#6c757d'
                    : 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)',
                  color: '#1a1b1e',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: (!newComment.trim() || submitting) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {submitting ? 'Publicando...' : 'Publicar comentario'}
              </button>
            </div>
          </div>
          {error && (
            <div style={{
              background: 'rgba(220, 53, 69, 0.1)',
              border: '1px solid rgba(220, 53, 69, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              color: '#dc3545',
              fontSize: '13px',
              marginTop: '12px'
            }}>
              {error}
            </div>
          )}
        </form>
      ) : (
        <div style={{
          background: '#2d2e32',
          border: '1px solid #3a3b3f',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <p style={{ color: '#a0a0a0', marginBottom: '16px' }}>
            Iniciá sesión para comentar
          </p>
          <button
            onClick={() => {
              const currentPath = window.location.pathname
              router.push(`/ingresar?redirect=${encodeURIComponent(currentPath)}`)
            }}
            style={{
              background: 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)',
              color: '#1a1b1e',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Iniciar sesión
          </button>
        </div>
      )}

      {/* Lista de comentarios */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#a0a0a0' }}>
          Cargando comentarios...
        </div>
      ) : comments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#a0a0a0' }}>
          No hay comentarios aún. ¡Sé el primero en comentar!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                background: '#1a1b1e',
                border: '1px solid #3a3b3f',
                borderRadius: '8px',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#2d2e32',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  {comment.user.avatar ? (
                    <img 
                      src={comment.user.avatar} 
                      alt={comment.user.name || 'Usuario'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span style={{ color: '#D0FF71', fontSize: '18px', fontWeight: '600' }}>
                      {(comment.user.name || comment.user.username || 'U')[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ color: '#ffffff', fontWeight: '600', fontSize: '14px' }}>
                      {comment.user.name || comment.user.username || 'Usuario'}
                    </span>
                    <span style={{ color: '#a0a0a0', fontSize: '12px' }}>
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  <p style={{ 
                    color: '#ffffff', 
                    fontSize: '14px', 
                    lineHeight: '1.6',
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
