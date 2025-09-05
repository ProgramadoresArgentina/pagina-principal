import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  authorImage: string;
  category: string;
  image: string;
  isPublic: boolean;
  excerpt: string;
  content: string;
  lastModified?: Date; // Fecha de última modificación del archivo
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

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'programadores-argentina-blog';
const BLOG_PREFIX = ''; // Prefijo para los archivos de blog en MinIO

// Función auxiliar para obtener el contenido de un archivo desde MinIO
async function getMinIOObjectContent(key: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    
    const response = await s3Client.send(command);
    const content = await response.Body?.transformToString();
    return content || '';
  } catch (error) {
    console.error(`Error reading MinIO object ${key}:`, error);
    return '';
  }
}

// Función auxiliar para procesar el contenido markdown
function processMarkdownContent(fileContents: string, slug: string, lastModified?: Date): BlogPost {
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || '',
    description: data.description || '',
    date: data.date || '',
    author: data.author || 'Programadores Argentina',
    authorImage: data.authorImage || '/assets/images/perfiles/juansemastrangelo.jpg',
    category: data.category || 'General',
    image: data.image || '/assets/images/articulos/default.webp',
    isPublic: data.isPublic !== false, // Por defecto es público
    excerpt: data.excerpt || content.substring(0, 200) + '...',
    content,
    lastModified,
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: BLOG_PREFIX,
    });

    const response = await s3Client.send(command);
    const objects = response.Contents || [];

    // Filtrar solo archivos .md
    const markdownFiles = objects.filter(obj => 
      obj.Key?.endsWith('.md') && obj.Key !== BLOG_PREFIX
    );

    // Procesar cada archivo
    const allPostsData = await Promise.all(
      markdownFiles.map(async (obj) => {
        if (!obj.Key) return null;
        
        const slug = obj.Key.replace(BLOG_PREFIX, '').replace(/\.md$/, '');
        const fileContents = await getMinIOObjectContent(obj.Key);
        
        if (!fileContents) return null;
        
        // Usar la fecha de modificación del archivo (último cargado)
        const lastModified = obj.LastModified;
        
        return processMarkdownContent(fileContents, slug, lastModified);
      })
    );

    // Filtrar posts nulos y ordenar por fecha de modificación (último cargado primero)
    return allPostsData
      .filter((post): post is BlogPost => post !== null)
      .sort((a, b) => {
        // Si ambos tienen lastModified, ordenar por esa fecha
        if (a.lastModified && b.lastModified) {
          return b.lastModified.getTime() - a.lastModified.getTime();
        }
        
        // Si solo uno tiene lastModified, priorizar el que lo tiene
        if (a.lastModified && !b.lastModified) {
          return -1;
        }
        if (!a.lastModified && b.lastModified) {
          return 1;
        }
        
        // Si ninguno tiene lastModified, usar la fecha del frontmatter como fallback
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  } catch (error) {
    console.error('Error reading blog posts from MinIO:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const key = `${BLOG_PREFIX}${slug}.md`;
    
    // Primero obtener la información del objeto para tener la fecha de modificación
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: key,
    });
    
    const listResponse = await s3Client.send(listCommand);
    const object = listResponse.Contents?.find(obj => obj.Key === key);
    
    if (!object) {
      return null;
    }
    
    const fileContents = await getMinIOObjectContent(key);
    
    if (!fileContents) {
      return null;
    }

    return processMarkdownContent(fileContents, slug, object.LastModified);
  } catch (error) {
    console.error('Error reading blog post from MinIO:', error);
    return null;
  }
}

export async function getPublicPosts(): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => post.isPublic);
}

export async function getSubscriberPosts(): Promise<BlogPost[]> {
  return await getAllPosts();
}
