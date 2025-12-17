import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateAdminApiKey } from '@/lib/admin'

// GET /api/users/[id] - Obtener un usuario por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Validar API key de administrador
  if (!validateAdminApiKey(request)) {
    return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 401 });
  }
  
  try {
    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
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

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/users/[id] - Actualizar un usuario
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Validar API key de administrador
  if (!validateAdminApiKey(request)) {
    return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 401 });
  }
  
  try {
    const { id } = await params
    const body = await request.json()
    const { email, name, username, avatar, bio, website, location, lid, roleId } = body

    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Verificar si el email ya existe en otro usuario
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      })

      if (emailExists) {
        return NextResponse.json(
          { error: 'El email ya está registrado' },
          { status: 409 }
        )
      }
    }

    // Verificar si el username ya existe en otro usuario
    if (username && username !== existingUser.username) {
      const usernameExists = await prisma.user.findUnique({
        where: { username },
      })

      if (usernameExists) {
        return NextResponse.json(
          { error: 'El nombre de usuario ya está en uso' },
          { status: 409 }
        )
      }
    }

    // Verificar que el role existe (si se proporciona)
    if (roleId) {
      const role = await prisma.role.findUnique({
        where: { id: roleId },
      })

      if (!role) {
        return NextResponse.json(
          { error: 'El rol especificado no existe' },
          { status: 400 }
        )
      }
    }

    const updateData: any = {}
    if (email !== undefined) updateData.email = email
    if (name !== undefined) updateData.name = name
    if (username !== undefined) updateData.username = username
    if (avatar !== undefined) updateData.avatar = avatar
    if (bio !== undefined) updateData.bio = bio
    if (website !== undefined) updateData.website = website
    if (location !== undefined) updateData.location = location
    if (lid !== undefined) updateData.lid = lid
    if (roleId !== undefined) updateData.roleId = roleId

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/users/[id] - Eliminar un usuario
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Validar API key de administrador
  if (!validateAdminApiKey(request)) {
    return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 401 });
  }
  
  try {
    const { id } = await params

    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Eliminar el usuario
    await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Usuario eliminado correctamente' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
