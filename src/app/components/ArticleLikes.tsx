'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface ArticleLikesProps {
  articleSlug: string
}

export default function ArticleLikes({ articleSlug }: ArticleLikesProps) {
  const { isAuthenticated, token } = useAuth()
  const router = useRouter()
  const [likes, setLikes] = useState(0)
  const [userLiked, setUserLiked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    loadLikes()
  }, [articleSlug, isAuthenticated, token])

  const loadLikes = async () => {
    try {
      const headers: HeadersInit = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const res = await fetch(`/api/articles/${articleSlug}/likes`, {
        headers
      })

      if (res.ok) {
        const data = await res.json()
        setLikes(data.likes || 0)
        setUserLiked(data.userLiked || false)
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
      const res = await fetch(`/api/articles/${articleSlug}/likes`, {
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

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        padding: '16px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        marginTop: '3rem',
        marginBottom: '3rem'
      }}>
        <div style={{ 
          width: '20px', 
          height: '20px', 
          border: '2px solid #3a3b3f',
          borderTopColor: '#D0FF71',
          borderRadius: '50%',
          animation: 'spin 0.6s linear infinite'
        }}></div>
        <span style={{ color: '#a0a0a0', fontSize: '14px' }}>Cargando...</span>
      </div>
    )
  }

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px',
      padding: '16px 0',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      marginTop: '3rem',
      marginBottom: '3rem'
    }}>
      <button
        onClick={handleLike}
        disabled={toggling}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: isAuthenticated ? 'pointer' : 'pointer',
          padding: '8px 12px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s',
          color: userLiked ? '#D0FF71' : '#ffffff',
          opacity: toggling ? 0.6 : 1
        }}
        onMouseEnter={(e) => {
          if (isAuthenticated) {
            e.currentTarget.style.background = '#2d2e32'
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
        }}
      >
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
        <span style={{ fontSize: '14px', fontWeight: '500' }}>
          {likes} {likes === 1 ? 'like' : 'likes'}
        </span>
      </button>
    </div>
  )
}
