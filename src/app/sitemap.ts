import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://programadoresargentina.com'
  const now = new Date()
  
  return [
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
      url: `${baseUrl}/foro`,
      lastModified: now,
      changeFrequency: 'daily',
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
    // Artículos específicos - prioridad media
    {
      url: `${baseUrl}/articulos/nueva-arquitectura-HNET`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
}
