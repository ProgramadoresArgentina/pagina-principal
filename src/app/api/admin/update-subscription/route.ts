import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Configurar la ruta como dinámica
export const dynamic = 'force-dynamic'

export async function PATCH(request: NextRequest) {
  try {
    // Verificar la clave de administrador
    const adminKey = process.env.ADMIN_API_KEY
    if (!adminKey) {
      return NextResponse.json(
        { error: 'ADMIN_API_KEY no configurada' },
        { status: 500 }
      )
    }

    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      )
    }

    const providedKey = authHeader.substring(7)
    if (providedKey !== adminKey) {
      return NextResponse.json(
        { error: 'Clave de administrador inválida' },
        { status: 401 }
      )
    }

    const { email, isSubscribed, roleName } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      )
    }

    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Preparar datos de actualización
    const updateData: any = {}
    
    if (typeof isSubscribed === 'boolean') {
      updateData.isSubscribed = isSubscribed
    }

    if (roleName) {
      const role = await prisma.role.findUnique({
        where: { name: roleName },
      })

      if (!role) {
        return NextResponse.json(
          { error: `Rol '${roleName}' no encontrado` },
          { status: 400 }
        )
      }

      updateData.roleId = role.id
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    })

    // Retornar datos del usuario sin la contraseña
    const { password: _, ...userWithoutPassword } = updatedUser

    return NextResponse.json({
      message: 'Usuario actualizado exitosamente',
      user: userWithoutPassword,
    })

  } catch (error) {
    console.error('Error actualizando usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
