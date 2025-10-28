import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getAuthenticatedUser } from '@/lib/auth'

// GET /api/forum/posts - Obtener lista de posts del foro (acceso público)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const sort = searchParams.get('sort') || 'recent'
    const search = searchParams.get('search') || ''
    const skip = (page - 1) * limit

    // Determinar ordenamiento
    const orderBy = sort === 'top' 
      ? [
          { isPinned: 'desc' as const }, // Posts fijados primero
          { viewCount: 'desc' as const }, // Luego por vistas (como proxy de popularidad)
          { createdAt: 'desc' as const } // Finalmente por fecha
        ]
      : [
          { isPinned: 'desc' as const }, // Posts fijados primero
          { createdAt: 'desc' as const } // Luego por fecha
        ]

    // Construir filtros de búsqueda
    const searchFilter = search ? {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { content: { contains: search, mode: 'insensitive' as const } },
        { author: { name: { contains: search, mode: 'insensitive' as const } } },
        { author: { username: { contains: search, mode: 'insensitive' as const } } }
      ]
    } : {}

    // Obtener posts con paginación y búsqueda (acceso público)
    const [posts, totalCount] = await Promise.all([
      prisma.forumPost.findMany({
        where: searchFilter,
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
            select: {
              id: true,
            }
          },
          applause: {
            select: {
              count: true
            }
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.forumPost.count({ where: searchFilter })
    ])

    // Formatear respuesta
    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      slug: post.slug,
      isPinned: post.isPinned,
      isLocked: post.isLocked,
      viewCount: post.viewCount,
      applauseCount: post.applause.reduce((sum, applause) => sum + applause.count, 0),
      multimedia: post.multimedia,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: {
        id: post.author.id,
        name: post.author.name,
        username: post.author.username,
        avatar: post.author.avatar,
      },
      commentCount: post.comments.length,
    }))

    return NextResponse.json({
      posts: formattedPosts,
      totalPages: Math.ceil(totalCount / limit),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page * limit < totalCount,
        hasPrev: page > 1,
      }
    })
  } catch (error) {
    console.error('Error al obtener posts del foro:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/forum/posts - Crear nuevo post (solo usuarios autenticados)
export async function POST(request: NextRequest) {
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

    const { title, content, multimedia } = await request.json()

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

    // Validar multimedia si se proporciona
    if (multimedia && Array.isArray(multimedia) && multimedia.length > 3) {
      return NextResponse.json(
        { error: 'Máximo 3 archivos multimedia permitidos' },
        { status: 400 }
      )
    }

    // Generar slug único
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50)

    let slug = baseSlug
    let counter = 1
    while (await prisma.forumPost.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Crear post
    const post = await prisma.forumPost.create({
      data: {
        title,
        content,
        slug,
        multimedia: multimedia || null,
        authorId: authUser.id,
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
      message: 'Post creado exitosamente',
      post: {
        id: post.id,
        title: post.title,
        content: post.content,
        slug: post.slug,
        isPinned: post.isPinned,
        isLocked: post.isLocked,
        viewCount: post.viewCount,
        multimedia: post.multimedia,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        author: {
          id: post.author.id,
          name: post.author.name,
          username: post.author.username,
          avatar: post.author.avatar,
        },
        commentCount: 0,
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error al crear post:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
