import { S3Client, CreateBucketCommand, PutBucketPolicyCommand } from '@aws-sdk/client-s3'

// Configuración de MinIO (compatible con S3)
const s3Client = new S3Client({
  region: process.env.MINIO_REGION || 'us-east-1',
  endpoint: process.env.MINIO_ENDPOINT || 'https://minio-kssow0804wscss8wc84wwk4w.147.93.13.112.sslip.io',
  forcePathStyle: true, // Necesario para MinIO
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || '',
    secretAccessKey: process.env.MINIO_SECRET_KEY || '',
  },
})

const FORUM_BUCKET_NAME = 'forum'

async function createForumBucket() {
  try {
    console.log('🪣 Creando bucket para el foro...')
    
    // Crear el bucket
    const createCommand = new CreateBucketCommand({
      Bucket: FORUM_BUCKET_NAME,
    })
    
    await s3Client.send(createCommand)
    console.log(`✅ Bucket '${FORUM_BUCKET_NAME}' creado exitosamente`)
    
    // Configurar política del bucket para acceso público de lectura
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${FORUM_BUCKET_NAME}/*`
        }
      ]
    }
    
    const policyCommand = new PutBucketPolicyCommand({
      Bucket: FORUM_BUCKET_NAME,
      Policy: JSON.stringify(bucketPolicy)
    })
    
    await s3Client.send(policyCommand)
    console.log(`✅ Política pública configurada para el bucket '${FORUM_BUCKET_NAME}'`)
    
  } catch (error: any) {
    if (error.name === 'BucketAlreadyOwnedByYou') {
      console.log(`ℹ️ El bucket '${FORUM_BUCKET_NAME}' ya existe`)
    } else {
      console.error('❌ Error creando bucket:', error)
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  createForumBucket()
    .then(() => {
      console.log('🎉 Proceso completado')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error)
      process.exit(1)
    })
}

export { createForumBucket }
