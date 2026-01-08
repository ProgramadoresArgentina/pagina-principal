import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

// Configurar la ruta como dinámica
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
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

    const { 
      email, 
      password, 
      name, 
      username, 
      bio, 
      avatar, 
      website, 
      location, 
      isSubscribed = false,
      roleName = 'Usuario'
    } = await request.json()

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

    // Obtener el rol especificado
    const role = await prisma.role.findUnique({
      where: { name: roleName },
    })

    if (!role) {
      return NextResponse.json(
        { error: `Rol '${roleName}' no encontrado` },
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
        bio,
        avatar,
        website,
        location,
        isSubscribed,
        roleId: role.id,
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

    // Asignar pin de iniciación automáticamente
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
      // Si hay error al asignar el pin, no fallar la creación del usuario
      console.error('Error al asignar pin de bienvenida:', pinError)
    }

    // Retornar datos del usuario sin la contraseña
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Usuario creado exitosamente',
      user: userWithoutPassword,
    }, { status: 201 })

  } catch (error) {
    console.error('Error creando usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
