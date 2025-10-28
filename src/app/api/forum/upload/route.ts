import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { verifyToken, getAuthenticatedUser } from '@/lib/auth'

const FORUM_BUCKET_NAME = 'forum'

// Configuración de MinIO (compatible con S3)
const s3Client = new S3Client({
  region: process.env.MINIO_REGION || 'us-east-1',
  endpoint: process.env.MINIO_ENDPOINT || 'http://localhost:9000',
  forcePathStyle: true, // Necesario para MinIO
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || '',
    secretAccessKey: process.env.MINIO_SECRET_KEY || '',
  },
})

// Tipos de archivo permitidos
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed'
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB para videos

interface MultimediaFile {
  filename: string
  originalName: string
  type: 'image' | 'video' | 'file'
  size: number
  url: string
}

// POST /api/forum/upload - Subir archivos multimedia
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token no proporcionado' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      )
    }

    const authUser = await getAuthenticatedUser(token)
    if (!authUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No se proporcionaron archivos' },
        { status: 400 }
      )
    }

    if (files.length > 3) {
      return NextResponse.json(
        { error: 'Máximo 3 archivos multimedia permitidos' },
        { status: 400 }
      )
    }

    const uploadedFiles: MultimediaFile[] = []

    for (const file of files) {
      // Validar tipo de archivo
      const fileType = file.type
      let mediaType: 'image' | 'video' | 'file' | null = null

      if (ALLOWED_IMAGE_TYPES.includes(fileType)) {
        mediaType = 'image'
      } else if (ALLOWED_VIDEO_TYPES.includes(fileType)) {
        mediaType = 'video'
      } else if (ALLOWED_FILE_TYPES.includes(fileType)) {
        mediaType = 'file'
      } else {
        return NextResponse.json(
          { error: `Tipo de archivo no permitido: ${fileType}` },
          { status: 400 }
        )
      }

      // Validar tamaño
      const maxSize = mediaType === 'video' ? MAX_VIDEO_SIZE : MAX_FILE_SIZE
      if (file.size > maxSize) {
        const maxSizeMB = maxSize / (1024 * 1024)
        return NextResponse.json(
          { error: `El archivo ${file.name} excede el tamaño máximo de ${maxSizeMB}MB` },
          { status: 400 }
        )
      }

      // Generar nombre único para el archivo
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 8)
      const fileExtension = file.name.split('.').pop()
      const uniqueFilename = `${authUser.id}/${timestamp}-${randomString}.${fileExtension}`

      // Convertir File a Buffer
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Subir a MinIO
      const command = new PutObjectCommand({
        Bucket: FORUM_BUCKET_NAME,
        Key: uniqueFilename,
        Body: buffer,
        ContentType: fileType,
        ContentLength: file.size,
        Metadata: {
          originalName: file.name,
          uploadedBy: authUser.id,
          uploadedAt: new Date().toISOString(),
          mediaType: mediaType
        }
      })

      await s3Client.send(command)

      // Crear objeto de archivo subido
      const uploadedFile: MultimediaFile = {
        filename: uniqueFilename,
        originalName: file.name,
        type: mediaType,
        size: file.size,
        url: `/api/forum/media/${uniqueFilename}`
      }

      uploadedFiles.push(uploadedFile)
    }

    return NextResponse.json({
      message: 'Archivos subidos exitosamente',
      files: uploadedFiles
    }, { status: 201 })

  } catch (error) {
    console.error('Error al subir archivos multimedia:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
