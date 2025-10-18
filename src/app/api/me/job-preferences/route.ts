import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

async function fetchGroupMembers() {
  const url = (process.env.WHATSAPP_GROUP_MEMBERS_URL || '').trim()
  const token = (process.env.WHATSAPP_SANDBOX_TOKEN || '$2b$10$p_lC2nibJ1MgC4SYaSUtCejH5TN2gbjkEmuiBFtxNpOyWiGwRymWC').trim()
  
  console.log('🌐 FETCH GROUP MEMBERS:')
  console.log('  URL:', url)
  console.log('  Token length:', token.length)
  
  if (!url || !token) {
    const missing = [!url ? 'WHATSAPP_GROUP_MEMBERS_URL' : null, !token ? 'WHATSAPP_SANDBOX_TOKEN' : null]
      .filter(Boolean)
      .join(', ')
    throw new Error(`Faltan variables de entorno de WhatsApp: ${missing}.`)
  }
  
  try {
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      cache: 'no-store',
    })
    
    console.log('📡 HTTP Response:', {
      status: resp.status,
      statusText: resp.statusText,
      ok: resp.ok,
      headers: Object.fromEntries(resp.headers.entries())
    })
    
    if (!resp.ok) {
      const text = await resp.text().catch(() => '')
      console.log('❌ Error response body:', text)
      const err = new Error(`Error consultando miembros del grupo: ${resp.status} ${text}`)
      ;(err as any).status = resp.status
      throw err
    }
    
    const jsonData = await resp.json()
    console.log('✅ JSON Response:', {
      type: typeof jsonData,
      isArray: Array.isArray(jsonData),
      keys: Object.keys(jsonData || {}),
      sample: JSON.stringify(jsonData, null, 2).substring(0, 500) + '...'
    })
    
    return jsonData
  } catch (error) {
    console.log('💥 FETCH ERROR:', error)
    throw error
  }
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
      phone: preferences?.phone ?? null,
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
      console.log('🔍 FETCHING GROUP MEMBERS...')
      const data = await fetchGroupMembers()
      console.log('📊 API Response:', {
        isArray: Array.isArray(data),
        hasResponse: !!data?.response,
        hasMembers: !!data?.members,
        responseLength: data?.response?.length,
        membersLength: data?.members?.length,
        dataKeys: Object.keys(data || {}),
        fullData: JSON.stringify(data, null, 2)
      })
      const members: any[] = Array.isArray(data) ? data : (Array.isArray(data?.response) ? data.response : (Array.isArray(data?.members) ? data.members : []))
      const onlyDigits = (s: string) => String(s || '').replace(/\D+/g, '')
      const normalizeUruguayNumber = (s: string) => {
        const digits = onlyDigits(s)
        // Si es un número de Uruguay (598) y tiene un 0 extra después del código país, lo removemos
        if (digits.startsWith('5980') && digits.length === 12) {
          return '598' + digits.substring(4)
        }
        return digits
      }
      const target = normalizeUruguayNumber(phoneFormatted)
      
      console.log('🔍 DEBUG MATCHING:')
      console.log('  phoneFormatted:', phoneFormatted)
      console.log('  target (digits only):', target)
      console.log('  total members:', members.length)
      
      // Log first few members for debugging
      members.slice(0, 3).forEach((m, i) => {
        const memberDigits = onlyDigits(m?.formattedName || '')
        console.log(`  member ${i}:`, {
          formattedName: m?.formattedName,
          digitsOnly: memberDigits,
          matches: memberDigits === target
        })
      })
      
      // Log ALL members to find the specific number
      console.log('🔍 ALL MEMBERS:')
      members.forEach((m, i) => {
        const memberDigits = onlyDigits(m?.formattedName || '')
        if (memberDigits.includes('598') || memberDigits.includes('5980')) {
          console.log(`  member ${i}:`, {
            formattedName: m?.formattedName,
            digitsOnly: memberDigits,
            matches: memberDigits === target,
            pushname: m?.pushname
          })
        }
      })
      
      const match = members.find((m) => normalizeUruguayNumber(m?.formattedName || '') === target)
      if (!match || !match.id || !match.id._serialized) {
        return NextResponse.json({
          error: '❌ No pudimos encontrar tu número en el grupo de WhatsApp.\n\n' +
                 '📱 Verificá que:\n' +
                 '• Estés en el grupo "Ofertas Laborales" de Programadores Argentina\n' +
                 '• El número ingresado coincida EXACTAMENTE con el que tenés en WhatsApp\n\n' +
                 '💬 ¿Necesitás ayuda? Escribinos a programadoresargentina@gmail.com'
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
          phone: phoneFormatted ?? undefined,
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


