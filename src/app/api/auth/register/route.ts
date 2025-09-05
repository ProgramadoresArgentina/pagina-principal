import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken, getAuthenticatedUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, username } = await request.json()

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

    // Obtener el rol de "Usuario" por defecto
    const defaultRole = await prisma.role.findUnique({
      where: { name: 'Usuario' },
    })

    if (!defaultRole) {
      return NextResponse.json(
        { error: 'Rol por defecto no encontrado' },
        { status: 500 }
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
        roleId: defaultRole.id,
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

    // Generar token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role.name,
    })

    // Obtener datos del usuario autenticado
    const authUser = await getAuthenticatedUser(token)

    return NextResponse.json({
      message: 'Usuario registrado exitosamente',
      token,
      user: authUser,
    }, { status: 201 })
  } catch (error) {
    console.error('Error en registro:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
