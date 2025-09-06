'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSocket } from '@/hooks/useSocket'
import { useAuth } from '@/contexts/AuthContext'
import ChatMessage from './ChatMessage'
import ChatModeration from './ChatModeration'

interface ChatInfo {
  messageCount: number
  onlineUsers: number
  rules: string[]
  isModerator: boolean
  user: {
    id: string
    name: string
    username: string
    role: string
  } | null
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [chatInfo, setChatInfo] = useState<ChatInfo | null>(null)
  const [showRules, setShowRules] = useState(false)
  const [showModeration, setShowModeration] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [messages, setMessages] = useState<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const { user, token, isAuthenticated } = useAuth()
  const { 
    socket, 
    isConnected, 
    messages: socketMessages, 
    sendMessage, 
    deleteMessage,
    isAuthenticated: socketAuthenticated,
    anonymousName 
  } = useSocket()

  // Scroll automático al final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [socketMessages])

  // Cargar información del chat y mensajes iniciales
  useEffect(() => {
    const fetchChatInfo = async () => {
      try {
        const response = await fetch('/api/chat/info', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        })
        const data = await response.json()
        if (data.success) {
          setChatInfo(data.info)
        }
      } catch (error) {
        console.error('Error fetching chat info:', error)
      }
    }

    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/chat/messages?limit=50')
        const data = await response.json()
        if (data.success) {
          setMessages(data.messages)
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChatInfo()
    fetchMessages()
  }, [token])

  // Combinar mensajes del socket con mensajes iniciales
  useEffect(() => {
    if (socketMessages.length > 0) {
      setMessages(prev => {
        const newMessages = socketMessages.filter(
          socketMsg => !prev.some(prevMsg => prevMsg.id === socketMsg.id)
        )
        return [...prev, ...newMessages]
      })
    }
  }, [socketMessages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !isConnected) return

    if (!isAuthenticated && !socketAuthenticated) {
      alert('Debes estar logueado para enviar mensajes')
      return
    }

    try {
      if (socket && isConnected) {
        sendMessage(message)
        setMessage('')
      } else {
        // Fallback a API REST si socket no está disponible
        const response = await fetch('/api/chat/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ content: message })
        })

        const data = await response.json()
        if (data.success) {
          setMessages(prev => [...prev, data.message])
          setMessage('')
        } else {
          alert(data.error || 'Error al enviar mensaje')
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Error al enviar mensaje')
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (socket && isConnected) {
      deleteMessage(messageId)
    } else {
      // Fallback a API REST
      try {
        const response = await fetch('/api/chat/moderate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            action: 'delete_message',
            messageId
          })
        })

        const data = await response.json()
        if (data.success) {
          setMessages(prev => prev.filter(msg => msg.id !== messageId))
        } else {
          alert(data.error || 'Error al eliminar mensaje')
        }
      } catch (error) {
        console.error('Error deleting message:', error)
        alert('Error al eliminar mensaje')
      }
    }
  }

  const getDisplayName = () => {
    if (user) {
      return user.name || user.username || 'Usuario'
    }
    return anonymousName || 'Anónimo'
  }

  return (
    <>
      {/* Botón flotante del chat */}
      {!isOpen && (
        <div 
          className="position-fixed"
          style={{ 
            bottom: '20px', 
            right: '20px', 
            zIndex: 1000 
          }}
        >
          <button
            className="btn btn-primary rounded-circle shadow-lg"
            onClick={() => setIsOpen(true)}
            style={{ 
              width: '60px', 
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <i className="fas fa-comments fa-lg"></i>
          </button>
          
          {/* Indicador de conexión */}
          <div 
            className={`position-absolute rounded-circle ${
              isConnected ? 'bg-success' : 'bg-danger'
            }`}
            style={{
              width: '12px',
              height: '12px',
              top: '5px',
              right: '5px',
              border: '2px solid white'
            }}
          ></div>
        </div>
      )}

      {/* Widget del chat */}
      {isOpen && (
        <div 
          className={`position-fixed shadow-lg bg-white border ${
            window.innerWidth <= 768 ? 'w-100 h-100' : 'rounded'
          }`}
          style={{
            bottom: window.innerWidth <= 768 ? '0' : '20px',
            right: window.innerWidth <= 768 ? '0' : '20px',
            width: window.innerWidth <= 768 ? '100%' : '400px',
            height: window.innerWidth <= 768 ? '100%' : '600px',
            zIndex: 1001,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header del chat */}
          <div className="bg-primary text-white p-3 d-flex align-items-center justify-content-between">
            <div>
              <h6 className="mb-0">Chat Global</h6>
              <small>
                {isConnected ? 'Conectado' : 'Desconectado'} • 
                {chatInfo?.onlineUsers || 0} usuarios
              </small>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-light"
                onClick={() => setShowRules(!showRules)}
                title="Reglas del chat"
              >
                <i className="fas fa-info-circle"></i>
              </button>
              {chatInfo?.isModerator && (
                <button
                  className="btn btn-sm btn-outline-warning"
                  onClick={() => setShowModeration(true)}
                  title="Moderación"
                >
                  <i className="fas fa-shield-alt"></i>
                </button>
              )}
              <button
                className="btn btn-sm btn-outline-light"
                onClick={() => setIsOpen(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>

          {/* Reglas del chat */}
          {showRules && (
            <div className="p-3 bg-light border-bottom">
              <h6>Reglas del Chat</h6>
              <ul className="mb-0" style={{ fontSize: '12px' }}>
                {chatInfo?.rules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Área de mensajes */}
          <div 
            className="flex-grow-1 overflow-auto p-3"
            style={{ maxHeight: '400px' }}
          >
            {isLoading ? (
              <div className="text-center">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2 mb-0">Cargando mensajes...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-muted">
                <i className="fas fa-comments fa-2x mb-2"></i>
                <p>No hay mensajes aún. ¡Sé el primero en escribir!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onDelete={chatInfo?.isModerator ? handleDeleteMessage : undefined}
                  canModerate={chatInfo?.isModerator}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Área de entrada */}
          <div className="p-3 border-top">
            {!isAuthenticated && !socketAuthenticated ? (
              <div className="alert alert-warning mb-0" style={{ fontSize: '12px' }}>
                <i className="fas fa-info-circle me-1"></i>
                Debes estar logueado para enviar mensajes
              </div>
            ) : (
              <form onSubmit={handleSendMessage}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Escribe un mensaje como ${getDisplayName()}...`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={1000}
                    disabled={!isConnected}
                  />
                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={!message.trim() || !isConnected}
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
                <small className="text-muted">
                  {message.length}/1000 caracteres
                </small>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal de moderación */}
      {showModeration && (
        <ChatModeration
          onClose={() => setShowModeration(false)}
          onBanUser={(userId, reason, duration) => {
            console.log('User banned:', userId, reason, duration)
            setShowModeration(false)
          }}
          onBanIp={(ip, reason, duration) => {
            console.log('IP banned:', ip, reason, duration)
            setShowModeration(false)
          }}
        />
      )}
    </>
  )
}