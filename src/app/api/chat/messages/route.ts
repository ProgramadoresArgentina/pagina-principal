import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const cursor = searchParams.get('cursor') // ID del último mensaje cargado
    const direction = searchParams.get('direction') || 'older' // 'older' o 'newer'

    // Construir where clause
    const whereClause: any = {
      isDeleted: false,
      chat: {
        name: 'Chat Global'
      }
    }

    // Si hay cursor, agregar condición para paginación
    if (cursor) {
      const cursorMessage = await prisma.chatMessage.findUnique({
        where: { id: cursor },
        select: { createdAt: true }
      })

      if (cursorMessage) {
        if (direction === 'older') {
          whereClause.createdAt = { lt: cursorMessage.createdAt }
        } else {
          whereClause.createdAt = { gt: cursorMessage.createdAt }
        }
      }
    }

    // Obtener mensajes del chat global
    const messages = await prisma.chatMessage.findMany({
      where: whereClause,
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
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    // Determinar si hay más mensajes
    const hasMore = messages.length === limit
    const nextCursor = hasMore && messages.length > 0 ? messages[0].id : null

    return NextResponse.json({
      success: true,
      messages: messages.reverse(), // Mostrar del más antiguo al más nuevo
      pagination: {
        hasMore,
        nextCursor,
        direction
      }
    })
  } catch (error) {
    console.error('Error fetching chat messages:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener mensajes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { content } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'El mensaje no puede estar vacío' },
        { status: 400 }
      )
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { success: false, error: 'El mensaje es demasiado largo (máximo 1000 caracteres)' },
        { status: 400 }
      )
    }

    // Verificar autenticación
    const authHeader = request.headers.get('authorization')
    let user: any = null
    let anonymousName: string | null = null

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      try {
        const decoded = verifyToken(token)
        if (decoded) {
          user = await prisma.user.findUnique({
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
        }
      } catch (error) {
        // Token inválido, continuar como usuario anónimo
      }
    }

    // Si no está autenticado, generar nombre anónimo
    if (!user) {
      const randomNum = Math.floor(Math.random() * 9999) + 1
      anonymousName = `anonimo-${randomNum}`
    }

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
    const userIp = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   'unknown'

    if (user) {
      const userBan = await prisma.chatBan.findFirst({
        where: {
          chatId: chat.id,
          userId: user.id,
          OR: [
            { expiresAt: null }, // Ban permanente
            { expiresAt: { gt: new Date() } } // Ban temporal activo
          ]
        }
      })

      if (userBan) {
        return NextResponse.json(
          { success: false, error: 'Estás baneado del chat' },
          { status: 403 }
        )
      }
    }

    // Verificar ban por IP
    const ipBan = await prisma.chatBan.findFirst({
      where: {
        chatId: chat.id,
        bannedIp: userIp,
        OR: [
          { expiresAt: null }, // Ban permanente
          { expiresAt: { gt: new Date() } } // Ban temporal activo
        ]
      }
    })

    if (ipBan) {
      return NextResponse.json(
        { success: false, error: 'Esta IP está baneada del chat' },
        { status: 403 }
      )
    }

    // Crear el mensaje
    const message = await prisma.chatMessage.create({
      data: {
        content: content.trim(),
        chatId: chat.id,
        userId: user?.id || null,
        anonymousName,
        userIp: user ? null : userIp
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

    return NextResponse.json({
      success: true,
      message
    })
  } catch (error) {
    console.error('Error creating chat message:', error)
    return NextResponse.json(
      { success: false, error: 'Error al enviar mensaje' },
      { status: 500 }
    )
  }
}