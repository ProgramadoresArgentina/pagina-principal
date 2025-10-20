import { NextRequest, NextResponse } from 'next/server';
import { getPublicPaginatedPosts } from '@/lib/blog';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    
    if (page < 1) {
      return NextResponse.json(
        { error: 'Número de página inválido' },
        { status: 400 }
      );
    }

    const paginatedPosts = await getPublicPaginatedPosts(page);
    
    return NextResponse.json(paginatedPosts);
  } catch (error) {
    console.error('Error en API de posts paginados:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
