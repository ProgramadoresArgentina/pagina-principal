import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { validateAdminApiKey } from '@/lib/admin'

// GET /api/users - Obtener todos los usuarios
export async function GET(request: NextRequest) {
  // Validar API key de administrador
  if (!validateAdminApiKey(request)) {
    return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 401 });
  }
  
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          avatar: true,
          bio: true,
          website: true,
          location: true,
          lid: true,
          createdAt: true,
          role: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.user.count(),
    ])

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/users - Crear un nuevo usuario
export async function POST(request: NextRequest) {
  // Validar API key de administrador
  if (!validateAdminApiKey(request)) {
    return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 401 });
  }
  
  try {
    const body = await request.json()
    const { email, name, username, avatar, bio, website, location, lid, password, roleId } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      )
    }

    if (!password) {
      return NextResponse.json(
        { error: 'Password es requerido' },
        { status: 400 }
      )
    }

    if (!roleId) {
      return NextResponse.json(
        { error: 'RoleId es requerido' },
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

    // Verificar que el role existe
    const role = await prisma.role.findUnique({
      where: { id: roleId },
    })

    if (!role) {
      return NextResponse.json(
        { error: 'El rol especificado no existe' },
        { status: 400 }
      )
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword, // Contraseña hasheada
        name,
        username,
        avatar,
        bio,
        website,
        location,
        lid,
        roleId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatar: true,
        bio: true,
        website: true,
        location: true,
        lid: true,
        createdAt: true,
        role: {
          select: {
            id: true,
            name: true,
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

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}