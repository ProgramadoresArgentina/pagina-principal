import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token requerido' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    
    // Obtener referidos del usuario
    const referidos = await prisma.referido.findMany({
      where: {
        referidorId: decoded.userId
      },
      include: {
        referido: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            isSubscribed: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ referidos })

  } catch (error) {
    console.error('Error obteniendo referidos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { referidorId, referidoId } = await request.json()

    if (!referidorId || !referidoId) {
      return NextResponse.json(
        { error: 'referidorId y referidoId son requeridos' },
        { status: 400 }
      )
    }

    // Verificar que no sea el mismo usuario
    if (referidorId === referidoId) {
      return NextResponse.json(
        { error: 'No puedes referirte a ti mismo' },
        { status: 400 }
      )
    }

    // Crear el referido
    const referido = await prisma.referido.create({
      data: {
        referidorId,
        referidoId
      },
      include: {
        referidor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        referido: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Asignar pin de referido al usuario que fue referido
    try {
      await prisma.userPin.create({
        data: {
          userId: referidoId,
          pinId: 'cmh15u83w0000i8bkmtxvtw53', // ID del pin de referido
          grantedBy: referidorId,
          reason: 'Referido por otro miembro del Club'
        }
      })
    } catch (pinError) {
      console.error('Error asignando pin de referido:', pinError)
      // No fallar la operación si no se puede asignar el pin
    }

    return NextResponse.json({ 
      message: 'Referido creado exitosamente',
      referido 
    })

  } catch (error) {
    console.error('Error creando referido:', error)
    
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
