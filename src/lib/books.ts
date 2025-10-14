import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from './prisma';

export interface Book {
  title: string;
  filename: string;
  coverUrl?: string;
  pdfUrl: string;
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

    const books: Book[] = response.Contents
      .filter(obj => obj.Key && obj.Key.toLowerCase().endsWith('.pdf'))
      .map(obj => {
        const filename = obj.Key!;
        const title = filename.replace('.pdf', '').replace(/-/g, ' ');
        
        return {
          title: title.charAt(0).toUpperCase() + title.slice(1),
          filename,
          pdfUrl: `/api/books/${filename}`,
          size: obj.Size,
          lastModified: obj.LastModified,
        };
      })
      .sort((a, b) => a.title.localeCompare(b.title));

    return books;
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
    // Calcular el porcentaje de progreso
    const progress = totalPages ? (currentPage / totalPages) * 100 : 0;
    const isCompleted = totalPages ? currentPage >= totalPages : false;

    const bookProgress = await prisma.bookProgress.upsert({
      where: {
        userId_bookFilename: {
          userId,
          bookFilename,
        },
      },
      update: {
        currentPage,
        totalPages,
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
        totalPages,
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

    // Combinar libros con su progreso
    const booksWithProgress = books.map(book => {
      const progress = progressRecords.find(p => p.bookFilename === book.filename);
      return {
        ...book,
        progress: progress || null,
      };
    });

    return booksWithProgress;
  } catch (error) {
    console.error('Error getting books with progress:', error);
    return [];
  }
}
