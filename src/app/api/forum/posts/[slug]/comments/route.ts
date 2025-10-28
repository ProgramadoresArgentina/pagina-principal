import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getAuthenticatedUser } from '@/lib/auth'

// POST /api/forum/posts/[slug]/comments - Crear comentario en un post
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
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

    const { slug } = params
    const { content, parentId } = await request.json()

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

    // Buscar el post
    const post = await prisma.forumPost.findUnique({
      where: { slug }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      )
    }

    // Verificar si el post está bloqueado
    if (post.isLocked) {
      return NextResponse.json(
        { error: 'Este post está bloqueado para comentarios' },
        { status: 403 }
      )
    }

    // Si es una respuesta a un comentario, verificar que el comentario padre existe
    if (parentId) {
      const parentComment = await prisma.forumComment.findUnique({
        where: { id: parentId }
      })

      if (!parentComment || parentComment.postId !== post.id) {
        return NextResponse.json(
          { error: 'Comentario padre no encontrado' },
          { status: 404 }
        )
      }
    }

    // Crear comentario
    const comment = await prisma.forumComment.create({
      data: {
        content,
        authorId: authUser.id,
        postId: post.id,
        parentId: parentId || null,
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
      message: 'Comentario creado exitosamente',
      comment: {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        author: {
          id: comment.author.id,
          name: comment.author.name,
          username: comment.author.username,
          avatar: comment.author.avatar,
        },
        parentId: comment.parentId,
        replies: []
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error al crear comentario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
