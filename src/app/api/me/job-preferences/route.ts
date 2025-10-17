import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function fetchGroupMembers() {
  const url = (process.env.WHATSAPP_GROUP_MEMBERS_URL || '').trim()
  const token = (process.env.WHATSAPP_SANDBOX_TOKEN || '').trim()
  if (!url || !token) {
    const missing = [!url ? 'WHATSAPP_GROUP_MEMBERS_URL' : null, !token ? 'WHATSAPP_SANDBOX_TOKEN' : null]
      .filter(Boolean)
      .join(', ')
    throw new Error(`Faltan variables de entorno de WhatsApp: ${missing}.`)
  }
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
    cache: 'no-store',
  })
  if (!resp.ok) {
    const text = await resp.text().catch(() => '')
    const err = new Error(`Error consultando miembros del grupo: ${resp.status} ${text}`)
    ;(err as any).status = resp.status
    throw err
  }
  return resp.json()
}

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

    const hasJobPreference = (prisma as any).jobPreference !== undefined
    const preferences = hasJobPreference
      ? await (prisma as any).jobPreference.findUnique({ where: { userId: user.id } })
      : null

    return NextResponse.json({
      receiveJobNotifications: preferences?.receiveJobNotifications ?? false,
      technologies: preferences?.technologies ?? [],
      seniority: preferences?.seniority ?? null,
      provinces: preferences?.provinces ?? [],
      lid: user.lid ?? null,
      preferencesPersisted: !!hasJobPreference,
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
    const phoneFormatted: string | undefined = body.phoneFormatted
    const technologies: string[] | undefined = body.technologies
    const seniority: string | undefined = body.seniority
    const provinces: string[] | undefined = body.provinces

    const hasJobPreference = (prisma as any).jobPreference !== undefined
    if (hasJobPreference) {
      // Asegurar preferences existente
      await (prisma as any).jobPreference.upsert({
        where: { userId: authUser.id },
        create: { userId: authUser.id },
        update: {},
      })
    }

    let newLid: string | null = null
    if (receive) {
      if (!phoneFormatted) {
        return NextResponse.json({ error: 'Número de WhatsApp requerido para activar notificaciones' }, { status: 400 })
      }
      // Buscar en miembros del grupo por formattedName exacto
    const data = await fetchGroupMembers()
      const members: any[] = Array.isArray(data) ? data : (Array.isArray(data?.members) ? data.members : [])
      const onlyDigits = (s: string) => String(s || '').replace(/\D+/g, '')
      const target = onlyDigits(phoneFormatted)
      const match = members.find((m) => onlyDigits(m?.formattedName || '') === target)
      if (!match || !match.id || !match.id._serialized) {
        return NextResponse.json({
          error: 'No se pudo sincronizar tu WhatsApp. Unite al grupo o escribí a programadoresargentina@gmail.com',
        }, { status: 400 })
      }
      newLid = String(match.id._serialized)

      // Guardar LID en el usuario
      await prisma.user.update({ where: { id: authUser.id }, data: { lid: newLid } as any })
    }

    // Actualizar preferencias
    let updatedPrefs: any = null
    if (hasJobPreference) {
      updatedPrefs = await (prisma as any).jobPreference.update({
        where: { userId: authUser.id },
        data: {
          receiveJobNotifications: receive,
          technologies: technologies ?? undefined,
          seniority: seniority as any | undefined,
          provinces: provinces ?? undefined,
        },
      })
    }

    return NextResponse.json({
      ok: true,
      lid: newLid ?? authUser.lid ?? null,
      preferences: updatedPrefs,
      preferencesPersisted: !!hasJobPreference,
    })
  } catch (error: any) {
    console.error('Error guardando preferencias:', error)
    const status = error?.status === 401 ? 400 : 500
    const message = error?.status === 401
      ? 'No se pudo validar la sesión del sandbox. Verificá URL/TOKEN en configuración.'
      : (error?.message || 'Error interno del servidor')
    return NextResponse.json({ error: message }, { status })
  }
}


