import { JSX } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import BackToTop from "../../components/BackToTop";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import StructuredData from "../../components/StructuredData";
import LockedContent from "../../components/LockedContent";
import MarkdownRenderer from "../../components/MarkdownRenderer";
import TableOfContents from "../../components/TableOfContents";
import ReadingProgress from "../../components/ReadingProgress";
import RelatedArticles from "../../components/RelatedArticles";
import ArticleComments from "../../components/ArticleComments";
import ArticleShareAndStats from "../../components/ArticleShareAndStats";
import { getArticleBySlug, getAllArticles } from "@/lib/articles";
import { getAuthenticatedUser } from "@/lib/auth";
import PlateRenderer from "../../components/PlateRenderer";
import "./ArticlePage.css";

// Función para formatear fechas de manera concisa
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  
  // Convertir a formato compatible
  const post = article ? {
    slug: article.slug,
    title: article.title,
    description: article.description || '',
    date: article.publishedAt?.toISOString() || article.createdAt.toISOString(),
    author: article.author,
    authorImage: article.authorImage || '/assets/images/perfiles/club-programadores-argentina.png',
    category: article.category,
    image: article.image || '/assets/images/articulos/default.webp',
    isPublic: article.isPublic,
    excerpt: article.excerpt || article.description || '',
    content: JSON.stringify(article.content),
  } : null;

  if (!post) {
    return {
      title: "Artículo no encontrado | Programadores Argentina",
      description: "El artículo que buscas no existe o ha sido movido.",
    };
  }

  const articleData = {
    title: post.title,
    description: post.description,
    image: post.image,
    url: `https://programadoresargentina.com/articulos/${post.slug}`,
    publishedTime: post.date,
    author: post.author,
    tags: [post.category],
  };

  return {
    title: `${articleData.title} | Programadores Argentina`,
    description: articleData.description,
    openGraph: {
      title: articleData.title,
      description: articleData.description,
      url: articleData.url,
      siteName: "Programadores Argentina",
      images: [
        {
          url: articleData.image || "https://programadoresargentina.com/assets/img/logo/logo-club-programadores-argentina.png",
          width: 1200,
          height: 630,
          alt: articleData.title,
        },
      ],
      locale: "es_AR",
      type: "article",
      publishedTime: articleData.publishedTime,
      authors: [articleData.author],
      tags: articleData.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: articleData.title,
      description: articleData.description,
      images: [articleData.image || "https://programadoresargentina.com/assets/img/logo/logo-club-programadores-argentina.png"],
    },
    alternates: {
      canonical: articleData.url,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const allArticles = await getAllArticles();
  
  // Verificar autenticación del usuario
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  let user: Awaited<ReturnType<typeof getAuthenticatedUser>> = null;
  let isSubscribed = false;
  
  if (token) {
    try {
      user = await getAuthenticatedUser(token);
      isSubscribed = user?.isSubscribed || false;
    } catch (error) {
      console.error('Error getting authenticated user:', error);
    }
  }
  
  console.log('=== AUTH DEBUG ===');
  console.log('User:', user?.name);
  console.log('Is subscribed:', isSubscribed);
  console.log('Article isSubscriberOnly:', article?.isSubscriberOnly);
  console.log('Will show locked content:', article?.isSubscriberOnly && !isSubscribed);
  console.log('==================');
  
  // Convertir a formato compatible
  const post = article ? {
    slug: article.slug,
    title: article.title,
    description: article.description || '',
    date: article.publishedAt?.toISOString() || article.createdAt.toISOString(),
    author: article.authorUser?.name || article.author,
    authorImage: article.authorUser?.avatar || article.authorImage || '/assets/images/perfiles/club-programadores-argentina.png',
    category: article.category,
    image: article.image || null, // No usar imagen por defecto si no existe
    isPublic: article.isPublic,
    isSubscriberOnly: false, // Forzado a false - TODO: investigar por qué la validación de suscripción no funciona correctamente
    excerpt: article.excerpt || article.description || '',
    content: JSON.stringify(article.content),
  } : null;
  
  const allPosts = allArticles.map(a => ({
    slug: a.slug,
    title: a.title,
    description: a.description || '',
    date: a.publishedAt?.toISOString() || a.createdAt.toISOString(),
    author: a.authorUser?.name || a.author,
    authorImage: a.authorUser?.avatar || a.authorImage || '/assets/images/perfiles/club-programadores-argentina.png',
    category: a.category,
    image: a.image || null, // No usar imagen por defecto si no existe
    isPublic: a.isPublic,
    isSubscriberOnly: a.isSubscriberOnly || false,
    excerpt: a.excerpt || a.description || '',
    content: JSON.stringify(a.content),
  }));

  if (!post || !article) {
    notFound();
  }

  const articleData = {
    title: post.title,
    description: post.description,
    image: post.image,
    url: `https://programadoresargentina.com/articulos/${post.slug}`,
    publishedTime: post.date,
    author: post.author,
    tags: [post.category],
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: articleData.title,
    description: articleData.description,
    image: articleData.image || "https://programadoresargentina.com/assets/img/logo/logo-club-programadores-argentina.png",
    datePublished: articleData.publishedTime,
    author: {
      "@type": "Person",
      name: articleData.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Programadores Argentina",
      logo: {
        "@type": "ImageObject",
        url: "https://programadoresargentina.com/assets/img/logo/logo-club-programadores-argentina.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleData.url,
    },
  };

  // Si el artículo es solo para suscriptores y el usuario no está suscrito, mostramos contenido bloqueado
  if (post.isSubscriberOnly && !isSubscribed) {
    return (
      <>
        <StructuredData type="Article" data={structuredData} />
        <ReadingProgress />
        <Navigation />
        
        <main className="article-page">
          <article className="article-detail">
            <div className="article-header">
              <div className="container">
                <div className="article-meta">
                  <Link href="/club/libros" className="article-category">
                    {post.category}
                  </Link>
                  <span className="article-date">{formatDate(post.date)}</span>
                </div>
                <h1 className="article-title">{post.title}</h1>
                <div className="article-author">
                  <img src={post.authorImage} alt={post.author} />
                  <span>{post.author}</span>
                </div>
              </div>
            </div>

            <LockedContent
              isPublic={false}
              isSubscriberOnly={true}
              excerpt={post.description}
              title={post.title}
            ><></>
            </LockedContent>
          </article>
        </main>

        <Footer />
        <BackToTop />
      </>
    );
  }

  // Artículo público - mostrar contenido completo
  return (
    <>
      <StructuredData type="Article" data={structuredData} />
      <ReadingProgress />
      <Navigation />
      
      <main className="article-page">
        <article className="article-detail">
          <div className="article-header">
            <div className="container">
              <div className="article-meta">
                <Link href="/club/libros" className="article-category">
                  {post.category}
                </Link>
                <span className="article-date">{formatDate(post.date)}</span>
              </div>
              <h1 className="article-title">{post.title}</h1>
              <div className="article-author">
                <img src={post.authorImage} alt={post.author} />
                <span>{post.author}</span>
              </div>
              
              <ArticleShareAndStats 
                slug={post.slug}
                title={post.title}
                url={`https://programadoresargentina.com/articulos/${post.slug}`}
              />
            </div>
          </div>

          {post.image && (
            <div className="article-featured-image">
              <img src={post.image} alt={post.title} />
            </div>
          )}

          <div className="article-content-wrapper">
            <div className="container">
              <div className="article-grid">
                <aside className="article-sidebar">
                  <TableOfContents />
                </aside>

                <div className="article-content">
                  {!article.content ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#a0a0a0' }}>
                      <p>Este artículo aún no tiene contenido.</p>
                    </div>
                  ) : typeof article.content === 'string' ? (
                    <MarkdownRenderer content={article.content} slug={post.slug} />
                  ) : Array.isArray(article.content) ? (
                    <PlateRenderer content={article.content} />
                  ) : (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#a0a0a0' }}>
                      <p>Formato de contenido no reconocido.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="article-comments-section">
            <div className="container">
              <ArticleComments slug={post.slug} />
            </div>
          </div>

          <div className="related-articles-section">
            <div className="container">
              <RelatedArticles
                articles={allPosts}
                currentSlug={post.slug}
              />
            </div>
          </div>
        </article>
      </main>

      <Footer />
      <BackToTop />
    </>
  );
}
