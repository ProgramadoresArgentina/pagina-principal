import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Programadores Argentina - Comunidad de Desarrolladores',
    short_name: 'Programadores AR',
    description: 'Comunidad más grande de programadores de Argentina con más de 60.000 miembros',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#D0FF71',
    icons: [
      {
        src: '/assets/images/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/assets/images/LogoProgramadoresArgentina.webp',
        sizes: '192x192',
        type: 'image/webp',
      },
      {
        src: '/assets/images/LogoProgramadoresArgentina.webp',
        sizes: '512x512',
        type: 'image/webp',
      },
    ],
    categories: ['technology', 'education', 'business'],
    lang: 'es-AR',
    orientation: 'portrait-primary',
  }
}
