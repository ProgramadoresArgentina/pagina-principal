'use client'

import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '@/contexts/AuthContext'

interface ChatMessage {
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

interface UseSocketReturn {
  socket: Socket | null
  isConnected: boolean
  messages: ChatMessage[]
  sendMessage: (content: string) => void
  deleteMessage: (messageId: string) => void
  isAuthenticated: boolean
  anonymousName?: string
}

export function useSocket(): UseSocketReturn {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [anonymousName, setAnonymousName] = useState<string>()
  const { user, token } = useAuth()

  useEffect(() => {
    const socketInstance = io(process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_APP_URL || 'https://programadoresargentina.com'
      : 'http://localhost:3000', {
      path: '/api/socketio',
      autoConnect: true
    })

    socketInstance.on('connect', () => {
      console.log('Connected to socket server')
      setIsConnected(true)
      
      // Autenticar el socket
      console.log('Emitting authenticate with token:', token ? 'present' : 'null')
      socketInstance.emit('authenticate', { 
        token: token || null 
      })
    })

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from socket server')
      setIsConnected(false)
    })

    socketInstance.on('authenticated', (data) => {
      console.log('Socket authenticated:', data)
      setIsAuthenticated(true)
      if (data.anonymousName) {
        setAnonymousName(data.anonymousName)
      } else if (!token) {
        // Generar nombre anónimo si no hay token y no se recibió uno del servidor
        const randomNumber = Math.floor(Math.random() * 9999) + 1
        setAnonymousName(`anonimo-${randomNumber}`)
      }
      // Unirse al chat después de autenticarse
      socketInstance.emit('join_chat')
    })


    socketInstance.on('auth_error', (data) => {
      console.error('Auth error:', data.message)
      setIsAuthenticated(false)
    })

    socketInstance.on('joined_chat', (data) => {
      console.log('Joined chat:', data.chatId)
    })

    socketInstance.on('banned', (data) => {
      console.error('User is banned:', data.message)
      alert('Estás baneado del chat: ' + data.message)
    })

    socketInstance.on('new_message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message])
    })

    socketInstance.on('message_deleted', (data) => {
      setMessages(prev => prev.filter(msg => msg.id !== data.messageId))
    })

    socketInstance.on('error', (data) => {
      console.error('Socket error:', data.message)
      alert('Error: ' + data.message)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [token])

  const sendMessage = (content: string) => {
    if (socket && isConnected) {
      socket.emit('send_message', { content })
    }
  }

  const deleteMessage = (messageId: string) => {
    if (socket && isConnected) {
      socket.emit('delete_message', { messageId })
    }
  }

  return {
    socket,
    isConnected,
    messages,
    sendMessage,
    deleteMessage,
    isAuthenticated,
    anonymousName
  }
}