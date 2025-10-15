import { NextRequest, NextResponse } from 'next/server';
import { updateBookProgress, getBookProgress } from '@/lib/books';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Token de autorización requerido' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const { bookTitle, bookFilename, currentPage, totalPages } = await request.json();

    if (!bookTitle || !bookFilename || !currentPage) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: bookTitle, bookFilename, currentPage' },
        { status: 400 }
      );
    }

    // Actualizar progreso
    const progress = await updateBookProgress(
      decoded.userId,
      bookTitle,
      bookFilename,
      currentPage,
      totalPages
    );

    if (!progress) {
      return NextResponse.json(
        { error: 'Error al actualizar el progreso' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      progress: {
        id: progress.id,
        currentPage: progress.currentPage,
        totalPages: progress.totalPages,
        progress: progress.progress,
        isCompleted: progress.isCompleted,
        lastReadAt: progress.lastReadAt,
        timeSpent: progress.timeSpent,
      },
    });
  } catch (error) {
    console.error('Error updating book progress:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Token de autorización requerido' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookFilename = searchParams.get('bookFilename');

    if (!bookFilename) {
      return NextResponse.json(
        { error: 'bookFilename es requerido' },
        { status: 400 }
      );
    }

    // Obtener progreso
    const progress = await getBookProgress(decoded.userId, bookFilename);

    if (!progress) {
      return NextResponse.json({
        success: true,
        progress: null,
      });
    }

    return NextResponse.json({
      success: true,
      progress: {
        id: progress.id,
        currentPage: progress.currentPage,
        totalPages: progress.totalPages,
        progress: progress.progress,
        isCompleted: progress.isCompleted,
        lastReadAt: progress.lastReadAt,
        timeSpent: progress.timeSpent,
      },
    });
  } catch (error) {
    console.error('Error getting book progress:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}