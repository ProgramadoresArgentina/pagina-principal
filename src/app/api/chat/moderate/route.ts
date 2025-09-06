import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Token de autorización requerido' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Token inválido' },
        { status: 401 }
      )
    }

    // Verificar que el usuario sea moderador o admin
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
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

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const isModerator = user.role.name === 'admin' || user.role.name === 'moderator' ||
      user.role.permissions.some(rp => 
        rp.permission.resource === 'chat' && 
        (rp.permission.action === 'moderate' || rp.permission.action === 'delete')
      )

    if (!isModerator) {
      return NextResponse.json(
        { success: false, error: 'No tienes permisos de moderación' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, messageId, userId, reason, duration } = body

    if (action === 'delete_message') {
      if (!messageId) {
        return NextResponse.json(
          { success: false, error: 'ID de mensaje requerido' },
          { status: 400 }
        )
      }

      const message = await prisma.chatMessage.findUnique({
        where: { id: messageId },
        include: { user: true }
      })

      if (!message) {
        return NextResponse.json(
          { success: false, error: 'Mensaje no encontrado' },
          { status: 404 }
        )
      }

      await prisma.chatMessage.update({
        where: { id: messageId },
        data: { isDeleted: true }
      })

      return NextResponse.json({
        success: true,
        message: 'Mensaje eliminado correctamente'
      })
    }

    if (action === 'ban_user') {
      if (!userId) {
        return NextResponse.json(
          { success: false, error: 'ID de usuario requerido' },
          { status: 400 }
        )
      }

      const targetUser = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!targetUser) {
        return NextResponse.json(
          { success: false, error: 'Usuario no encontrado' },
          { status: 404 }
        )
      }

      // No permitir banear a otros admins
      if (targetUser.roleId === user.roleId && user.role.name === 'admin') {
        return NextResponse.json(
          { success: false, error: 'No puedes banear a otros administradores' },
          { status: 403 }
        )
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

      // Calcular fecha de expiración
      let expiresAt: Date | null = null
      if (duration && duration > 0) {
        expiresAt = new Date(Date.now() + duration * 60 * 1000) // duration en minutos
      }

      await prisma.chatBan.create({
        data: {
          chatId: chat.id,
          userId: userId,
          bannedBy: user.id,
          reason: reason || 'Sin razón especificada',
          expiresAt
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Usuario baneado correctamente'
      })
    }

    if (action === 'ban_ip') {
      const { ip } = body
      if (!ip) {
        return NextResponse.json(
          { success: false, error: 'IP requerida' },
          { status: 400 }
        )
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

      // Calcular fecha de expiración
      let expiresAt: Date | null = null
      if (duration && duration > 0) {
        expiresAt = new Date(Date.now() + duration * 60 * 1000) // duration en minutos
      }

      await prisma.chatBan.create({
        data: {
          chatId: chat.id,
          bannedIp: ip,
          bannedBy: user.id,
          reason: reason || 'Sin razón especificada',
          expiresAt
        }
      })

      return NextResponse.json({
        success: true,
        message: 'IP baneada correctamente'
      })
    }

    return NextResponse.json(
      { success: false, error: 'Acción no válida' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in moderation:', error)
    return NextResponse.json(
      { success: false, error: 'Error en la moderación' },
      { status: 500 }
    )
  }
}