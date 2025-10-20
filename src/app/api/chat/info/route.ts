import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    let user: any = null
    let isModerator = false

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      try {
        const decoded = verifyToken(token)
        if (decoded) {
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
      "🎯 **BIENVENIDO AL CHAT DE PROGRAMADORES ARGENTINA**",
      "",
      "📋 **REGLAS GENERALES:**",
      "• Respeta a todos los usuarios del chat",
      "• Mantén las conversaciones en español",
      "• No envíes spam, mensajes repetitivos o flood",
      "• No compartas contenido inapropiado, ofensivo o NSFW",
      "• No hagas publicidad no solicitada o promoción de servicios",
      "",
      "💻 **REGLAS TÉCNICAS:**",
      "• Comparte código usando bloques de código (```)",
      "• Haz preguntas técnicas claras y específicas",
      "• Ayuda a otros desarrolladores cuando puedas",
      "• No compartas información personal o sensible",
      "• Los links se detectan automáticamente",
      "",
      "👥 **PARTICIPACIÓN:**",
      "• No necesitas estar suscrito para participar",
      "• Los usuarios anónimos aparecen como 'anonimo-[número]'",
      "• Los usuarios registrados aparecen con su nombre",
      "• Máximo 1000 caracteres por mensaje",
      "",
      "⚖️ **MODERACIÓN:**",
      "• Los moderadores pueden eliminar mensajes",
      "• Se pueden aplicar bans temporales o permanentes",
      "• Los admins pueden banear por IP",
      "• Reporta comportamientos inapropiados",
      "",
      "🚀 **¡Disfruta conversando con la comunidad!**"
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