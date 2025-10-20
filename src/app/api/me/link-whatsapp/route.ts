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

/**
 * Endpoint para enlazar número de WhatsApp y obtener el LID
 * POST /api/me/link-whatsapp
 * Body: { phoneFormatted: string }
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

    const body = await request.json().catch(() => ({}))
    const phoneFormatted: string | undefined = body.phoneFormatted

    if (!phoneFormatted) {
      return NextResponse.json({ error: 'Número de WhatsApp requerido' }, { status: 400 })
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
    
    const normalizePhoneNumber = (s: string) => {
      const digits = onlyDigits(s)
      
      // Números de Argentina (+54)
      if (digits.startsWith('54')) {
        // Si tiene 9 después del 54 (móvil), lo mantenemos
        if (digits.startsWith('549') && digits.length >= 12) {
          return digits
        }
        // Si no tiene 9, lo agregamos (para números fijos que se convierten a móvil)
        if (digits.startsWith('54') && !digits.startsWith('549') && digits.length >= 10) {
          return '549' + digits.substring(2)
        }
        return digits
      }
      
      // Números de Uruguay (+598)
      if (digits.startsWith('598')) {
        // Si tiene un 0 extra después del código país, lo removemos
        if (digits.startsWith('5980') && digits.length === 12) {
          return '598' + digits.substring(4)
        }
        return digits
      }
      
      return digits
    }
    
    const target = normalizePhoneNumber(phoneFormatted)
    
    console.log('🔍 DEBUG MATCHING:')
    console.log('  phoneFormatted:', phoneFormatted)
    console.log('  target (digits only):', target)
    console.log('  total members:', members.length)
    
    // Log first few members for debugging
    members.slice(0, 3).forEach((m, i) => {
      const memberNormalized = normalizePhoneNumber(m?.formattedName || '')
      console.log(`  member ${i}:`, {
        formattedName: m?.formattedName,
        normalized: memberNormalized,
        matches: memberNormalized === target
      })
    })
    
    // Log ALL members to find the specific number
    console.log('🔍 ALL MEMBERS:')
    members.forEach((m, i) => {
      const memberNormalized = normalizePhoneNumber(m?.formattedName || '')
      if (memberNormalized.includes('54') || memberNormalized.includes('598')) {
        console.log(`  member ${i}:`, {
          formattedName: m?.formattedName,
          normalized: memberNormalized,
          matches: memberNormalized === target,
          pushname: m?.pushname
        })
      }
    })
    
    const match = members.find((m) => normalizePhoneNumber(m?.formattedName || '') === target)
    if (!match || !match.id || !match.id._serialized) {
      return NextResponse.json({
        error: '❌ No pudimos encontrar tu número en el grupo de WhatsApp.\n\n' +
               '📱 Verificá que:\n' +
               '• Estés en el grupo "Ofertas Laborales" de Programadores Argentina\n' +
               '• El número ingresado coincida EXACTAMENTE con el que tenés en WhatsApp\n\n' +
               '💬 ¿Necesitás ayuda? Escribinos a programadoresargentina@gmail.com'
      }, { status: 400 })
    }
    
    const newLid = String(match.id._serialized)

    // Guardar LID en el usuario
    await prisma.user.update({ where: { id: authUser.id }, data: { lid: newLid } as any })

    return NextResponse.json({
      ok: true,
      lid: newLid,
      message: '✅ WhatsApp enlazado correctamente'
    })
  } catch (error: any) {
    console.error('Error enlazando WhatsApp:', error)
    const status = error?.status === 401 ? 400 : 500
    const message = error?.status === 401
      ? 'No se pudo validar la sesión del sandbox. Verificá URL/TOKEN en configuración.'
      : (error?.message || 'Error interno del servidor')
    return NextResponse.json({ error: message }, { status })
  }
}

