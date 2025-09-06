'use client'

import React from 'react'

interface ChatMessageProps {
  message: {
    id: string
    content: string
    createdAt: string
    user?: {
      id: string
      name: string | null
      username: string | null
      avatar: string | null
      role: {
        name: string
      }
    } | null
    anonymousName?: string | null
  }
  onDelete?: (messageId: string) => void
  canModerate?: boolean
}

// Función para detectar y convertir links
const formatMessage = (content: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = content.split(urlRegex)
  
  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary text-decoration-underline"
        >
          {part}
        </a>
      )
    }
    return part
  })
}

export default function ChatMessage({ message, onDelete, canModerate }: ChatMessageProps) {
  const displayName = message.user 
    ? (message.user.name || message.user.username || 'Usuario')
    : (message.anonymousName || 'Anónimo')

  const isModerator = message.user?.role.name === 'admin' || message.user?.role.name === 'moderator'
  const isAdmin = message.user?.role.name === 'admin'

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="d-flex mb-2 p-2 border-bottom">
      <div className="flex-shrink-0 me-2">
        {message.user?.avatar ? (
          <img
            src={message.user.avatar}
            alt={displayName}
            className="rounded-circle"
            style={{ width: '32px', height: '32px', objectFit: 'cover' }}
          />
        ) : (
          <div 
            className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
            style={{ width: '32px', height: '32px', fontSize: '12px' }}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      <div className="flex-grow-1">
        <div className="d-flex align-items-center mb-1">
          <span className="fw-bold me-2" style={{ fontSize: '14px' }}>
            {displayName}
          </span>
          
          {isAdmin && (
            <span className="badge bg-danger me-1" style={{ fontSize: '10px' }}>
              ADMIN
            </span>
          )}
          
          {isModerator && !isAdmin && (
            <span className="badge bg-warning me-1" style={{ fontSize: '10px' }}>
              MOD
            </span>
          )}
          
          <span className="text-muted" style={{ fontSize: '12px' }}>
            {formatTime(message.createdAt)}
          </span>
          
          {canModerate && onDelete && (
            <button
              className="btn btn-sm btn-outline-danger ms-auto"
              onClick={() => onDelete(message.id)}
              style={{ fontSize: '10px', padding: '2px 6px' }}
              title="Eliminar mensaje"
            >
              <i className="fas fa-trash"></i>
            </button>
          )}
        </div>
        
        <div className="text-break" style={{ fontSize: '14px', lineHeight: '1.4' }}>
          {formatMessage(message.content)}
        </div>
      </div>
    </div>
  )
}