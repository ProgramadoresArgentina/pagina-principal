'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface ArticleShareAndStatsProps {
  slug: string
  title: string
  url: string
}

export default function ArticleShareAndStats({ slug, title, url }: ArticleShareAndStatsProps) {
  const { isAuthenticated, token } = useAuth()
  const router = useRouter()
  const [commentsCount, setCommentsCount] = useState(0)
  const [likes, setLikes] = useState(0)
  const [userLiked, setUserLiked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    loadData()
  }, [slug, isAuthenticated, token])

  const loadData = async () => {
    try {
      // Cargar comentarios
      const commentsRes = await fetch(`/api/articles/${slug}/comments`)
      if (commentsRes.ok) {
        const commentsData = await commentsRes.json()
        setCommentsCount(commentsData.comments?.length || 0)
      }

      // Cargar likes
      const headers: HeadersInit = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      const likesRes = await fetch(`/api/articles/${slug}/likes`, { headers })
      if (likesRes.ok) {
        const likesData = await likesRes.json()
        setLikes(likesData.likes || 0)
        setUserLiked(likesData.userLiked || false)
      }
    } catch (error) {
      // Error silencioso
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!isAuthenticated) {
      const currentPath = window.location.pathname
      router.push(`/ingresar?redirect=${encodeURIComponent(currentPath)}`)
      return
    }

    if (!token || toggling) return

    try {
      setToggling(true)
      const res = await fetch(`/api/articles/${slug}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      if (res.ok) {
        const data = await res.json()
        setLikes(data.likes || 0)
        setUserLiked(data.userLiked || false)
      } else if (res.status === 401) {
        router.push(`/ingresar?redirect=${encodeURIComponent(window.location.pathname)}`)
      }
    } catch (error) {
      // Error silencioso
    } finally {
      setToggling(false)
    }
  }

  const shareOnTwitter = () => {
    const text = encodeURIComponent(title)
    const shareUrl = encodeURIComponent(url)
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`, '_blank', 'width=550,height=420')
  }

  const shareOnFacebook = () => {
    const shareUrl = encodeURIComponent(url)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank', 'width=550,height=420')
  }

  const shareOnLinkedIn = () => {
    const shareUrl = encodeURIComponent(url)
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank', 'width=550,height=420')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      // Mostrar feedback visual
      const button = document.querySelector('.copy-link-btn')
      if (button) {
        button.textContent = '✓ Copiado'
        setTimeout(() => {
          button.textContent = 'Copiar enlace'
        }, 2000)
      }
    } catch (error) {
      // Error silencioso
    }
  }

  const scrollToComments = () => {
    const commentsSection = document.querySelector('.article-comments-section')
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '20px',
      padding: '20px 0',
      marginBottom: '2rem',
      flexWrap: 'wrap'
    }}>
      {/* Likes */}
      <button
        onClick={handleLike}
        disabled={toggling || loading}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: (isAuthenticated && !loading) ? 'pointer' : 'pointer',
          padding: '8px 12px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s',
          color: userLiked ? '#D0FF71' : '#ffffff',
          opacity: (toggling || loading) ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (isAuthenticated && !loading) {
            e.currentTarget.style.background = '#2d2e32'
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
        }}
      >
        {loading ? (
          <div style={{ 
            width: '20px', 
            height: '20px', 
            border: '2px solid #3a3b3f',
            borderTopColor: '#D0FF71',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite'
          }} />
        ) : (
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill={userLiked ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        )}
        <span style={{ fontSize: '14px', fontWeight: '500' }}>
          {loading ? '...' : `${likes} me gusta`}
        </span>
      </button>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Separador */}
      <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Compartir */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: '#a0a0a0', fontSize: '14px', fontWeight: '500' }}>Compartir:</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={shareOnTwitter}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              color: '#ffffff'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1DA1F2'
              e.currentTarget.style.borderColor = '#1DA1F2'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
            }}
            title="Compartir en Twitter"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </button>

          <button
            onClick={shareOnFacebook}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              color: '#ffffff'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1877F2'
              e.currentTarget.style.borderColor = '#1877F2'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
            }}
            title="Compartir en Facebook"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>

          <button
            onClick={shareOnLinkedIn}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              color: '#ffffff'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0A66C2'
              e.currentTarget.style.borderColor = '#0A66C2'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
            }}
            title="Compartir en LinkedIn"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </button>

          <button
            onClick={copyLink}
            className="copy-link-btn"
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2d2e32'
              e.currentTarget.style.borderColor = '#D0FF71'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
            }}
          >
            Copiar enlace
          </button>
        </div>
      </div>

      {/* Separador */}
      <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.1)' }} />

      {/* Comentarios */}
      <button
        onClick={scrollToComments}
        disabled={loading}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: loading ? 'default' : 'pointer',
          padding: '8px 12px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s',
          color: '#a0a0a0',
          opacity: loading ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (!loading) {
            e.currentTarget.style.background = '#2d2e32'
            e.currentTarget.style.color = '#ffffff'
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = '#a0a0a0'
        }}
      >
        {loading ? (
          <div style={{ 
            width: '20px', 
            height: '20px', 
            border: '2px solid #3a3b3f',
            borderTopColor: '#D0FF71',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite'
          }} />
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
        <span style={{ fontSize: '14px', fontWeight: '500' }}>
          {loading ? 'Cargando...' : `${commentsCount} ${commentsCount === 1 ? 'comentario' : 'comentarios'}`}
        </span>
      </button>
    </div>
  )
}
