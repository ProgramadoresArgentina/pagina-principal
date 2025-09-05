import { JSX } from "react";
import { Metadata } from "next";
import BackToTop from "./components/BackToTop";
import Header from "./components/Header";
import MobileHeader from "./components/MobileHeader";
import PublicGroups from "./components/PublicGroups";
import Footer from "./components/Footer";
import StructuredData from "./components/StructuredData";

export const metadata: Metadata = {
  title: "Programadores Argentina - Comunidad de Desarrolladores | +60.000 Miembros",
  description: "Únete a la comunidad más grande de programadores de Argentina. +60.000 desarrolladores, artículos técnicos, oportunidades laborales, networking y crecimiento profesional en tecnología.",
  keywords: [
    "programadores argentina",
    "desarrolladores argentina", 
    "comunidad tech argentina",
    "programación argentina",
    "desarrollo software argentina",
    "networking programadores",
    "oportunidades laborales IT",
    "comunidad desarrolladores",
    "tech argentina",
    "programadores comunidad"
  ],
  authors: [{ name: "Programadores Argentina" }],
  creator: "Programadores Argentina",
  publisher: "Programadores Argentina",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://programadoresargentina.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Programadores Argentina - Comunidad de Desarrolladores",
    description: "Únete a la comunidad más grande de programadores de Argentina. +60.000 desarrolladores, artículos técnicos, oportunidades laborales y networking.",
    url: "https://programadoresargentina.com",
    siteName: "Programadores Argentina",
    images: [
      {
        url: "/assets/images/LogoProgramadoresArgentina.webp",
        width: 1200,
        height: 630,
        alt: "Programadores Argentina - Comunidad de Desarrolladores",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Programadores Argentina - Comunidad de Desarrolladores",
    description: "Únete a la comunidad más grande de programadores de Argentina. +60.000 desarrolladores, artículos técnicos y oportunidades laborales.",
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
  verification: {
    google: "tu-google-verification-code",
  },
};

export default function Home(): JSX.Element {
  return (
    <>
      <StructuredData 
        type="Organization" 
        data={{}} 
      />
      <StructuredData 
        type="WebSite" 
        data={{}} 
      />
      <BackToTop />
      <Header />
      <MobileHeader />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <div className="ar-hero-area pp-service-2 p-relative pb-45" data-background="/assets/img/blog/blog-masonry/blog-bradcum-bg.png">
              <div className="tp-career-shape-1" style={{ top: '70%', right: '10%' }}>
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="84" height="84" viewBox="0 0 84 84" fill="none">
                    <path d="M36.3761 0.5993C40.3065 8.98556 47.3237 34.898 32.8824 44.3691C25.3614 49.0997 9.4871 52.826 1.7513 31.3747C-1.16691 23.2826 5.38982 15.9009 20.5227 20.0332C29.2536 22.4173 50.3517 27.8744 60.9 44.2751C66.4672 52.9311 71.833 71.0287 69.4175 82.9721M69.4175 82.9721C70.1596 77.2054 74.079 66.0171 83.8204 67.3978M69.4175 82.9721C69.8033 79.1875 67.076 70.1737 53.0797 64.3958M49.1371 20.8349C52.611 22.1801 63.742 28.4916 67.9921 39.9344" stroke="#ffffff" strokeWidth="1.5" />
                  </svg>
                </span>
              </div>
              <div className="ar-about-us-4-shape">
                <img src="/assets/images/logo-club.png" alt="Logo Club Programadores Argentina" width="210" height="290" />
              </div>
              <div className="container container-1830">
                <div className="row justify-content-center">
                  <div className="col-xl-12">
                    <div className="pp-service-2-title-box">
                      <h3 className="ar-about-us-4-title tp-char-animation display-1">Comunidad<br />
                        Programadores<br />Argentina <img className="tp_fade_anim" style={{ borderRadius: '5px', marginBottom: '10px', marginLeft: '10px' }} data-delay="2.5" data-fade-from="top" data-ease="bounce" src="/assets/images/argentina-flag.webp" alt="Bandera Argentina" width="58" height="42" /></h3>
                    </div>
                  </div>
                </div><div className="it-hero-btn-box d-flex align-items-center flex-wrap">
                  <div className="tp_fade_anim" data-delay=".5" data-fade-from="top" data-ease="bounce">
                    <a className="tp-btn-black-radius btn-blue-bg  d-inline-flex align-items-center justify-content-between mr-15" href="/club">
                      <span>
                        <span className="text-1">Unirse al Club</span>
                        <span className="text-2">Unirme!</span>
                      </span>
                      <i>
                        <span>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 11L11 1M11 1H1M11 1V11" stroke="#21212D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 11L11 1M11 1H1M11 1V11" stroke="#21212D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </i>
                    </a>
                  </div>
                  <div className="tp_fade_anim" data-delay=".7" data-fade-from="top" data-ease="bounce">
                    <a className="tp-btn-black-radius btn-blue-bg btn-border d-inline-flex align-items-center justify-content-between" href="contact-us-dark.html">
                      <span>
                        <span className="text-1">Contactarnos</span>
                        <span className="text-2">Contactar</span>
                      </span>
                      <i>
                        <span>
                          <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 2.5C16 1.675 15.325 1 14.5 1H2.5C1.675 1 1 1.675 1 2.5M16 2.5V11.5C16 12.325 15.325 13 14.5 13H2.5C1.675 13 1 12.325 1 11.5V2.5M16 2.5L8.5 7.75L1 2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 2.5C16 1.675 15.325 1 14.5 1H2.5C1.675 1 1 1.675 1 2.5M16 2.5V11.5C16 12.325 15.325 13 14.5 13H2.5C1.675 13 1 12.325 1 11.5V2.5M16 2.5L8.5 7.75L1 2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </i>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pp-brand-area ar-brand-style">
              <div className="tp-brand-wrapper z-index-1">
                <div className="swiper-container tp-brand-active swiper-initialized swiper-horizontal swiper-pointer-events">
                  <div className="swiper-wrapper slide-transtion" id="swiper-wrapper-109618055a3598e4c" aria-live="off" style={{ transitionDuration: '12000ms', transform: 'translate3d(-2488.96px, 0px, 0px)' }}><div className="swiper-slide swiper-slide-duplicate" data-swiper-slide-index="0" role="group" aria-label="1 / 5" style={{ marginRight: '30px' }}>
                    <div className="pp-brand-item">
                      <span className="pp-brand-title">DESARROLLADORES</span>
                      <span className="pp-brand-icon"><svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M16.384 0H14.2411V12.4133L5.46352 3.63578L3.94829 5.15102L12.7258 13.9286H0.3125V16.0715H12.7258L3.94829 24.849L5.46352 26.3642L14.2411 17.5866V30H16.384V17.5866L25.1615 26.3642L26.6767 24.849L17.8991 16.0715H30.3125V13.9286H17.8991L26.6767 5.151L25.1615 3.63578L16.384 12.4133V0Z" fill="#FFF669"></path>
                      </svg></span>
                    </div>
                  </div>
                    <div className="swiper-slide swiper-slide-prev" data-swiper-slide-index="2" role="group" aria-label="3 / 5" style={{ marginRight: '30px' }}>
                      <div className="pp-brand-item">
                        <span className="pp-brand-title">RECLUTADORES</span>
                        <span className="pp-brand-icon"><svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M16.384 0H14.2411V12.4133L5.46352 3.63578L3.94829 5.15102L12.7258 13.9286H0.3125V16.0715H12.7258L3.94829 24.849L5.46352 26.3642L14.2411 17.5866V30H16.384V17.5866L25.1615 26.3642L26.6767 24.849L17.8991 16.0715H30.3125V13.9286H17.8991L26.6767 5.151L25.1615 3.63578L16.384 12.4133V0Z" fill="#FFF669"></path>
                        </svg></span>
                      </div>
                    </div>
                    <div className="swiper-slide swiper-slide-active" data-swiper-slide-index="3" role="group" aria-label="4 / 5" style={{ marginRight: '30px' }}>
                      <div className="pp-brand-item">
                        <span className="pp-brand-title">CIBERSEGURIDAD</span>
                        <span className="pp-brand-icon"><svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M16.384 0H14.2411V12.4133L5.46352 3.63578L3.94829 5.15102L12.7258 13.9286H0.3125V16.0715H12.7258L3.94829 24.849L5.46352 26.3642L14.2411 17.5866V30H16.384V17.5866L25.1615 26.3642L26.6767 24.849L17.8991 16.0715H30.3125V13.9286H17.8991L26.6767 5.151L25.1615 3.63578L16.384 12.4133V0Z" fill="#FFF669"></path>
                        </svg></span>
                      </div>
                    </div>
                    <div className="swiper-slide swiper-slide-next" data-swiper-slide-index="4" role="group" aria-label="5 / 5" style={{ marginRight: '30px' }}>
                      <div className="pp-brand-item">
                        <span className="pp-brand-title">DISEÑADORES</span>
                        <span className="pp-brand-icon"><svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M16.384 0H14.2411V12.4133L5.46352 3.63578L3.94829 5.15102L12.7258 13.9286H0.3125V16.0715H12.7258L3.94829 24.849L5.46352 26.3642L14.2411 17.5866V30H16.384V17.5866L25.1615 26.3642L26.6767 24.849L17.8991 16.0715H30.3125V13.9286H17.8991L26.6767 5.151L25.1615 3.63578L16.384 12.4133V0Z" fill="#FFF669"></path>
                        </svg></span>
                      </div>
                    </div>
                    <div className="swiper-slide swiper-slide-duplicate" data-swiper-slide-index="0" role="group" aria-label="1 / 5" style={{ marginRight: '30px' }}>
                      <div className="pp-brand-item">
                        <span className="pp-brand-title">EMPRENDEDORES</span>
                        <span className="pp-brand-icon"><svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M16.384 0H14.2411V12.4133L5.46352 3.63578L3.94829 5.15102L12.7258 13.9286H0.3125V16.0715H12.7258L3.94829 24.849L5.46352 26.3642L14.2411 17.5866V30H16.384V17.5866L25.1615 26.3642L26.6767 24.849L17.8991 16.0715H30.3125V13.9286H17.8991L26.6767 5.151L25.1615 3.63578L16.384 12.4133V0Z" fill="#FFF669"></path>
                        </svg></span>
                      </div>
                    </div><div className="swiper-slide swiper-slide-duplicate" data-swiper-slide-index="1" role="group" aria-label="2 / 5" style={{ marginRight: '30px' }}>
                      <div className="pp-brand-item">
                        <span className="pp-brand-title">LIDERES</span>
                        <span className="pp-brand-icon"><svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M16.384 0H14.2411V12.4133L5.46352 3.63578L3.94829 5.15102L12.7258 13.9286H0.3125V16.0715H12.7258L3.94829 24.849L5.46352 26.3642L14.2411 17.5866V30H16.384V17.5866L25.1615 26.3642L26.6767 24.849L17.8991 16.0715H30.3125V13.9286H17.8991L26.6767 5.151L25.1615 3.63578L16.384 12.4133V0Z" fill="#FFF669"></path>
                        </svg></span>
                      </div>
                    </div><div className="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-prev" data-swiper-slide-index="2" role="group" aria-label="3 / 5" style={{ marginRight: '30px' }}>
                      <div className="pp-brand-item">
                        <span className="pp-brand-title">INTELIGENCIA ARTIFICIAL</span>
                        <span className="pp-brand-icon"><svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M16.384 0H14.2411V12.4133L5.46352 3.63578L3.94829 5.15102L12.7258 13.9286H0.3125V16.0715H12.7258L3.94829 24.849L5.46352 26.3642L14.2411 17.5866V30H16.384V17.5866L25.1615 26.3642L26.6767 24.849L17.8991 16.0715H30.3125V13.9286H17.8991L26.6767 5.151L25.1615 3.63578L16.384 12.4133V0Z" fill="#FFF669"></path>
                        </svg></span>
                      </div>
                    </div><div className="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-active" data-swiper-slide-index="3" role="group" aria-label="4 / 5" style={{ marginRight: '30px' }}>
                      <div className="pp-brand-item">
                        <span className="pp-brand-title">CEOs</span>
                        <span className="pp-brand-icon"><svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M16.384 0H14.2411V12.4133L5.46352 3.63578L3.94829 5.15102L12.7258 13.9286H0.3125V16.0715H12.7258L3.94829 24.849L5.46352 26.3642L14.2411 17.5866V30H16.384V17.5866L25.1615 26.3642L26.6767 24.849L17.8991 16.0715H30.3125V13.9286H17.8991L26.6767 5.151L25.1615 3.63578L16.384 12.4133V0Z" fill="#FFF669"></path>
                        </svg></span>
                      </div>
                    </div><div className="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-next" data-swiper-slide-index="4" role="group" aria-label="5 / 5" style={{ marginRight: '30px' }}>
                      <div className="pp-brand-item">
                        <span className="pp-brand-title">DATA</span>
                        <span className="pp-brand-icon"><svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M16.384 0H14.2411V12.4133L5.46352 3.63578L3.94829 5.15102L12.7258 13.9286H0.3125V16.0715H12.7258L3.94829 24.849L5.46352 26.3642L14.2411 17.5866V30H16.384V17.5866L25.1615 26.3642L26.6767 24.849L17.8991 16.0715H30.3125V13.9286H17.8991L26.6767 5.151L25.1615 3.63578L16.384 12.4133V0Z" fill="#FFF669"></path>
                        </svg></span>
                      </div>
                    </div></div>
                  <span className="swiper-notification" aria-live="assertive" aria-atomic="true"></span></div>
              </div>
            </div>

            <PublicGroups />

            <div className="pp-about-area pp-about-ptb p-relative pt-160 pb-160">
              <div className="pp-about-shape">
                <img data-speed=".8" src="/assets/img/home-14/about/about-shape.png" alt="" style={{ translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, -44.3991px)', willChange: 'transform' }} data-lag="0" />
              </div>
              <div className="container container-1430">
                <div className="row">
                  <div className="col-lg-3">
                    <div className="pp-about-left">
                      <span className="tp-section-subtitle-clash clash-subtitle-pos body-ff">
                        OBJETIVO
                        <i>
                          <svg width="102" height="9" viewBox="0 0 102 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M98 8L101.5 4.5L98 1M1 4H101V5H1V4Z" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </i>
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-9">
                    <div className="pp-about-heading pb-55">
                      <h3 className="tp-section-title-teko fs-80 tp_fade_anim" style={{ translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>
                        Un <span>Espacio de Conexión</span> <br />
                        con profesionales de la región
                      </h3>
                    </div>
                    <div className="pp-about-wrap">
                      <div className="pp-about-content tp_text_anim">
                        <p style={{ perspective: '400px' }}>
                          Programadores Argentina intenta fomentar la comunicación y educación IT en Argentina. Conectamos programadores y todos los talentos tech (testers, Scrum Masters, ciberseguridad, etc.).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="tp-video-area black-bg mt-120 fix">
              <div className="container-fluid p-0">
                <div className="tp-video-thumb-wrap">
                  <div className="tp-video-thumb d-none d-xl-block">
                    <img src="/assets/images/pic-3.webp" alt="" height="500" />
                  </div>
                  <div className="tp-video-thumb mb-25">
                    <video loop muted autoPlay playsInline>
                      <source src="/assets/images/banner-landing-programadoresargentina.mp4" type="video/mp4" />
                    </video>
                  </div>
                  <div className="tp-video-thumb d-none d-md-flex justify-content-center align-items-center mb-25">
                    <img src="/assets/images/pc-programadoresargentina.webp" alt="" style={{ height: '300px', objectFit: 'contain' }} />
                  </div>
                  <div className="tp-video-thumb d-none d-md-flex justify-content-center align-items-center mb-25">
                    <img src="/assets/images/juguito-programadoresargentina.webp" alt="" style={{ height: '300px', objectFit: 'contain' }} />
                  </div>
                  <div className="tp-video-thumb d-none d-xl-block">
                    <img src="/assets/images/pic-2.webp" alt="" />
                  </div>
                  <div className="tp-video-thumb d-none d-xl-block mb-25">
                    <img src="/assets/images/pic-1.webp" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}
