import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token de autorización requerido' }, { status: 401 })
    }
    const token = authHeader.substring(7)
    const user = await getAuthenticatedUser(token)
    if (!user) {
      return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 401 })
    }

    const preferences = await prisma.jobPreference.findUnique({ 
      where: { userId: user.id } 
    })

    return NextResponse.json({
      receiveJobNotifications: preferences?.receiveJobNotifications ?? false,
      technologies: preferences?.technologies ?? [],
      seniority: preferences?.seniority ?? null,
      provinces: preferences?.provinces ?? [],
      phone: preferences?.phone ?? null,
      lid: user.lid ?? null,
      preferencesPersisted: true,
    })
  } catch (error) {
    console.error('Error obteniendo preferencias:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

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

    const body = await request.json().catch(() => ({}))
    const receive = !!body.receive
    const technologies: string[] | undefined = body.technologies
    const seniority: string | undefined = body.seniority
    const provinces: string[] | undefined = body.provinces

    // Validar que si activa las notificaciones, tenga un LID
    if (receive && !authUser.lid) {
      return NextResponse.json({ 
        error: 'Primero debes enlazar tu número de WhatsApp antes de activar las notificaciones' 
      }, { status: 400 })
    }

    // Si desactiva las notificaciones, eliminar el LID (desenlazar WhatsApp)
    if (!receive && authUser.lid) {
      await prisma.user.update({ 
        where: { id: authUser.id }, 
        data: { lid: null } as any 
      })
    }

    // Asegurar preferences existente
    await prisma.jobPreference.upsert({
      where: { userId: authUser.id },
      create: { userId: authUser.id },
      update: {},
    })

    // Actualizar preferencias
    const updatedPrefs = await prisma.jobPreference.update({
      where: { userId: authUser.id },
      data: {
        receiveJobNotifications: receive,
        technologies: technologies ?? undefined,
        seniority: seniority ? (seniority as 'JUNIOR' | 'SEMI_SENIOR' | 'SENIOR' | 'LEAD') : undefined,
        provinces: provinces ?? undefined,
      },
    })

    return NextResponse.json({
      ok: true,
      lid: receive ? authUser.lid : null,
      preferences: updatedPrefs,
      preferencesPersisted: true,
    })
  } catch (error: any) {
    console.error('Error guardando preferencias:', error)
    return NextResponse.json({ 
      error: error?.message || 'Error interno del servidor' 
    }, { status: 500 })
  }
}


