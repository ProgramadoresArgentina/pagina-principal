import { JSX } from "react";
import { Metadata } from "next";
import BackToTop from "../components/BackToTop";
import Header from "../components/Header";
import MobileHeader from "../components/MobileHeader";
import Footer from "../components/Footer";
import InfiniteScrollBlog from "../components/InfiniteScrollBlog";
import { getPublicPaginatedPosts } from "@/lib/blog";


export const metadata: Metadata = {
  title: "Artículos y Blog Técnico | Programadores Argentina - Tutoriales y Guías de Desarrollo",
  description: "Explora los mejores artículos técnicos de la comunidad de programadores argentina. Tutoriales de React, TypeScript, Node.js, análisis de mercado tech, guías de desarrollo profesional, arquitectura de software y contenido exclusivo para desarrolladores senior.",
  keywords: [
    "artículos programación argentina",
    "blog desarrolladores argentina", 
    "tutoriales react argentina",
    "tutoriales typescript argentina",
    "tutoriales node.js argentina",
    "contenido técnico argentina",
    "guías desarrollo software argentina",
    "análisis mercado tech argentina",
    "blog programadores argentina",
    "artículos tecnología argentina",
    "contenido exclusivo desarrolladores",
    "tutoriales tech argentina",
    "programación web argentina",
    "desarrollo frontend argentina",
    "desarrollo backend argentina",
    "arquitectura software argentina",
    "mejores prácticas programación",
    "código limpio argentina",
    "patrones diseño argentina",
    "devops argentina",
    "microservicios argentina",
    "inteligencia artificial argentina",
    "machine learning argentina",
    "ciberseguridad argentina"
  ],
  authors: [{ name: "Programadores Argentina" }],
  creator: "Programadores Argentina",
  publisher: "Programadores Argentina",
  metadataBase: new URL("https://programadoresargentina.com"),
  alternates: {
    canonical: "/articulos",
  },
  openGraph: {
    title: "Artículos y Blog Técnico | Programadores Argentina",
    description: "Explora los mejores artículos técnicos de la comunidad de programadores argentina. Tutoriales de React, TypeScript, Node.js, análisis de mercado tech y guías de desarrollo profesional.",
    url: "https://programadoresargentina.com/articulos",
    siteName: "Programadores Argentina",
    images: [
      {
        url: "/assets/images/og-articulos-programadores-argentina.jpg",
        width: 1200,
        height: 630,
        alt: "Artículos y Blog Técnico de Programadores Argentina - Tutoriales y Guías de Desarrollo",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Artículos y Blog Técnico | Programadores Argentina",
    description: "Explora los mejores artículos técnicos de la comunidad de programadores argentina. Tutoriales de React, TypeScript, Node.js y guías de desarrollo profesional.",
    images: ["/assets/images/og-articulos-programadores-argentina.jpg"],
    creator: "@programadores_argentina",
    site: "@programadores_argentina",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "tu-google-verification-code",
  },
  category: "technology",
  classification: "Blog Técnico de Programación",
  other: {
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:type": "image/jpeg",
    "article:author": "Programadores Argentina",
    "article:publisher": "https://programadoresargentina.com",
    "article:section": "Tecnología",
    "article:tag": "programación, desarrollo, tutoriales, react, typescript, node.js",
  },
};

// Función para formatear fechas
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = [
    'ene', 'feb', 'mar', 'abr', 'may', 'jun',
    'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
}

export default async function Articulos(): Promise<JSX.Element> {
  const paginatedData = await getPublicPaginatedPosts(1);

  return (
    <>
      <BackToTop />
      <Header />
      <MobileHeader />

      {/* search area start */}
      <div className="tp-search-area p-relative z-index-1">
        <div className="tp-search-shape">
          <img src="/assets/img/blog/blog-masonry/search-shape.png" alt="" />
        </div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10">
              <div className="tp-search-wrapper text-center">
                <h3 className="tp-search-title">Buscar Artículos</h3>
                <p>Encuentra el contenido técnico que necesitas para crecer como desarrollador</p>
                <div className="tp-search-form">
                  <form>
                    <div className="tp-search-input-box">
                      <input type="text" placeholder="Buscar por título, tecnología o autor..." />
                      <button type="submit">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M17.5 17.5L13.875 13.875" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* search area end */}

      {/* offcanvas area start */}
      <div className="tp-offcanvas-area">
        <div className="tp-offcanvas-wrapper">
          <div className="tp-offcanvas-close">
            <button className="tp-offcanvas-close-btn">
              <i className="fal fa-times"></i>
            </button>
          </div>
          <div className="tp-offcanvas-content">
            <div className="tp-mobile-menu"></div>
          </div>
        </div>
      </div>
      <div className="body-overlay"></div>
      {/* offcanvas area end */}
    
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            {/* breadcurmb area start */}
            <div className="tp-breadcrumb-area tp-breadcrumb-ptb" data-background="/assets/img/blog/blog-masonry/blog-bradcum-bg.png">
              <div className="container container-1330">
                <div className="row justify-content-center">
                  <div className="col-xxl-12">
                    <div className="tp-blog-heading-wrap p-relative pb-130">
                      <span className="tp-section-subtitle pre tp_fade_anim">Artículos <svg xmlns="http://www.w3.org/2000/svg" width="81" height="9" viewBox="0 0 81 9" fill="none">
                          <rect y="4.04333" width="80" height="1" fill="white" />
                          <path d="M77 8.00783L80.5 4.52527L77 1.04271" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>

                      <h1 className="tp-blog-title tp_fade_anim smooth">Destacado <img src="/assets/img/blog/blog-masonry/blog-bradcum-shape.png" alt="" /> <br /> <a href="#down"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M9.99999 1V19M9.99999 19L1 10M9.99999 19L19 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg></a> de la semana...</h1>

                      <div className="tp-blog-shape">
                        <span><svg xmlns="http://www.w3.org/2000/svg" width="109" height="109" viewBox="0 0 109 109" fill="none">
                          <path d="M46.8918 0.652597C52.0111 11.5756 61.1509 45.3262 42.3414 57.6622C32.5453 63.8237 11.8693 68.6772 1.79348 40.7372C-2.00745 30.1973 6.53261 20.5828 26.243 25.965C37.6149 29.0703 65.0949 36.1781 78.8339 57.5398C86.0851 68.8141 93.074 92.3859 89.9278 107.942M89.9278 107.942C90.8943 100.431 95.9994 85.8585 108.687 87.6568M89.9278 107.942C90.4304 103.013 86.878 91.2724 68.6481 83.7468M63.5129 27.0092C68.0375 28.7613 82.5356 36.982 88.0712 51.886" stroke="white" strokeWidth="1.5" />
                        </svg></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* breadcurmb area end */}

            {/* blog masonry area start */}
            <InfiniteScrollBlog 
              initialPosts={paginatedData.posts}
              initialHasNextPage={paginatedData.hasNextPage}
              initialCurrentPage={paginatedData.currentPage}
            />
            {/* blog masonry area end */}
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}