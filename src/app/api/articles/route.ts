import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, getAuthenticatedUser, isAdmin } from '@/lib/auth';

/**
 * GET /api/articles
 * Obtiene todos los artículos (públicos si no está autenticado, todos si es admin)
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const isPublicOnly = searchParams.get('public') !== 'false';

    const skip = (page - 1) * limit;

    // Verificar si el usuario es admin
    let isUserAdmin = false;
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const user = await getAuthenticatedUser(token);
      if (user) {
        isUserAdmin = isAdmin(user);
      }
    }

    // Construir where clause
    const where: any = {};
    if (isPublicOnly && !isUserAdmin) {
      where.isPublic = true;
      where.publishedAt = { not: null };
    }
    if (category) {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          authorUser: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: skip + limit < total,
        hasPreviousPage: page > 1,
      },
    });
    } catch (error) {
      return NextResponse.json(
      { error: 'Error al obtener artículos' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/articles
 * Crea un nuevo artículo (solo admins)
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token no proporcionado' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = await getAuthenticatedUser(token);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    if (!isAdmin(user)) {
      return NextResponse.json(
        { error: 'No tienes permisos para crear artículos' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, slug, description, content, excerpt, image, category, author, authorImage, isPublic, isSubscriberOnly, publishedAt } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Título, slug y contenido son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el slug ya existe
    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    });

    if (existingArticle) {
      return NextResponse.json(
        { error: 'Ya existe un artículo con ese slug' },
        { status: 400 }
      );
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        description,
        content,
        excerpt,
        image,
        category: category || 'General',
        author: author || user.name || 'Programadores Argentina',
        authorImage: authorImage || '/assets/images/perfiles/club-programadores-argentina.png',
        isPublic: isPublic !== false,
        isSubscriberOnly: isSubscriberOnly === true,
        publishedAt: publishedAt ? new Date(publishedAt) : (isPublic !== false ? new Date() : null),
        authorId: user.id,
      },
      include: {
        authorUser: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear artículo' },
      { status: 500 }
    );
  }
}
