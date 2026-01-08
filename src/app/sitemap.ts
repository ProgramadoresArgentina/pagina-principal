import { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/articles'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://programadoresargentina.com'
  const now = new Date()
  
  // Obtener todos los artículos públicos
  let articles: Array<{ slug: string; updatedAt: Date; publishedAt: Date | null }> = []
  try {
    const allArticles = await getAllArticles()
    articles = allArticles.map(article => ({
      slug: article.slug,
      updatedAt: article.updatedAt,
      publishedAt: article.publishedAt,
    }))
  } catch (error) {
    console.error('Error al obtener artículos para sitemap:', error)
  }
  
  // URLs estáticas
  const staticUrls: MetadataRoute.Sitemap = [
    // Página principal - máxima prioridad
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // Páginas principales de navegación - alta prioridad
    {
      url: `${baseUrl}/club`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/articulos`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cotizador`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/club/libros`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pines`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Páginas de autenticación - prioridad media
    {
      url: `${baseUrl}/ingresar`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/registro`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]
  
  // URLs dinámicas de artículos
  const articleUrls: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/articulos/${article.slug}`,
    lastModified: article.updatedAt || article.publishedAt || now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  
  return [...staticUrls, ...articleUrls]
}
