import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId, referidorId } = await request.json()

    if (!userId || !referidorId) {
      return NextResponse.json(
        { error: 'userId y referidorId son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que el usuario existe y está suscrito
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, isSubscribed: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    if (!user.isSubscribed) {
      return NextResponse.json(
        { error: 'El usuario no está suscrito' },
        { status: 400 }
      )
    }

    // Verificar que el referidor existe
    const referidor = await prisma.user.findUnique({
      where: { id: referidorId },
      select: { id: true }
    })

    if (!referidor) {
      return NextResponse.json(
        { error: 'Referidor no encontrado' },
        { status: 404 }
      )
    }

    // Crear el referido si no existe
    const existingReferido = await prisma.referido.findUnique({
      where: {
        referidorId_referidoId: {
          referidorId,
          referidoId: userId
        }
      }
    })

    if (existingReferido) {
      return NextResponse.json(
        { message: 'Referido ya existe' },
        { status: 200 }
      )
    }

    // Crear el referido
    const referido = await prisma.referido.create({
      data: {
        referidorId,
        referidoId: userId
      }
    })

    // Asignar pin de referido al usuario que fue referido
    try {
      await prisma.userPin.create({
        data: {
          userId: userId,
          pinId: 'cmh15u83w0000i8bkmtxvtw53', // ID del pin de referido
          grantedBy: referidorId,
          reason: 'Referido por otro miembro del Club'
        }
      })
    } catch (pinError) {
      console.error('Error asignando pin de referido:', pinError)
      // No fallar la operación si no se puede asignar el pin
    }

    // Asignar pin de referidor al usuario que hizo la referencia
    try {
      await prisma.userPin.create({
        data: {
          userId: referidorId,
          pinId: 'cmh15u83w0000i8bkmtxvtw53', // Mismo pin para ambos
          grantedBy: userId,
          reason: 'Referiste exitosamente a otro miembro'
        }
      })
    } catch (pinError) {
      console.error('Error asignando pin de referidor:', pinError)
      // No fallar la operación si no se puede asignar el pin
    }

    return NextResponse.json({ 
      message: 'Referido procesado exitosamente',
      referido 
    })

  } catch (error) {
    console.error('Error procesando referido:', error)
    
    // Si es un error de duplicado, devolver mensaje específico
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Este usuario ya fue referido anteriormente' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
