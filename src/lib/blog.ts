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

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'articulos';
const BLOG_PREFIX = ''; // Sin prefijo, las carpetas están en la raíz
const POSTS_PER_PAGE = 10; // Número de artículos por página

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

// Función auxiliar para extraer el número de orden de una carpeta
function extractOrderNumber(folderName: string): number {
  const match = folderName.match(/^(\d+)-/);
  return match ? parseInt(match[1], 10) : 0;
}

// Función auxiliar para generar URL de imagen desde MinIO
function getMinIOImageUrl(imagePath: string, folderName: string): string {
  if (!imagePath) return '/assets/images/articulos/default.webp';
  
  // Si ya es una URL completa, devolverla tal como está
  if (imagePath.startsWith('http') || imagePath.startsWith('/assets/')) {
    return imagePath;
  }
  
  // Si es una ruta relativa, construir la URL de MinIO
  const minioEndpoint = process.env.MINIO_ENDPOINT || 'http://localhost:9000';
  const bucketName = process.env.MINIO_BUCKET_NAME || 'programadores-argentina-blog';
  
  // Construir la ruta completa: folderName/imagePath
  const fullPath = `${folderName}/${imagePath}`;
  
  return `${minioEndpoint}/${bucketName}/${fullPath}`;
}

// Función auxiliar para procesar el contenido markdown
function processMarkdownContent(fileContents: string, folderName: string, lastModified?: Date): BlogPost {
  // Limpieza más agresiva del contenido
  let cleanedContent = fileContents.trim();
  
  // Si no empieza con ---, buscar el primer --- y remover todo lo anterior
  if (!cleanedContent.startsWith('---')) {
    const firstDashIndex = cleanedContent.indexOf('---');
    if (firstDashIndex !== -1) {
      cleanedContent = cleanedContent.substring(firstDashIndex);
    }
  }
  
  const { data, content } = matter(cleanedContent);


  // Procesar el contenido para convertir rutas de imágenes relativas a URLs de MinIO
  const processedContent = processImagePaths(content, folderName);

  // Extraer el slug del nombre de la carpeta (sin el número)
  const slug = folderName.replace(/^\d+-/, '');

  return {
    slug,
    title: data.title || '',
    description: data.description || '',
    date: data.date || '',
    author: data.author || 'Programadores Argentina',
    authorImage: data.authorImage || '/assets/images/perfiles/club-programadores-argentina.png',
    category: data.category || 'General',
    image: getMinIOImageUrl(data.image || 'hero-image.webp', folderName),
    isPublic: data.isPublic !== false, // Por defecto es público
    excerpt: data.excerpt || processedContent.substring(0, 200) + '...',
    content: processedContent,
    lastModified,
  };
}

// Función auxiliar para procesar rutas de imágenes en el contenido markdown
function processImagePaths(content: string, folderName: string): string {
  // Patrón para encontrar imágenes markdown: ![alt](path)
  const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
  
  return content.replace(imagePattern, (match, alt, imagePath) => {
    // Si la imagen ya es una URL completa o una ruta de assets, no procesarla
    if (imagePath.startsWith('http') || imagePath.startsWith('/assets/')) {
      return match;
    }
    
    // Si es una ruta relativa, construir la URL de MinIO
    const minioEndpoint = process.env.MINIO_ENDPOINT || 'http://localhost:9000';
    const bucketName = process.env.MINIO_BUCKET_NAME || 'programadores-argentina-blog';
    
    // Construir la ruta completa: folderName/imagePath
    const fullPath = `${folderName}/${imagePath}`;
    const minioUrl = `${minioEndpoint}/${bucketName}/${fullPath}`;
    
    return `![${alt}](${minioUrl})`;
  });
}

// Función auxiliar para obtener carpetas de artículos
async function getArticleFolders(): Promise<string[]> {
  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Delimiter: '/',
    });

    const response = await s3Client.send(command);
    const folders = response.CommonPrefixes || [];

    // Filtrar solo carpetas que empiecen con número (formato: 1-nombre-carpeta)
    const articleFolders = folders
      .map(prefix => prefix.Prefix?.replace('/', ''))
      .filter((folder): folder is string => 
        folder !== undefined && /^\d+-/.test(folder)
      );

    return articleFolders;
  } catch (error) {
    console.error('Error getting article folders from MinIO:', error);
    return [];
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const folders = await getArticleFolders();
    
    // Procesar cada carpeta
    const allPostsData = await Promise.all(
      folders.map(async (folderName) => {
        // Buscar article.md o article.md.md
        let articleKey = `${folderName}/article.md`;
        let fileContents = await getMinIOObjectContent(articleKey);
        
        // Si no encuentra article.md, intentar con article.md.md
        if (!fileContents) {
          articleKey = `${folderName}/article.md.md`;
          fileContents = await getMinIOObjectContent(articleKey);
        }
        
        if (!fileContents) return null;
        
        // Obtener información del archivo para la fecha de modificación
        const listCommand = new ListObjectsV2Command({
          Bucket: BUCKET_NAME,
          Prefix: articleKey,
        });
        
        const listResponse = await s3Client.send(listCommand);
        const object = listResponse.Contents?.find(obj => obj.Key === articleKey);
        const lastModified = object?.LastModified;
        
        return processMarkdownContent(fileContents, folderName, lastModified);
      })
    );

    // Filtrar posts nulos y ordenar por número de carpeta (mayor a menor)
    return allPostsData
      .filter((post): post is BlogPost => post !== null)
      .sort((a, b) => {
        // Usar el nombre de la carpeta original para extraer el número de orden
        const folderA = folders.find(folder => folder.replace(/^\d+-/, '') === a.slug);
        const folderB = folders.find(folder => folder.replace(/^\d+-/, '') === b.slug);
        
        const orderA = folderA ? extractOrderNumber(folderA) : 0;
        const orderB = folderB ? extractOrderNumber(folderB) : 0;
        
        return orderB - orderA; // Mayor número primero (más reciente)
      });
  } catch (error) {
    console.error('Error reading blog posts from MinIO:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const folders = await getArticleFolders();
    
    // Buscar la carpeta que coincida con el slug (sin el número)
    const matchingFolder = folders.find(folder => 
      folder.replace(/^\d+-/, '') === slug
    );
    
    if (!matchingFolder) {
      return null;
    }
    
    // Buscar article.md o article.md.md
    let articleKey = `${matchingFolder}/article.md`;
    let fileContents = await getMinIOObjectContent(articleKey);
    
    // Si no encuentra article.md, intentar con article.md.md
    if (!fileContents) {
      articleKey = `${matchingFolder}/article.md.md`;
      fileContents = await getMinIOObjectContent(articleKey);
    }
    
    if (!fileContents) {
      return null;
    }
    
    // Obtener información del archivo para la fecha de modificación
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: articleKey,
    });
    
    const listResponse = await s3Client.send(listCommand);
    const object = listResponse.Contents?.find(obj => obj.Key === articleKey);
    
    if (!object) {
      return null;
    }

    return processMarkdownContent(fileContents, matchingFolder, object.LastModified);
  } catch (error) {
    console.error('Error reading blog post from MinIO:', error);
    return null;
  }
}

export async function getPublicPosts(): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  // Temporalmente mostrar todos los posts, independientemente de isPublic
  return allPosts;
}

export async function getSubscriberPosts(): Promise<BlogPost[]> {
  return await getAllPosts();
}

// Interfaz para la respuesta paginada
export interface PaginatedPosts {
  posts: BlogPost[];
  totalPosts: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Función para obtener posts paginados
export async function getPaginatedPosts(page: number = 1): Promise<PaginatedPosts> {
  try {
    const allPosts = await getAllPosts();
    const totalPosts = allPosts.length;
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
    
    const startIndex = (page - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const posts = allPosts.slice(startIndex, endIndex);
    
    return {
      posts,
      totalPosts,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  } catch (error) {
    console.error('Error getting paginated posts:', error);
    return {
      posts: [],
      totalPosts: 0,
      currentPage: 1,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }
}

// Función para obtener posts públicos paginados
export async function getPublicPaginatedPosts(page: number = 1): Promise<PaginatedPosts> {
  try {
    const allPosts = await getPublicPosts();
    const totalPosts = allPosts.length;
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
    
    const startIndex = (page - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const posts = allPosts.slice(startIndex, endIndex);
    
    return {
      posts,
      totalPosts,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };
  } catch (error) {
    console.error('Error getting public paginated posts:', error);
    return {
      posts: [],
      totalPosts: 0,
      currentPage: 1,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    };
  }
}
