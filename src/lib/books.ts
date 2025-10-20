import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from './prisma';

export interface Book {
  title: string;
  filename: string;
  category?: string;
  coverUrl?: string;
  pdfUrl: string; // URL de la API para obtener el PDF
  viewerUrl?: string; // URL del visor de libros
  size?: number;
  lastModified?: Date;
  progress?: {
    id: string;
    currentPage: number;
    totalPages: number | null;
    progress: number;
    isCompleted: boolean;
    lastReadAt: Date;
    timeSpent: number;
  } | null;
}

// Configuración de MinIO (compatible con S3)
const s3Client = new S3Client({
  region: process.env.MINIO_REGION || 'us-east-1',
  endpoint: process.env.MINIO_ENDPOINT || 'http://localhost:9000',
  forcePathStyle: true, // Necesario para MinIO
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || '',
    secretAccessKey: process.env.MINIO_SECRET_KEY || '',
  },
});

const BOOKS_BUCKET_NAME = 'libros';

// Función para buscar imagen de portada en MinIO (ya no se usa con la nueva estructura)
async function findBookCover(category: string, bookTitle: string): Promise<string | null> {
  // Esta función ya no se usa con la nueva estructura de carpetas
  // Las portadas se detectan automáticamente en getBooks()
  return null;
}

// Función para obtener la lista de libros desde MinIO
export async function getBooks(): Promise<Book[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BOOKS_BUCKET_NAME,
    });
    
    const response = await s3Client.send(command);
    
    if (!response.Contents) {
      return [];
    }

    const books: Book[] = [];
    
    // Agrupar archivos por estructura de carpetas
    const bookFolders = new Map<string, { category: string; bookName: string; pdfFile?: any; coverFile?: any }>();
    
    for (const obj of response.Contents) {
      if (!obj.Key) continue;
      
      const pathParts = obj.Key.split('/');
      
      // Estructura esperada: categoria/libro-nombre/book.pdf o photo.ext
      if (pathParts.length !== 3) {
        console.log('📁 Skipping file (wrong structure):', obj.Key);
        continue;
      }
      
      const [category, bookName, fileName] = pathParts;
      
      // Crear clave única para el libro
      const bookKey = `${category}/${bookName}`;
      
      if (!bookFolders.has(bookKey)) {
        bookFolders.set(bookKey, { category, bookName });
      }
      
      const bookData = bookFolders.get(bookKey)!;
      
      // Identificar si es el PDF o la portada
      if (fileName === 'book.pdf') {
        bookData.pdfFile = obj;
      } else if (fileName.toLowerCase().match(/^photo\.(webp|png|jpg|jpeg)$/)) {
        bookData.coverFile = obj;
      }
    }
    
    // Procesar cada libro encontrado
    for (const [bookKey, bookData] of Array.from(bookFolders.entries())) {
      // Solo procesar si tiene el archivo PDF
      if (!bookData.pdfFile) {
        console.log('📚 Skipping book (no PDF):', bookKey);
        continue;
      }
      
      const { category, bookName, pdfFile, coverFile } = bookData;
      
      // Crear título legible desde el nombre de la carpeta
      const title = bookName.replace(/-/g, ' ').replace(/_/g, ' ');
      
      console.log('📚 Processing book:', {
        bookKey,
        category,
        bookName,
        title,
        hasPdf: !!pdfFile,
        hasCover: !!coverFile
      });
      
      // Construir URLs
      // Para el visor de libros: /club/libros/ver?path=categoria/libro/book.pdf
      // Para la API: /api/books/categoria/libro/book.pdf
      const fullPath = `${bookKey}/book.pdf`;
      const viewerUrl = `/club/libros/ver?path=${encodeURIComponent(fullPath)}`;
      const apiUrl = `/api/books/${bookKey}/book.pdf`;
      const coverUrl = coverFile ? `/api/books/cover/${bookKey}/${coverFile.Key.split('/').pop()}` : undefined;
      
      books.push({
        title: title.charAt(0).toUpperCase() + title.slice(1),
        filename: `${bookKey}/book.pdf`, // Para compatibilidad con el sistema existente
        category,
        coverUrl,
        pdfUrl: apiUrl, // URL para obtener el PDF
        viewerUrl, // URL del visor de libros
        size: pdfFile.Size,
        lastModified: pdfFile.LastModified,
      });
    }

    return books.sort((a, b) => {
      // Primero por categoría, luego por título
      if (a.category !== b.category) {
        return (a.category || '').localeCompare(b.category || '');
      }
      return a.title.localeCompare(b.title);
    });
  } catch (error) {
    console.error('Error fetching books from MinIO:', error);
    return [];
  }
}

// Función para obtener un libro específico
export async function getBook(filename: string): Promise<Book | null> {
  try {
    // Primero obtener todos los libros y buscar el específico
    const books = await getBooks();
    const book = books.find(b => b.filename === filename);
    
    if (!book) {
      return null;
    }

    return book;
  } catch (error) {
    console.error(`Error fetching book ${filename} from MinIO:`, error);
    return null;
  }
}

// Función para validar que el bucket de libros existe
export async function validateBooksBucket(): Promise<boolean> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BOOKS_BUCKET_NAME,
      MaxKeys: 1,
    });
    
    await s3Client.send(command);
    return true;
  } catch (error) {
    console.error('Books bucket validation failed:', error);
    return false;
  }
}

// Función para obtener el progreso de lectura de un usuario en un libro específico
export async function getBookProgress(userId: string, bookFilename: string) {
  try {
    const progress = await prisma.bookProgress.findUnique({
      where: {
        userId_bookFilename: {
          userId,
          bookFilename,
        },
      },
    });
    
    return progress;
  } catch (error) {
    console.error('Error getting book progress:', error);
    return null;
  }
}

// Función para actualizar el progreso de lectura de un usuario
export async function updateBookProgress(
  userId: string,
  bookTitle: string,
  bookFilename: string,
  currentPage: number,
  totalPages?: number,
  timeSpent?: number
) {
  try {
    // Obtener el registro existente para mantener totalPages si ya existe
    const existing = await prisma.bookProgress.findUnique({
      where: {
        userId_bookFilename: {
          userId,
          bookFilename,
        },
      },
    });

    // Usar totalPages existente si no se proporciona uno nuevo
    const finalTotalPages = totalPages || existing?.totalPages || null;
    
    // Calcular el porcentaje de progreso
    const progress = finalTotalPages ? (currentPage / finalTotalPages) * 100 : 0;
    const isCompleted = finalTotalPages ? currentPage >= finalTotalPages : false;

    console.log('📊 Updating progress:', {
      currentPage,
      totalPages: finalTotalPages,
      progress: progress.toFixed(2) + '%',
      isCompleted
    });

    const bookProgress = await prisma.bookProgress.upsert({
      where: {
        userId_bookFilename: {
          userId,
          bookFilename,
        },
      },
      update: {
        currentPage,
        totalPages: finalTotalPages,
        progress,
        isCompleted,
        lastReadAt: new Date(),
        timeSpent: timeSpent ? {
          increment: timeSpent,
        } : undefined,
      },
      create: {
        userId,
        bookTitle,
        bookFilename,
        currentPage,
        totalPages: finalTotalPages,
        progress,
        isCompleted,
        timeSpent: timeSpent || 0,
      },
    });

    return bookProgress;
  } catch (error) {
    console.error('Error updating book progress:', error);
    return null;
  }
}

// Función para obtener todos los libros con progreso de un usuario
export async function getBooksWithProgress(userId: string) {
  try {
    const books = await getBooks();
    const progressRecords = await prisma.bookProgress.findMany({
      where: { userId },
    });

    console.log('📖 getBooksWithProgress - userId:', userId);
    console.log('📚 Total books:', books.length);
    console.log('📊 Progress records found:', progressRecords.length);
    if (progressRecords.length > 0) {
      console.log('📄 Sample progress:', progressRecords[0]);
    }

    // Combinar libros con su progreso
    const booksWithProgress = books.map(book => {
      const progress = progressRecords.find(p => p.bookFilename === book.filename);
      return {
        ...book,
        progress: progress || null,
      };
    });

    const withProgress = booksWithProgress.filter(b => b.progress !== null);
    console.log('✅ Books with progress attached:', withProgress.length);

    return booksWithProgress;
  } catch (error) {
    console.error('Error getting books with progress:', error);
    return [];
  }
}
