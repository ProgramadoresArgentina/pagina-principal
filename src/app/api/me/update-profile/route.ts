import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const authUser = await getAuthenticatedUser(token)
    if (!authUser) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'El nombre es requerido' },
        { status: 400 }
      )
    }

    const trimmedName = name.trim()

    // Actualizar el nombre del usuario
    const updatedUser = await prisma.user.update({
      where: { id: authUser.id },
      data: { name: trimmedName },
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
        isSubscribed: true,
      },
    })

    // Actualizar también el nombre en todos los artículos del usuario
    await prisma.article.updateMany({
      where: { authorId: authUser.id },
      data: { 
        author: trimmedName,
        authorImage: updatedUser.avatar || null,
      },
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
