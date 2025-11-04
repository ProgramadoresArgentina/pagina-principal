import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// Configurar la ruta como dinámica
export const dynamic = 'force-dynamic'

export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = await verifyToken(token)
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    // Obtener usuario autenticado con rol
    const authUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
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

    if (!authUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Verificar si es admin o tiene permiso users:update
    const isAdmin = authUser.role.name === 'Administrador'
    const hasUsersUpdate = authUser.role.permissions.some(
      (rp) => rp.permission.resource === 'users' && rp.permission.action === 'update'
    )

    if (!isAdmin && !hasUsersUpdate) {
      return NextResponse.json(
        { error: 'No tienes permisos para actualizar usuarios' },
        { status: 403 }
      )
    }

    const { userId, isSubscribed, roleName } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'userId es requerido' },
        { status: 400 }
      )
    }

    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
      // Si se está activando la suscripción y no tiene fecha, establecerla
      if (isSubscribed && !user.isSubscribed) {
        updateData.subscribedAt = new Date()
      }
      // Si se está desactivando la suscripción, limpiar la fecha
      if (!isSubscribed && user.isSubscribed) {
        updateData.subscribedAt = null
      }
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
