import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getAuthenticatedUser } from '@/lib/auth'

// GET /api/forum/posts/[slug] - Obtener post individual por slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params

    const post = await prisma.forumPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              }
            },
            replies: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    username: true,
                    avatar: true,
                  }
                }
              },
              orderBy: { createdAt: 'asc' }
            }
          },
          where: { parentId: null }, // Solo comentarios principales
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      )
    }

    // Incrementar contador de vistas
    await prisma.forumPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } }
    })

    // Formatear comentarios con respuestas
    const formattedComments = post.comments.map(comment => ({
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
      replies: comment.replies.map(reply => ({
        id: reply.id,
        content: reply.content,
        createdAt: reply.createdAt,
        updatedAt: reply.updatedAt,
        author: {
          id: reply.author.id,
          name: reply.author.name,
          username: reply.author.username,
          avatar: reply.author.avatar,
        }
      }))
    }))

    return NextResponse.json({
      post: {
        id: post.id,
        title: post.title,
        content: post.content,
        slug: post.slug,
        isPinned: post.isPinned,
        isLocked: post.isLocked,
        viewCount: post.viewCount + 1, // +1 porque ya incrementamos
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: {
          id: post.author.id,
          name: post.author.name,
          username: post.author.username,
          avatar: post.author.avatar,
        },
        comments: formattedComments,
        commentCount: formattedComments.length,
      }
    })
  } catch (error) {
    console.error('Error al obtener post:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/forum/posts/[slug] - Actualizar post (solo autor o admin)
export async function PUT(
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
    const { title, content } = await request.json()

    // Buscar el post
    const existingPost = await prisma.forumPost.findUnique({
      where: { slug },
      include: { author: true }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      )
    }

    // Verificar permisos (autor o admin)
    const isAuthor = existingPost.authorId === authUser.id
    const isAdmin = authUser.role.name === 'Administrador'

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: 'No tienes permisos para editar este post' },
        { status: 403 }
      )
    }

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Título y contenido son requeridos' },
        { status: 400 }
      )
    }

    if (title.length < 3 || title.length > 200) {
      return NextResponse.json(
        { error: 'El título debe tener entre 3 y 200 caracteres' },
        { status: 400 }
      )
    }

    if (content.length < 10) {
      return NextResponse.json(
        { error: 'El contenido debe tener al menos 10 caracteres' },
        { status: 400 }
      )
    }

    // Actualizar post
    const updatedPost = await prisma.forumPost.update({
      where: { id: existingPost.id },
      data: {
        title,
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
      message: 'Post actualizado exitosamente',
      post: {
        id: updatedPost.id,
        title: updatedPost.title,
        content: updatedPost.content,
        slug: updatedPost.slug,
        isPinned: updatedPost.isPinned,
        isLocked: updatedPost.isLocked,
        viewCount: updatedPost.viewCount,
        createdAt: updatedPost.createdAt,
        updatedAt: updatedPost.updatedAt,
        author: {
          id: updatedPost.author.id,
          name: updatedPost.author.name,
          username: updatedPost.author.username,
          avatar: updatedPost.author.avatar,
        }
      }
    })
  } catch (error) {
    console.error('Error al actualizar post:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/forum/posts/[slug] - Eliminar post (solo autor o admin)
export async function DELETE(
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

    // Buscar el post
    const existingPost = await prisma.forumPost.findUnique({
      where: { slug },
      include: { author: true }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post no encontrado' },
        { status: 404 }
      )
    }

    // Verificar permisos (autor o admin)
    const isAuthor = existingPost.authorId === authUser.id
    const isAdmin = authUser.role.name === 'Administrador'

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: 'No tienes permisos para eliminar este post' },
        { status: 403 }
      )
    }

    // Eliminar post (los comentarios se eliminan automáticamente por CASCADE)
    await prisma.forumPost.delete({
      where: { id: existingPost.id }
    })

    return NextResponse.json({
      message: 'Post eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error al eliminar post:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
