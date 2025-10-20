import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Endpoint para desenlazar número de WhatsApp (eliminar el LID)
 * POST /api/me/unlink-whatsapp
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token de autorización requerido' }, { status: 401 })
    }
    const token = authHeader.substring(7)
    const authUser = await getAuthenticatedUser(token)
    if (!authUser) {
      return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 401 })
    }

    // Eliminar LID del usuario
    await prisma.user.update({ 
      where: { id: authUser.id }, 
      data: { lid: null } as any 
    })

    return NextResponse.json({
      ok: true,
      message: 'WhatsApp desenlazado correctamente'
    })
  } catch (error: any) {
    console.error('Error desenlazando WhatsApp:', error)
    return NextResponse.json({ 
      error: error?.message || 'Error interno del servidor' 
    }, { status: 500 })
  }
}

