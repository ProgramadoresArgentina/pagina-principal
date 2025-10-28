import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getAuthenticatedUser } from '@/lib/auth'

// PUT /api/forum/comments/[id] - Actualizar comentario
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token no proporcionado' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const authUser = await getAuthenticatedUser(token)
    if (!authUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const { id } = params
    const { content } = await request.json()

    if (!content) {
      return NextResponse.json(
        { error: 'El contenido del comentario es requerido' },
        { status: 400 }
      )
    }

    if (content.length < 3) {
      return NextResponse.json(
        { error: 'El comentario debe tener al menos 3 caracteres' },
        { status: 400 }
      )
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'El comentario no puede exceder 2000 caracteres' },
        { status: 400 }
      )
    }

    // Buscar el comentario
    const existingComment = await prisma.forumComment.findUnique({
      where: { id },
      include: { author: true }
    })

    if (!existingComment) {
      return NextResponse.json(
        { error: 'Comentario no encontrado' },
        { status: 404 }
      )
    }

    // Verificar permisos (autor o admin)
    const isAuthor = existingComment.authorId === authUser.id
    const isAdmin = authUser.role.name === 'Administrador'

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: 'No tienes permisos para editar este comentario' },
        { status: 403 }
      )
    }

    // Actualizar comentario
    const updatedComment = await prisma.forumComment.update({
      where: { id },
      data: {
        content,
        updatedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Comentario actualizado exitosamente',
      comment: {
        id: updatedComment.id,
        content: updatedComment.content,
        createdAt: updatedComment.createdAt,
        updatedAt: updatedComment.updatedAt,
        author: {
          id: updatedComment.author.id,
          name: updatedComment.author.name,
          username: updatedComment.author.username,
          avatar: updatedComment.author.avatar,
        },
        parentId: updatedComment.parentId,
      }
    })
  } catch (error) {
    console.error('Error al actualizar comentario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/forum/comments/[id] - Eliminar comentario
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token no proporcionado' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const authUser = await getAuthenticatedUser(token)
    if (!authUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const { id } = params

    // Buscar el comentario
    const existingComment = await prisma.forumComment.findUnique({
      where: { id },
      include: { author: true }
    })

    if (!existingComment) {
      return NextResponse.json(
        { error: 'Comentario no encontrado' },
        { status: 404 }
      )
    }

    // Verificar permisos (autor o admin)
    const isAuthor = existingComment.authorId === authUser.id
    const isAdmin = authUser.role.name === 'Administrador'

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: 'No tienes permisos para eliminar este comentario' },
        { status: 403 }
      )
    }

    // Eliminar comentario (las respuestas se eliminan automáticamente por CASCADE)
    await prisma.forumComment.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Comentario eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error al eliminar comentario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
