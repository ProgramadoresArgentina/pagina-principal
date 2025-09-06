import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    let user = null
    let isModerator = false

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      try {
        const decoded = verifyToken(token)
        user = await prisma.user.findUnique({
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

        if (user) {
          isModerator = user.role.name === 'admin' || user.role.name === 'moderator' ||
            user.role.permissions.some(rp => 
              rp.permission.resource === 'chat' && 
              (rp.permission.action === 'moderate' || rp.permission.action === 'delete')
            )
        }
      } catch (error) {
        // Token inválido, continuar sin usuario
      }
    }

    // Obtener estadísticas del chat
    const messageCount = await prisma.chatMessage.count({
      where: {
        isDeleted: false,
        chat: {
          name: 'Chat Global'
        }
      }
    })

    const onlineUsers = await prisma.user.count({
      where: {
        lastLogin: {
          gte: new Date(Date.now() - 15 * 60 * 1000) // Últimos 15 minutos
        }
      }
    })

    const chatRules = [
      "1. Respeta a todos los usuarios del chat",
      "2. No envíes spam o mensajes repetitivos",
      "3. No compartas contenido inapropiado o ofensivo",
      "4. No hagas publicidad no solicitada",
      "5. Mantén las conversaciones en español",
      "6. Los moderadores pueden eliminar mensajes y banear usuarios",
      "7. No es necesario estar suscrito para participar, solo estar logueado",
      "8. Los usuarios anónimos aparecerán como 'anonimo-[número]'",
      "9. Los links se detectan automáticamente y son clickeables",
      "10. Los moderadores y admins pueden banear por IP"
    ]

    return NextResponse.json({
      success: true,
      info: {
        messageCount,
        onlineUsers,
        rules: chatRules,
        isModerator,
        user: user ? {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role.name
        } : null
      }
    })
  } catch (error) {
    console.error('Error fetching chat info:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener información del chat' },
      { status: 500 }
    )
  }
}