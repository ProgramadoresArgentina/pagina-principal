import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'node:stream';

export const runtime = 'nodejs';

const BOOKS_BUCKET_NAME = 'libros';

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

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    const range = request.headers.get('range') || undefined;

    const command = new GetObjectCommand({
      Bucket: BOOKS_BUCKET_NAME,
      Key: filename,
      Range: range,
    });

    const s3Response = await s3Client.send(command);

    const nodeReadable = s3Response.Body as unknown as Readable;
    const webStream = Readable.toWeb(nodeReadable);

    const headers = new Headers();
    headers.set('Content-Type', s3Response.ContentType || 'application/pdf');
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Cache-Control', 'no-store, must-revalidate');

    if (typeof s3Response.ContentLength === 'number') {
      headers.set('Content-Length', String(s3Response.ContentLength));
    }

    if (range && s3Response.ContentRange) {
      headers.set('Content-Range', s3Response.ContentRange);
      return new NextResponse(webStream as unknown as BodyInit, {
        status: 206,
        headers,
      });
    }

    headers.set('Content-Disposition', `inline; filename="${filename}"`);
    return new NextResponse(webStream as unknown as BodyInit, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error serving book PDF:', error);
    return NextResponse.json(
      { error: 'Libro no encontrado' },
      { status: 404 }
    );
  }
}
