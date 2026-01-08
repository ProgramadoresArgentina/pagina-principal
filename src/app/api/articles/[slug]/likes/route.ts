import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/articles/[slug]/likes - Obtener likes del artículo
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

    const likes = await prisma.articleLike.count({
      where: { articleId: article.id }
    })

    // Verificar si el usuario actual dio like (si está autenticado)
    const authHeader = request.headers.get('authorization')
    let userLiked = false
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const user = await getAuthenticatedUser(token)
      
      if (user) {
        const userLike = await prisma.articleLike.findUnique({
          where: {
            articleId_userId: {
              articleId: article.id,
              userId: user.id
            }
          }
        })
        userLiked = !!userLike
      }
    }

    return NextResponse.json({
      likes,
      userLiked
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener likes' },
      { status: 500 }
    )
  }
}

// POST /api/articles/[slug]/likes - Dar like al artículo
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

    // Verificar si ya dio like
    const existingLike = await prisma.articleLike.findUnique({
      where: {
        articleId_userId: {
          articleId: article.id,
          userId: user.id
        }
      }
    })

    if (existingLike) {
      // Quitar like
      await prisma.articleLike.delete({
        where: { id: existingLike.id }
      })

      const likes = await prisma.articleLike.count({
        where: { articleId: article.id }
      })

      return NextResponse.json({
        likes,
        userLiked: false
      })
    } else {
      // Dar like
      await prisma.articleLike.create({
        data: {
          articleId: article.id,
          userId: user.id
        }
      })

      const likes = await prisma.articleLike.count({
        where: { articleId: article.id }
      })

      return NextResponse.json({
        likes,
        userLiked: true
      })
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al dar like' },
      { status: 500 }
    )
  }
}
