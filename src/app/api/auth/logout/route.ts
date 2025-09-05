import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // En un sistema JWT stateless, el logout se maneja en el cliente
    // eliminando el token. Aquí solo confirmamos el logout.
    return NextResponse.json({
      message: 'Logout exitoso',
    })
  } catch (error) {
    console.error('Error en logout:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
