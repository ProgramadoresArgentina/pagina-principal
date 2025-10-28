import { NextRequest, NextResponse } from 'next/server'
import { LISTMONK_CONFIG } from '@/lib/listmonk'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      )
    }

    // Verificar si el email está suscrito
    const response = await fetch(`${LISTMONK_CONFIG.SERVICE_URL}/api/subscribers`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${LISTMONK_CONFIG.API_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('Error fetching subscribers from Listmonk:', response.statusText)
      return NextResponse.json(
        { isSubscribed: false },
        { status: 200 }
      )
    }

    const data = await response.json()
    
    // Buscar el email en la lista de suscriptores
    const subscriber = data.data?.results?.find((sub: any) => 
      sub.email.toLowerCase() === email.toLowerCase()
    )

    const isSubscribed = subscriber && subscriber.status === 'enabled'

    return NextResponse.json({ isSubscribed })

  } catch (error) {
    console.error('Error checking subscription:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
