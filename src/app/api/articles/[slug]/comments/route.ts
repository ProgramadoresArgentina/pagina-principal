import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/articles/[slug]/comments - Obtener comentarios del artículo
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    const article = await prisma.article.findUnique({
      where: { slug },
      select: { id: true }
    })

    if (!article) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      )
    }

    const comments = await prisma.articleComment.findMany({
      where: { articleId: article.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      comments: comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        user: {
          id: comment.user.id,
          name: comment.user.name,
          username: comment.user.username,
          avatar: comment.user.avatar
        }
      }))
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener comentarios' },
      { status: 500 }
    )
  }
}

// POST /api/articles/[slug]/comments - Crear comentario
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const user = await getAuthenticatedUser(token)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      )
    }

    const { slug } = await params
    const { content } = await request.json()

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'El contenido del comentario es requerido' },
        { status: 400 }
      )
    }

    if (content.trim().length > 2000) {
      return NextResponse.json(
        { error: 'El comentario no puede exceder 2000 caracteres' },
        { status: 400 }
      )
    }
    
    const article = await prisma.article.findUnique({
      where: { slug },
      select: { id: true }
    })

    if (!article) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      )
    }

    const comment = await prisma.articleComment.create({
      data: {
        articleId: article.id,
        userId: user.id,
        content: content.trim()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json({
      comment: {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        user: {
          id: comment.user.id,
          name: comment.user.name,
          username: comment.user.username,
          avatar: comment.user.avatar
        }
      }
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear comentario' },
      { status: 500 }
    )
  }
}
