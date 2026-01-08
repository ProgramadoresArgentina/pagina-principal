import { prisma } from './prisma'

export interface Article {
  id: string
  title: string
  slug: string
  description: string | null
  content: any // JSON content from Tiptap/Plate
  excerpt: string | null
  image: string | null
  category: string
  author: string
  authorImage: string | null
  isPublic: boolean
  isSubscriberOnly: boolean
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
  authorId: string | null
  authorUser: {
    id: string
    name: string | null
    username: string | null
    avatar: string | null
  } | null
}

export interface PaginatedArticles {
  articles: Article[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

/**
 * Obtiene todos los artículos públicos
 */
export async function getAllArticles(): Promise<Article[]> {
  const articles = await prisma.article.findMany({
    where: {
      isPublic: true,
      publishedAt: { not: null },
    },
    orderBy: {
      publishedAt: 'desc',
    },
    include: {
      authorUser: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
        },
      },
    },
  })

  return articles
}

/**
 * Obtiene un artículo por slug
 * @param slug - El slug del artículo
 * @param includeDrafts - Si es true, incluye borradores (solo para admins)
 */
export async function getArticleBySlug(
  slug: string,
  includeDrafts: boolean = false
): Promise<Article | null> {
  const where: any = { slug }

  if (!includeDrafts) {
    where.isPublic = true
    where.publishedAt = { not: null }
  }

  const article = await prisma.article.findFirst({
    where,
    include: {
      authorUser: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
        },
      },
    },
  })

  return article
}

/**
 * Obtiene artículos paginados
 * @param page - Número de página (empezando en 1)
 * @param limit - Cantidad de artículos por página (default: 10)
 */
export async function getPaginatedArticles(
  page: number = 1,
  limit: number = 10
): Promise<PaginatedArticles> {
  const skip = (page - 1) * limit

  const where = {
    isPublic: true,
    publishedAt: { not: null },
  }

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        publishedAt: 'desc',
      },
      include: {
        authorUser: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    }),
    prisma.article.count({ where }),
  ])

  return {
    articles,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: skip + limit < total,
      hasPreviousPage: page > 1,
    },
  }
}

/**
 * Formatea una fecha a formato legible
 * @param dateString - Fecha en formato ISO string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}
