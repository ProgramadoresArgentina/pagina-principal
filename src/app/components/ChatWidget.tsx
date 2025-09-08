'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSocket } from '@/hooks/useSocket'
import { useAuth } from '@/contexts/AuthContext'
import ChatMessage from './ChatMessage'
import ChatModeration from './ChatModeration'
import DateDivider from './DateDivider'

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
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  
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

  // Función para cargar más mensajes antiguos
  const loadMoreMessages = useCallback(async () => {
    if (isLoadingMore || !hasMoreMessages || !nextCursor) return

    setIsLoadingMore(true)
    try {
      const response = await fetch(`/api/chat/messages?limit=50&cursor=${nextCursor}&direction=older`)
      const data = await response.json()
      
      if (data.success) {
        const newMessages = data.messages
        setMessages(prev => [...newMessages, ...prev])
        setHasMoreMessages(data.pagination.hasMore)
        setNextCursor(data.pagination.nextCursor)
      }
    } catch (error) {
      console.error('Error loading more messages:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, hasMoreMessages, nextCursor])

  // Función para detectar scroll hacia arriba
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = e.currentTarget
    if (scrollTop === 0 && hasMoreMessages && !isLoadingMore) {
      loadMoreMessages()
    }
  }, [hasMoreMessages, isLoadingMore, loadMoreMessages])

  // Función para agrupar mensajes por fecha
  const groupMessagesByDate = (messages: any[]) => {
    const grouped: { [key: string]: any[] } = {}
    
    messages.forEach(message => {
      const date = new Date(message.createdAt)
      const dateKey = date.toDateString()
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(message)
    })
    
    return grouped
  }

  // Función para renderizar mensajes con divisores de fecha
  const renderMessagesWithDividers = () => {
    const groupedMessages = groupMessagesByDate(messages)
    const sortedDates = Object.keys(groupedMessages).sort((a, b) => 
      new Date(a).getTime() - new Date(b).getTime()
    )
    
    return sortedDates.map(dateKey => (
      <React.Fragment key={dateKey}>
        <DateDivider date={new Date(dateKey)} />
        {groupedMessages[dateKey].map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onDelete={chatInfo?.isModerator ? handleDeleteMessage : undefined}
            canModerate={chatInfo?.isModerator}
          />
        ))}
      </React.Fragment>
    ))
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
          setHasMoreMessages(data.pagination.hasMore)
          setNextCursor(data.pagination.nextCursor)
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

    console.log('Auth status:', { isAuthenticated, socketAuthenticated, isConnected })
    
    // Permitir envío de mensajes siempre que esté conectado
    if (!isConnected) {
      alert('No estás conectado al chat')
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
            bottom: '100px', 
            right: '70px', 
            zIndex: 1000 
          }}
        >
          <button
            className="btn btn-success rounded-circle shadow-lg"
            onClick={() => setIsOpen(true)}
            title="Chatea con la comunidad!"
            style={{ 
              width: '60px', 
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}
          >
            <i className="fas fa-comments fa-lg"></i>
          </button>
          
          {/* Texto invitación */}
          <div 
            className="position-absolute text-center"
            style={{
              bottom: '70px',
              right: '-20px',
              width: '100px',
              fontSize: '14px',
              color: '#28a745',
              fontWeight: '600',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
              pointerEvents: 'none'
            }}
          >
            Chatea con la comunidad!
          </div>
          
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
          <div className="bg-success text-white p-3 d-flex align-items-center justify-content-between">
            <div>
              <h6 className="mb-0 text-white">Chat General</h6>
              <small>
                {isConnected ? 'Conectado' : 'Desconectado'} • 
                {/* {chatInfo?.onlineUsers || 0} usuarios */}
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
            <div className="p-3 bg-white border-bottom shadow-sm" style={{ maxHeight: '300px', overflowY: 'auto', zIndex: 10, position: 'relative' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0 text-dark">📋 Reglas del Chat</h6>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setShowRules(false)}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                {chatInfo?.rules.map((rule, index) => (
                  <div key={index} className="mb-1">
                    {rule.startsWith('**') ? (
                      <strong style={{ color: '#0d6efd' }}>{rule.replace(/\*\*/g, '')}</strong>
                    ) : rule.startsWith('•') ? (
                      <span style={{ marginLeft: '10px' }}>{rule}</span>
                    ) : rule === '' ? (
                      <br />
                    ) : (
                      <span>{rule}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Área de mensajes */}
          <div 
            ref={messagesContainerRef}
            className="flex-grow-1 overflow-auto p-3"
            style={{ 
              maxHeight: window.innerWidth <= 768 ? 'calc(100vh - 200px)' : '400px',
              minHeight: window.innerWidth <= 768 ? 'calc(100vh - 200px)' : '200px'
            }}
            onScroll={handleScroll}
          >
            {isLoading ? (
              <div 
                className="text-center d-flex flex-column justify-content-center align-items-center"
                style={{ 
                  height: window.innerWidth <= 768 ? 'calc(100vh - 300px)' : '300px',
                  minHeight: '200px'
                }}
              >
                <div className="spinner-border mb-3" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <h5 className="mb-2">Cargando chat...</h5>
                <p className="mb-0">Conectando con otros usuarios</p>
              </div>
            ) : messages.length === 0 ? (
              <div 
                className="text-center text-muted d-flex flex-column justify-content-center align-items-center"
                style={{ 
                  height: window.innerWidth <= 768 ? 'calc(100vh - 300px)' : '300px',
                  minHeight: '200px'
                }}
              >
                <i className="fas fa-comments fa-3x mb-3"></i>
                <h5 className="mb-2">¡Bienvenido al chat!</h5>
                <p className="mb-0">No hay mensajes aún. ¡Sé el primero en escribir!</p>
              </div>
            ) : (
              <>
                {/* Indicador de carga más mensajes */}
                {isLoadingMore && (
                  <div className="text-center py-2">
                    <div className="spinner-border spinner-border-sm" role="status">
                      <span className="visually-hidden">Cargando más mensajes...</span>
                    </div>
                    <span className="ms-2 text-muted">Cargando mensajes anteriores...</span>
                  </div>
                )}
                
                {/* Mensajes con divisores de fecha */}
                {renderMessagesWithDividers()}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Área de entrada */}
          <div className="p-3 border-top">
            {!isConnected ? (
              <div className="alert alert-warning mb-0" style={{ fontSize: '12px' }}>
                <i className="fas fa-info-circle me-1"></i>
                Conectando al chat...
              </div>
            ) : (
              <form onSubmit={handleSendMessage}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Escribe un mensaje${user ? ` como ${getDisplayName()}` : ' (aparecerás como anónimo)'}...`}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={1000}
                    disabled={!isConnected}
                  />
                  <button
                    className="btn btn-success"
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