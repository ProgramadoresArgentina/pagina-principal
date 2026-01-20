import { NextResponse } from 'next/server';
import { getBooks } from '@/lib/books';
import { getPaginatedArticles } from '@/lib/articles';

export interface BibliotecaItem {
  id: string;
  type: 'book' | 'article';
  title: string;
  description?: string;
  category: string;
  imageUrl?: string;
  url: string;
  isSubscriberOnly: boolean;
  author?: string;
  authorImage?: string;
  publishedAt?: Date;
  size?: number;
}

export interface BibliotecaResponse {
  items: BibliotecaItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const typeFilter = searchParams.get('type') as 'book' | 'article' | 'all' | null;
    const categoryFilter = searchParams.get('category') || null;
    const searchTerm = searchParams.get('search') || null;

    // Obtener libros y artículos en paralelo
    const [books, articlesData] = await Promise.all([
      getBooks(),
      getPaginatedArticles(1, 1000) // Obtener todos los artículos para filtrar
    ]);

    // Convertir libros a BibliotecaItem
    const bookItems: BibliotecaItem[] = books.map((book) => ({
      id: `book-${book.filename}`,
      type: 'book' as const,
      title: book.title,
      description: '',
      category: book.category || 'General',
      imageUrl: book.coverUrl,
      url: book.viewerUrl || book.pdfUrl,
      isSubscriberOnly: true, // Todos los libros requieren suscripción
      size: book.size,
    }));

    // Convertir artículos a BibliotecaItem
    const articleItems: BibliotecaItem[] = articlesData.articles.map((article) => ({
      id: `article-${article.slug}`,
      type: 'article' as const,
      title: article.title,
      description: article.excerpt || article.description || '',
      category: article.category,
      imageUrl: article.image || undefined, // Imagen de portada del artículo
      url: `/articulos/${article.slug}`,
      isSubscriberOnly: article.isSubscriberOnly,
      author: article.authorUser?.name || article.author,
      authorImage: article.authorUser?.avatar || article.authorImage || undefined,
      publishedAt: article.publishedAt || article.createdAt,
    }));

    // Combinar todos los items
    let allItems = [...bookItems, ...articleItems];

    // Filtrar por tipo
    if (typeFilter && typeFilter !== 'all') {
      allItems = allItems.filter(item => item.type === typeFilter);
    }

    // Filtrar por categoría
    if (categoryFilter && categoryFilter !== 'Todas') {
      allItems = allItems.filter(item => item.category === categoryFilter);
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      const normalizedSearch = searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      allItems = allItems.filter(item => {
        const normalizedTitle = item.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return normalizedTitle.includes(normalizedSearch);
      });
    }

    // Ordenar por fecha de publicación (artículos) o por título (libros)
    allItems.sort((a, b) => {
      if (a.publishedAt && b.publishedAt) {
        return b.publishedAt.getTime() - a.publishedAt.getTime();
      }
      if (a.publishedAt && !b.publishedAt) return -1;
      if (!a.publishedAt && b.publishedAt) return 1;
      return a.title.localeCompare(b.title);
    });

    // Calcular paginación
    const total = allItems.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = allItems.slice(startIndex, endIndex);

    const response: BibliotecaResponse = {
      items: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching biblioteca:', error);
    return NextResponse.json(
      { error: 'Error al obtener la biblioteca' },
      { status: 500 }
    );
  }
}
