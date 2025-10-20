import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'node:stream';

export const runtime = 'nodejs';

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

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Decodificar la URL para manejar caracteres especiales
    const imagePath = decodeURIComponent(params.path.join('/'));
    
    console.log('🖼️ Serving cover:', imagePath);
    
    // Validar que sea una imagen
    const imageExtensions = ['.webp', '.png', '.jpg', '.jpeg'];
    const isImage = imageExtensions.some(ext => imagePath.toLowerCase().endsWith(ext));
    
    if (!isImage) {
      return NextResponse.json(
        { error: 'Archivo no es una imagen válida' },
        { status: 400 }
      );
    }

    const command = new GetObjectCommand({
      Bucket: BOOKS_BUCKET_NAME,
      Key: imagePath,
    });

    const s3Response = await s3Client.send(command);
    const nodeReadable = s3Response.Body as unknown as Readable;
    const webStream = Readable.toWeb(nodeReadable);

    // Determinar content type basado en la extensión
    let contentType = 'image/jpeg';
    if (imagePath.toLowerCase().endsWith('.webp')) {
      contentType = 'image/webp';
    } else if (imagePath.toLowerCase().endsWith('.png')) {
      contentType = 'image/png';
    }

    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Cache-Control', 'public, max-age=31536000'); // Cache por 1 año
    headers.set('Accept-Ranges', 'bytes');

    if (typeof s3Response.ContentLength === 'number') {
      headers.set('Content-Length', String(s3Response.ContentLength));
    }

    return new NextResponse(webStream as unknown as BodyInit, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error serving book cover:', error);
    return NextResponse.json(
      { error: 'Imagen no encontrada' },
      { status: 404 }
    );
  }
}
