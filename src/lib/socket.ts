import { Server as NetServer } from 'http'
import { NextApiResponse } from 'next'
import { Server as ServerIO } from 'socket.io'
import { createClient } from 'redis'
import { prisma } from './prisma'
import { verifyToken } from './auth'

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO
    }
  }
}

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
})

redis.on('error', (err) => console.log('Redis Client Error', err))
redis.connect()

export const SocketHandler = (req: any, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new ServerIO(res.socket.server, {
      path: '/api/socketio',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? process.env.NEXT_PUBLIC_APP_URL 
          : 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
      }
    })

    res.socket.server.io = io

    io.on('connection', async (socket) => {
      console.log('New client connected:', socket.id)

      // Autenticación del socket
      socket.on('authenticate', async (data) => {
        try {
          if (data.token) {
            const decoded = verifyToken(data.token)
            if (decoded) {
              const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: {
                  id: true,
                  name: true,
                  username: true,
                  avatar: true,
                  role: {
                    select: {
                      name: true
                    }
                  }
                }
              })

              if (user) {
                socket.data.user = user
                socket.data.isAuthenticated = true
                socket.emit('authenticated', { user })
                console.log('User authenticated:', user.name || user.username)
              } else {
                socket.emit('auth_error', { message: 'Usuario no encontrado' })
              }
            } else {
              socket.emit('auth_error', { message: 'Token inválido' })
            }
          } else {
            // Usuario anónimo
            const randomNum = Math.floor(Math.random() * 9999) + 1
            socket.data.anonymousName = `anonimo-${randomNum}`
            socket.data.isAuthenticated = false
            socket.emit('authenticated', { anonymousName: socket.data.anonymousName })
            console.log('Anonymous user connected:', socket.data.anonymousName)
          }
        } catch (error) {
          socket.emit('auth_error', { message: 'Token inválido' })
        }
      })

      // Unirse al chat global
      socket.on('join_chat', async () => {
        try {
          await socket.join('global_chat')
          
          // Obtener o crear el chat global
          let chat = await prisma.chat.findFirst({
            where: { name: 'Chat Global' }
          })

          if (!chat) {
            chat = await prisma.chat.create({
              data: {
                name: 'Chat Global',
                isActive: true
              }
            })
          }

          // Verificar si el usuario está baneado
          const userIp = socket.handshake.address || 'unknown'
          let isBanned = false

          if (socket.data.user) {
            const userBan = await prisma.chatBan.findFirst({
              where: {
                chatId: chat.id,
                userId: socket.data.user.id,
                OR: [
                  { expiresAt: null },
                  { expiresAt: { gt: new Date() } }
                ]
              }
            })
            isBanned = !!userBan
          }

          const ipBan = await prisma.chatBan.findFirst({
            where: {
              chatId: chat.id,
              bannedIp: userIp,
              OR: [
                { expiresAt: null },
                { expiresAt: { gt: new Date() } }
              ]
            }
          })

          if (ipBan) {
            isBanned = true
          }

          if (isBanned) {
            socket.emit('banned', { message: 'Estás baneado del chat' })
            return
          }

          socket.emit('joined_chat', { chatId: chat.id })
          console.log('User joined global chat:', socket.data.user?.name || socket.data.anonymousName)
        } catch (error) {
          console.error('Error joining chat:', error)
          socket.emit('error', { message: 'Error al unirse al chat' })
        }
      })

      // Enviar mensaje
      socket.on('send_message', async (data) => {
        try {
          if (!data.content || data.content.trim().length === 0) {
            socket.emit('error', { message: 'El mensaje no puede estar vacío' })
            return
          }

          if (data.content.length > 1000) {
            socket.emit('error', { message: 'El mensaje es demasiado largo' })
            return
          }

          // Obtener el chat global
          const chat = await prisma.chat.findFirst({
            where: { name: 'Chat Global' }
          })

          if (!chat) {
            socket.emit('error', { message: 'Chat no encontrado' })
            return
          }

          // Crear el mensaje
          const message = await prisma.chatMessage.create({
            data: {
              content: data.content.trim(),
              chatId: chat.id,
              userId: socket.data.user?.id || null,
              anonymousName: socket.data.user ? null : socket.data.anonymousName,
              userIp: socket.data.user ? null : (socket.handshake.address || 'unknown')
            },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  username: true,
                  avatar: true,
                  role: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            }
          })

          // Emitir el mensaje a todos los usuarios en el chat
          io.to('global_chat').emit('new_message', message)
          console.log('Message sent:', message.content.substring(0, 50) + '...')
        } catch (error) {
          console.error('Error sending message:', error)
          socket.emit('error', { message: 'Error al enviar mensaje' })
        }
      })

      // Moderación - eliminar mensaje
      socket.on('delete_message', async (data) => {
        try {
          if (!socket.data.user) {
            socket.emit('error', { message: 'No autorizado' })
            return
          }

          // Verificar permisos de moderación
          const user = await prisma.user.findUnique({
            where: { id: socket.data.user.id },
            include: {
              role: {
                include: {
                  permissions: {
                    include: {
                      permission: true
                    }
                  }
                }
              }
            }
          })

          const isModerator = user?.role.name === 'admin' || user?.role.name === 'moderator' ||
            user?.role.permissions.some(rp => 
              rp.permission.resource === 'chat' && 
              (rp.permission.action === 'moderate' || rp.permission.action === 'delete')
            )

          if (!isModerator) {
            socket.emit('error', { message: 'No tienes permisos de moderación' })
            return
          }

          const message = await prisma.chatMessage.findUnique({
            where: { id: data.messageId }
          })

          if (!message) {
            socket.emit('error', { message: 'Mensaje no encontrado' })
            return
          }

          await prisma.chatMessage.update({
            where: { id: data.messageId },
            data: { isDeleted: true }
          })

          // Notificar a todos los usuarios
          io.to('global_chat').emit('message_deleted', { messageId: data.messageId })
          console.log('Message deleted by moderator:', socket.data.user.name)
        } catch (error) {
          console.error('Error deleting message:', error)
          socket.emit('error', { message: 'Error al eliminar mensaje' })
        }
      })

      // Desconexión
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
      })
    })
  }
  res.end()
}