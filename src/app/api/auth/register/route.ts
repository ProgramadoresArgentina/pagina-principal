import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken, getAuthenticatedUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, username } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, contraseña y nombre son requeridos' },
        { status: 400 }
      )
    }

    // Validar longitud del nombre
    if (name.length < 2 || name.length > 50) {
      return NextResponse.json(
        { error: 'El nombre debe tener entre 2 y 50 caracteres' },
        { status: 400 }
      )
    }

    // Validación de contraseña segura
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      )
    }

    // Verificar que la contraseña tenga al menos una mayúscula, una minúscula y un número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        { error: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número' },
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
        isSubscribed: false, // Los nuevos usuarios no están suscritos por defecto
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

    // Asignar pin de bienvenida "Iniciación" automáticamente
    try {
      const initiationPin = await prisma.pin.findUnique({
        where: { name: 'Iniciación' },
      })

      if (initiationPin) {
        await prisma.userPin.create({
          data: {
            userId: user.id,
            pinId: initiationPin.id,
            reason: 'Bienvenido a la comunidad de Programadores Argentina',
          },
        })
      }
    } catch (pinError) {
      // Si hay error al asignar el pin, no fallar el registro
      console.error('Error al asignar pin de bienvenida:', pinError)
    }

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
