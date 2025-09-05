import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { requireAdmin } from '@/lib/middleware'

// POST /api/admin/register-user - Registrar un nuevo usuario (solo admin)
export const POST = requireAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { email, password, name, username, roleName, isSubscribed } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 409 }
      )
    }

    // Verificar si el username ya existe (si se proporciona)
    if (username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username },
      })

      if (existingUsername) {
        return NextResponse.json(
          { error: 'El nombre de usuario ya está en uso' },
          { status: 409 }
        )
      }
    }

    // Obtener el rol
    const role = await prisma.role.findUnique({
      where: { name: roleName || 'Usuario' },
    })

    if (!role) {
      return NextResponse.json(
        { error: 'Rol no encontrado' },
        { status: 400 }
      )
    }

    // Hash de la contraseña
    const hashedPassword = await hashPassword(password)

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        username,
        roleId: role.id,
        isSubscribed: isSubscribed || false,
      },
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

    return NextResponse.json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        role: user.role.name,
        isSubscribed: user.isSubscribed,
        createdAt: user.createdAt,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Error registrando usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})
