import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, isAdmin } from '@/lib/auth';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.MINIO_REGION || 'us-east-1',
  endpoint: process.env.MINIO_ENDPOINT || 'http://localhost:9000',
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || '',
    secretAccessKey: process.env.MINIO_SECRET_KEY || '',
  },
});

const ARTICLES_BUCKET = process.env.MINIO_ARTICLES_BUCKET || 'articulos';

/**
 * POST /api/articles/upload
 * Sube una imagen para un artículo (solo admins)
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
        { error: 'No tienes permisos para subir imágenes' },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Solo se permiten imágenes (JPEG, PNG, WebP, GIF)' },
        { status: 400 }
      );
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 5MB' },
        { status: 400 }
      );
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const fileName = `articles/${timestamp}-${randomString}.${extension}`;

    // Convertir File a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Subir a MinIO
    const command = new PutObjectCommand({
      Bucket: ARTICLES_BUCKET,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    // Construir URL de la imagen
    const minioEndpoint = process.env.MINIO_ENDPOINT || 'http://localhost:9000';
    const imageUrl = `${minioEndpoint}/${ARTICLES_BUCKET}/${fileName}`;

    return NextResponse.json({
      url: imageUrl,
      fileName,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al subir imagen' },
      { status: 500 }
    );
  }
}
