import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken, getAuthenticatedUser, isAdmin } from '@/lib/auth';

/**
 * GET /api/articles/[slug]
 * Obtiene un artículo por slug
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

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

    const where: any = { slug };
    if (!isUserAdmin) {
      where.isPublic = true;
      where.publishedAt = { not: null };
    }

    const article = await prisma.article.findFirst({
      where,
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

    if (!article) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ article });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener artículo' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/articles/[slug]
 * Actualiza un artículo (solo admins)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
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
        { error: 'No tienes permisos para editar artículos' },
        { status: 403 }
      );
    }

    const { slug } = await params;
    const body = await req.json();
    const { title, newSlug, description, content, excerpt, image, category, author, authorImage, isPublic, isSubscriberOnly, publishedAt } = body;

    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    });

    if (!existingArticle) {
      return NextResponse.json(
        { error: 'Artículo no encontrado' },
        { status: 404 }
      );
    }

    // Si se cambió el slug, verificar que no exista otro artículo con ese slug
    if (newSlug && newSlug !== slug) {
      const slugExists = await prisma.article.findUnique({
        where: { slug: newSlug },
      });

      if (slugExists) {
        return NextResponse.json(
          { error: 'Ya existe un artículo con ese slug' },
          { status: 400 }
        );
      }
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (newSlug !== undefined) updateData.slug = newSlug;
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (image !== undefined) updateData.image = image;
    if (category !== undefined) updateData.category = category;
    if (author !== undefined) updateData.author = author;
    if (authorImage !== undefined) updateData.authorImage = authorImage;
    if (isPublic !== undefined) {
      updateData.isPublic = isPublic;
      // Si se publica por primera vez, establecer publishedAt
      if (isPublic && !existingArticle.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }
    if (isSubscriberOnly !== undefined) updateData.isSubscriberOnly = isSubscriberOnly;
    if (publishedAt !== undefined) updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;

    const article = await prisma.article.update({
      where: { slug },
      data: updateData,
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

    return NextResponse.json({ article });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al actualizar artículo' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/articles/[slug]
 * Elimina un artículo (solo admins)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
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
        { error: 'No tienes permisos para eliminar artículos' },
        { status: 403 }
      );
    }

    const { slug } = await params;

    await prisma.article.delete({
      where: { slug },
    });

    return NextResponse.json({ message: 'Artículo eliminado correctamente' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al eliminar artículo' },
      { status: 500 }
    );
  }
}
