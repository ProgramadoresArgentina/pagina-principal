import { JSX } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import BackToTop from "../../components/BackToTop";
import Header from "../../components/Header";
import MobileHeader from "../../components/MobileHeader";
import Footer from "../../components/Footer";
import StructuredData from "../../components/StructuredData";
import LockedContent from "../../components/LockedContent";
import MarkdownRenderer from "../../components/MarkdownRenderer";
import { getPostBySlug, getAllPosts } from "@/lib/blog";

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
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Artículo no encontrado | Programadores Argentina",
      description: "El artículo que buscas no existe o ha sido movido.",
    };
  }

  // Crear descripción más rica para SEO
  const seoDescription = post.excerpt || post.description || `Aprende sobre ${post.category.toLowerCase()} con este artículo de ${post.author} en Programadores Argentina.`;

  // Generar keywords más específicas
  const keywords = [
    post.category.toLowerCase(),
    post.title.toLowerCase(),
    "programación argentina",
    "desarrollo software argentina",
    "tutoriales programación",
    "blog desarrolladores argentina",
    "comunidad tech argentina",
    post.author.toLowerCase(),
    "programadores argentina",
    "desarrollo web argentina",
    "tecnología argentina"
  ];

  // URL de imagen con fallback
  const imageUrl = post.image || "/assets/images/articulos-default-og.jpg";

  return {
    title: `${post.title} | Programadores Argentina`,
    description: seoDescription,
    keywords: keywords,
    authors: [{ name: post.author }],
    creator: "Programadores Argentina",
    publisher: "Programadores Argentina",
    metadataBase: new URL("https://programadoresargentina.com"),
    alternates: {
      canonical: `/articulos/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | Programadores Argentina`,
      description: seoDescription,
      url: `https://programadoresargentina.com/articulos/${post.slug}`,
      siteName: "Programadores Argentina",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${post.title} - Artículo de ${post.author} en Programadores Argentina`,
        },
      ],
      locale: "es_AR",
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.date,
      section: post.category,
      tags: [post.category, post.author, "programación argentina"],
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Programadores Argentina`,
      description: seoDescription,
      images: [imageUrl],
      creator: "@programadores_argentina",
      site: "@programadores_argentina",
    },
    robots: {
      index: post.isPublic,
      follow: post.isPublic,
      googleBot: {
        index: post.isPublic,
        follow: post.isPublic,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps): Promise<JSX.Element> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const articleData = {
    title: post.title,
    description: post.description,
    image: post.image,
    url: `https://programadoresargentina.com/articulos/${post.slug}`,
    publishedTime: post.date,
    modifiedTime: post.date,
    section: post.category,
    keywords: [post.category],
  };

  return (
    <>
      <StructuredData 
        type="Article" 
        data={articleData} 
      />
      <BackToTop />
      <Header />
      <MobileHeader />

      <div className="body-overlay"></div>

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <section id="postbox" className="postbox-area pt-160 pb-80">
              <div className="container container-1330">
                <div className="row">
                  <div className="col-12">
                    <div className="postbox-wrapper mb-115">
                      <article className="postbox-details-item item-border mb-20">
                        <div className="postbox-details-info-wrap">
                          <div className="d-flex align-items-center justify-content-between mb-20">
                            
                          <a href="/articulos" className="tp-btn-black btn-green-light-bg">
                              <span className="tp-btn-black-filter-blur">
                                <svg width="0" height="0">
                                  <defs>
                                    <filter id="buttonFilterBack">
                                      <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"></feGaussianBlur>
                                      <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"></feColorMatrix>
                                      <feComposite in="SourceGraphic" in2="buttonFilterBack" operator="atop"></feComposite>
                                      <feBlend in="SourceGraphic" in2="buttonFilterBack"></feBlend>
                                    </filter>
                                  </defs>
                                </svg>
                              </span>
                              <span className="tp-btn-black-filter d-inline-flex align-items-center" style={{filter: "url(#buttonFilterBack)"}}>
                                <span className="tp-btn-black-circle">
                                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 1L1 1M1 1V9M1 1L1 9" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                  </svg>
                                </span>
                                <span className="tp-btn-black-text">
                                  Volver
                                </span>
                              </span>
                            </a>
                            <div className="postbox-tag postbox-details-tag">
                            <span>
                              <i>
                                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M4.39101 4.39135H4.39936M13.6089 8.73899L8.74578 13.6021C8.61979 13.7283 8.47018 13.8283 8.3055 13.8966C8.14082 13.9649 7.9643 14 7.78603 14C7.60777 14 7.43124 13.9649 7.26656 13.8966C7.10188 13.8283 6.95228 13.7283 6.82629 13.6021L1 7.78264V1H7.78264L13.6089 6.82629C13.8616 7.08045 14.0034 7.42427 14.0034 7.78264C14.0034 8.14102 13.8616 8.48483 13.6089 8.73899Z" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </i>
                              {post.category}
                            </span>
                            </div>
                          </div>
                          <h4 className="postbox-title fs-54">{post.title}</h4>
                          <div className="postbox-details-meta d-flex align-items-center">
                            <div className="postbox-author-box d-flex align-items-center ">
                              <div className="postbox-author-img">
                                <img src={post.authorImage} width="50" height="50" alt={post.author} />
                              </div>
                              <div className="postbox-author-info">
                                <h4 className="postbox-author-name">{post.author}</h4>
                              </div>
                            </div>
                            <div className="postbox-meta">
                              <i>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M9 4.19997V8.99997L12.2 10.6M17 9C17 13.4183 13.4183 17 9 17C4.58172 17 1 13.4183 1 9C1 4.58172 4.58172 1 9 1C13.4183 1 17 4.58172 17 9Z" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </i>
                              <span>{formatDate(post.date)}</span>
                            </div>
                          </div>
                        </div>
                      </article>
                      <div className="col-12 col-md-10 col-lg-8 mx-auto">
                      
                      {post.image && (
                        <div className="postbox-details-thumb mb-25">
                          <img className="w-100" style={{ borderRadius: '14px', maxHeight: '300px', objectFit: 'cover' }} src={post.image} alt={post.title} />
                        </div>
                      )}

                        <LockedContent 
                            isPublic={post.isPublic}
                            excerpt={post.excerpt}
                            title={post.title}
                        >
                            <div className="postbox-details-text mb-45">
                            <MarkdownRenderer content={post.content} />
                            </div>
                        </LockedContent>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}
