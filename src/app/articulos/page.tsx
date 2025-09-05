import { JSX } from "react";
import { Metadata } from "next";
import BackToTop from "../components/BackToTop";
import Header from "../components/Header";
import MobileHeader from "../components/MobileHeader";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Artículos y Blog de Programadores Argentina | Contenido Técnico Exclusivo",
  description: "Descubre los mejores artículos técnicos de la comunidad de programadores argentina. Tutoriales, análisis de mercado tech, guías de desarrollo y contenido exclusivo para desarrolladores.",
  keywords: [
    "artículos programación argentina",
    "blog desarrolladores argentina",
    "tutoriales programación",
    "contenido técnico argentina",
    "guías desarrollo software",
    "análisis mercado tech argentina",
    "blog programadores",
    "artículos tecnología argentina",
    "contenido exclusivo desarrolladores",
    "tutoriales tech argentina"
  ],
  authors: [{ name: "Programadores Argentina" }],
  creator: "Programadores Argentina",
  publisher: "Programadores Argentina",
  metadataBase: new URL("https://programadoresargentina.com"),
  alternates: {
    canonical: "/articulos",
  },
  openGraph: {
    title: "Artículos y Blog de Programadores Argentina",
    description: "Descubre los mejores artículos técnicos de la comunidad de programadores argentina. Tutoriales, análisis de mercado tech y guías de desarrollo.",
    url: "https://programadoresargentina.com/articulos",
    siteName: "Programadores Argentina",
    images: [
      {
        url: "/assets/images/LogoProgramadoresArgentina.webp",
        width: 1200,
        height: 630,
        alt: "Artículos y Blog de Programadores Argentina",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Artículos y Blog de Programadores Argentina",
    description: "Descubre los mejores artículos técnicos de la comunidad de programadores argentina. Tutoriales y análisis de mercado tech.",
    images: ["/assets/images/LogoProgramadoresArgentina.webp"],
    creator: "@programadores_argentina",
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
};

export default function Articulos(): JSX.Element {
  return (
    <>
      <BackToTop />
      <Header />
      <MobileHeader />

      <div className="tp-search-area search-black p-relative">
        <div className="tp-search-close">
          <button className="tp-search-close-btn">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="path-1" d="M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path className="path-2" d="M1 1L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="container container-1230">
          <div className="row">
            <div className="tp-search-wrapper">
              <div className="col-lg-8">
                <div className="tp-search-content">
                  <div className="search p-relative">
                    <input type="text" className="search-input" placeholder="Search" />
                    <button className="tp-search-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18.0508 18.05L23.0009 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M20.8004 10.9C20.8004 5.43237 16.3679 1 10.9002 1C5.43246 1 1 5.43237 1 10.9C1 16.3676 5.43246 20.7999 10.9002 20.7999C16.3679 20.7999 20.8004 16.3676 20.8004 10.9Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
     
      <div className="tp-offcanvas-area">
        <div className="tp-offcanvas-wrapper offcanvas-black-bg">
          <div className="tp-offcanvas-top d-flex align-items-center justify-content-between">
            <div className="tp-offcanvas-logo">
              <a href="/">
                <img className="logo-1" data-width="120" src="/assets/images/logo.png" alt="Logo Comunidad Programadores Argentina" />
                <img className="logo-2" data-width="120" src="/assets/images/logo.png" alt="Logo Comunidad Programadores Argentina" />
              </a>
            </div>
            <div className="tp-offcanvas-close">
              <button className="tp-offcanvas-close-btn">
                <svg width="37" height="38" viewBox="0 0 37 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.19141 9.80762L27.5762 28.1924" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9.19141 28.1924L27.5762 9.80761" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
          <div className="tp-offcanvas-main">
            <div className="tp-offcanvas-content d-none d-xl-block">
              <h3 className="tp-offcanvas-title">Hello There!</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, </p>
            </div>
            <div className="tp-offcanvas-menu d-xl-none">
              <nav></nav>
            </div>
            <div className="tp-offcanvas-gallery d-none d-xl-block">
              <div className="row gx-2">
                <div className="col-md-3 col-3">
                  <div className="tp-offcanvas-gallery-img fix">
                    <a className="popup-image" href="/assets/img/offcanvas/offcanvas-1.jpg"><img src="/assets/img/offcanvas/offcanvas-1.jpg" alt="" /></a>
                  </div>
                </div>
                <div className="col-md-3 col-3">
                  <div className="tp-offcanvas-gallery-img fix">
                    <a className="popup-image" href="/assets/img/offcanvas/offcanvas-2.jpg"><img src="/assets/img/offcanvas/offcanvas-2.jpg" alt="" /></a>
                  </div>
                </div>
                <div className="col-md-3 col-3">
                  <div className="tp-offcanvas-gallery-img fix">
                    <a className="popup-image" href="/assets/img/offcanvas/offcanvas-3.jpg"><img src="/assets/img/offcanvas/offcanvas-3.jpg" alt="" /></a>
                  </div>
                </div>
                <div className="col-md-3 col-3">
                  <div className="tp-offcanvas-gallery-img fix">
                    <a className="popup-image" href="/assets/img/offcanvas/offcanvas-4.jpg"><img src="/assets/img/offcanvas/offcanvas-4.jpg" alt="" /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="body-overlay"></div>

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

                      <h3 className="tp-blog-title tp_fade_anim smooth">Destacado <img src="/assets/img/blog/blog-masonry/blog-bradcum-shape.png" alt="" /> <br /> <a href="#down"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M9.99999 1V19M9.99999 19L1 10M9.99999 19L19 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg></a> de la semana...</h3>

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
            <div id="down" className="tp-blog-masonry-ptb pb-70">
              <div className="container container-1330">
                <div className="row grid">
                  <div className="col-lg-4 col-md-6 grid-item">
                    <div className="tp-blog-masonry-item mb-30">
                      <div className="tp-blog-masonry-item-top d-flex justify-content-between align-items-center mb-30">
                        <div className="tp-blog-masonry-item-user d-flex align-items-center">
                          <div className="tp-blog-masonry-item-user-thumb">
                            <img src="/assets/images/perfiles/juansemastrangelo.jpg" width="50" height="50" alt="Juanse Mastrangelo" />
                          </div>
                          <div className="tp-blog-masonry-item-user-content">
                            <span>Juanse Mastrangelo</span>
                            <p>Administrador</p>
                          </div>
                        </div>
                      </div>
                      <div className="tp-blog-masonry-thumb mb-30">
                        <a href="/articulos/nueva-arquitectura-HNET"><img src="/assets/images/articulos/nueva-arquitectura-HNET/imagen.webp" alt="Nueva Arquitectura HNET" /></a>
                      </div>
                      <div className="tp-blog-masonry-content">
                        <div className="tp-blog-masonry-tag mb-15">
                          <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
                              <path d="M4.39012 4.13048H4.39847M13.6056 8.14369L8.74375 12.6328C8.6178 12.7492 8.46823 12.8415 8.30359 12.9046C8.13896 12.9676 7.96248 13 7.78426 13C7.60604 13 7.42956 12.9676 7.26493 12.9046C7.10029 12.8415 6.95072 12.7492 6.82477 12.6328L1 7.2609V1H7.78087L13.6056 6.37811C13.8582 6.61273 14 6.93009 14 7.2609C14 7.59171 13.8582 7.90908 13.6056 8.14369Z" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Inteligencia Artificial
                          </span>
                        </div>
                        <h4 className="tp-blog-masonry-title">
                          <a className="tp-line-white" href="/articulos/nueva-arquitectura-HNET">
                            Nueva Arquitectura HNET
                          </a>
                        </h4>
                        <div className="tp-blog-masonry-btn">
                          <a href="/articulos/nueva-arquitectura-HNET">
                            Leer más
                            <span>
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M1 11L11 1M11 1H1M11 1V11" stroke="#D0FF71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M1 11L11 1M11 1H1M11 1V11" stroke="#D0FF71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* blog masonry area end */}
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}
