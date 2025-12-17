import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getAuthenticatedUser } from '@/lib/auth'

// POST /api/forum/posts/[slug]/applause - Dar aplauso a un post
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
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

    // Verificar si el usuario ya aplaudió este post
    const existingApplause = await prisma.forumApplause.findUnique({
      where: {
        postId_userId: {
          postId: post.id,
          userId: authUser.id
        }
      }
    })

    if (existingApplause) {
      // Si ya aplaudió, incrementar el contador (máximo 10)
      if (existingApplause.count >= 10) {
        return NextResponse.json(
          { error: 'Ya has dado el máximo de aplausos (10) para este post' },
          { status: 400 }
        )
      }

      // Incrementar aplausos
      const updatedApplause = await prisma.forumApplause.update({
        where: {
          postId_userId: {
            postId: post.id,
            userId: authUser.id
          }
        },
        data: {
          count: { increment: 1 }
        }
      })

      return NextResponse.json({
        message: 'Aplauso agregado exitosamente',
        applauseCount: updatedApplause.count,
        totalApplauseCount: await getTotalApplauseCount(post.id)
      })
    } else {
      // Crear nuevo aplauso
      const newApplause = await prisma.forumApplause.create({
        data: {
          postId: post.id,
          userId: authUser.id,
          count: 1
        }
      })

      return NextResponse.json({
        message: 'Aplauso agregado exitosamente',
        applauseCount: newApplause.count,
        totalApplauseCount: await getTotalApplauseCount(post.id)
      })
    }
  } catch (error) {
    console.error('Error al dar aplauso:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET /api/forum/posts/[slug]/applause - Obtener información de aplausos
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

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

    // Obtener información de aplausos
    const applauseInfo = await prisma.forumApplause.findMany({
      where: { postId: post.id },
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

    // Calcular total de aplausos
    const totalApplauseCount = applauseInfo.reduce((sum, applause) => sum + applause.count, 0)

    // Verificar si el usuario actual aplaudió (si está autenticado)
    let userApplauseCount = 0
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const decoded = verifyToken(token)
      if (decoded && decoded.userId) {
        const authUser = await getAuthenticatedUser(token)
        if (authUser) {
          const userApplause = applauseInfo.find(applause => applause.userId === authUser.id)
          if (userApplause) {
            userApplauseCount = userApplause.count
          }
        }
      }
    }

    return NextResponse.json({
      totalApplauseCount,
      userApplauseCount,
      applauseDetails: applauseInfo.map(applause => ({
        id: applause.id,
        count: applause.count,
        user: applause.user,
        createdAt: applause.createdAt
      }))
    })
  } catch (error) {
    console.error('Error al obtener aplausos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Función auxiliar para calcular el total de aplausos
async function getTotalApplauseCount(postId: string): Promise<number> {
  const applauseRecords = await prisma.forumApplause.findMany({
    where: { postId },
    select: { count: true }
  })
  
  return applauseRecords.reduce((sum, record) => sum + record.count, 0)
}
