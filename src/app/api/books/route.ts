import { NextRequest, NextResponse } from 'next/server';
import { getBooks, validateBooksBucket, getBooksWithProgress } from '@/lib/books';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Validar que el bucket existe
    const bucketExists = await validateBooksBucket();
    
    if (!bucketExists) {
      return NextResponse.json(
        { error: 'El bucket de libros no está disponible' },
        { status: 503 }
      );
    }

    // Verificar si el usuario está autenticado para incluir progreso
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    let books;
    
    console.log('📖 API /books - Token received:', token ? 'YES' : 'NO');
    
    if (token) {
      const decoded = verifyToken(token);
      console.log('🔐 Token decoded:', decoded ? `userId: ${decoded.userId}` : 'INVALID');
      
      if (decoded) {
        // Obtener libros con progreso del usuario
        books = await getBooksWithProgress(decoded.userId);
        console.log('📚 Books fetched with progress for user:', decoded.userId);
        console.log('📊 Books with progress:', books.filter(b => b.progress).length);
      } else {
        // Token inválido, obtener solo libros sin progreso
        books = await getBooks();
        console.log('⚠️ Invalid token - fetching books without progress');
      }
    } else {
      // Sin token, obtener solo libros sin progreso
      books = await getBooks();
      console.log('❌ No token - fetching books without progress');
    }
    
    return NextResponse.json({ books });
  } catch (error) {
    console.error('Error in books API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
