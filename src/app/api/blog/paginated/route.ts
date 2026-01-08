import { NextRequest, NextResponse } from 'next/server';
import { getPaginatedArticles } from '@/lib/articles';

/**
 * GET /api/blog/paginated
 * Obtiene artículos paginados (compatible con InfiniteScrollBlog)
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');

    const data = await getPaginatedArticles(page);

    // Convertir a formato compatible con BlogPost
    const posts = data.articles.map(article => ({
      slug: article.slug,
      title: article.title,
      description: article.description || '',
      date: article.publishedAt?.toISOString() || article.createdAt.toISOString(),
      author: article.authorUser?.name || article.author,
      authorImage: article.authorUser?.avatar || article.authorImage || '/assets/images/perfiles/club-programadores-argentina.png',
      category: article.category,
      image: article.image || null, // No usar imagen por defecto si no existe
      isPublic: article.isPublic,
      isSubscriberOnly: article.isSubscriberOnly || false,
      excerpt: article.excerpt || article.description || '',
      content: JSON.stringify(article.content), // Convertir a string para compatibilidad
    }));

    return NextResponse.json({
      posts,
      totalPosts: data.pagination.total,
      currentPage: data.pagination.page,
      totalPages: data.pagination.totalPages,
      hasNextPage: data.pagination.hasNextPage,
      hasPreviousPage: data.pagination.hasPreviousPage,
    });
  } catch (error) {
    console.error('Error al obtener artículos paginados:', error);
    return NextResponse.json(
      {
        posts: [],
        totalPosts: 0,
        currentPage: 1,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
      { status: 500 }
    );
  }
}
