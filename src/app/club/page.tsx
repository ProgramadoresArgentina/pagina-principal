import { JSX } from "react";
import { Metadata } from "next";
import BackToTop from "../components/BackToTop";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Programadores Argentina - Suscripción Club Exclusivo",
  description: "Únete al Club Programadores Argentina, la comunidad exclusiva para desarrolladores. Networking privado, oportunidades laborales exclusivas, material IT exclusivo, mentorías grupales y sorteos mensuales. Suscripción $4000/mes.",
  keywords: [
    "club programadores argentina",
    "comunidad exclusiva desarrolladores",
    "networking programadores argentina",
    "oportunidades laborales IT exclusivas",
    "material IT exclusivo argentina",
    "mentorías grupales programación",
    "sorteos programadores",
    "comunidad tech premium argentina",
    "suscripción programadores",
    "club desarrolladores argentina"
  ],
  authors: [{ name: "Programadores Argentina" }],
  creator: "Programadores Argentina",
  publisher: "Programadores Argentina",
  metadataBase: new URL("https://programadoresargentina.com"),
  alternates: {
    canonical: "/club",
  },
  openGraph: {
    title: "Programadores Argentina - Club Exclusivo",
    description: "Únete al Club Programadores Argentina, la comunidad exclusiva para desarrolladores. Networking privado, oportunidades laborales exclusivas y material IT exclusivo.",
    url: "https://programadoresargentina.com/club",
    siteName: "Programadores Argentina",
    images: [
      {
        url: "/assets/images/logo-club.png",
        width: 1200,
        height: 630,
        alt: "Programadores Argentina - Club Exclusivo",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Programadores Argentina - Club Exclusivo",
    description: "Únete al Club Programadores Argentina, la comunidad exclusiva para desarrolladores. Networking privado y oportunidades laborales exclusivas.",
    images: ["/assets/images/logo-club.png"],
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

export default function Club(): JSX.Element {
  return (
    <>
      <BackToTop />
      <Navigation />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            {/* hero area start */}
            <div className="it-about-area it-about-ptb pt-200 pb-90 p-relative">
              <div className="it-about-shape-wrap">
                <img data-speed="1.1" className="it-about-shape-1 d-none d-xxl-block" src="/assets/img/home-11/about/about-shape-1.png" alt="" style={{ translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 55.9091px)', willChange: 'transform' }} data-lag="0" />
                <img data-speed=".9" className="it-about-shape-2" src="/assets/img/home-11/about/about-shape-2.png" alt="" style={{ translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 9.00044px)', willChange: 'transform' }} data-lag="0" />
              </div>
              
              
              <div className="container container-1230">
                
              {/* Mensaje de confirmación después de suscripción - Full width arriba del título */}
              <div className="subscription-confirmation" style={{ 
                background: 'linear-gradient(135deg, #1a1b1e 0%, #2d2e32 100%)', 
                border: '1px solid #D0FF71', 
                borderRadius: '0px', 
                padding: '30px 20px', 
                margin: '0',
                display: 'none',
                width: '100%',
                position: 'relative',
                zIndex: 10
              }}>
                <div className="container container-1230">
                  <div className="confirmation-content text-center">
                    <div className="confirmation-icon mb-20">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#D0FF71' }}>
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h4 className="confirmation-title mb-15" style={{ color: '#D0FF71', fontSize: '24px', fontWeight: '600' }}>
                      ¡Suscripción Exitosa!
                    </h4>
                    <p className="confirmation-message mb-20" style={{ color: '#ffffff', fontSize: '18px', lineHeight: '1.6' }}>
                      Te estaremos contactando al email de MercadoPago en las próximas 24 horas con toda la información para acceder al Club.
                    </p>
                    <p className="confirmation-contact" style={{ color: '#D0FF71', fontSize: '16px', fontWeight: '500' }}>
                      ¿Tienes alguna consulta? Escríbenos a: 
                      <a href="mailto:programadoresargentina@gmail.com" style={{ color: '#D0FF71', textDecoration: 'underline', marginLeft: '5px' }}>
                        programadoresargentina@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
                <div className="row">
                  <div className="col-xl-6">
                    <div className="it-about-title-box z-index-2">
                      <h4 className="tp-section-title-platform platform-text-black fs-84 mb-30 pt-30 tp-split-text tp-split-right" style={{ perspective: '400px' }}>
                        <div className="tp-split-line" style={{ display: 'block', textAlign: 'start', position: 'relative' }}>
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>C</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>l</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>u</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>b</div>
                          </div>
                        </div>
                        <div className="tp-split-line" style={{ display: 'block', textAlign: 'start', position: 'relative' }}>
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>P</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>r</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>o</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>g</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>r</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>a</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>m</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>a</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>d</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>o</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>r</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>e</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>s</div>
                          </div>
                        </div>
                        <div className="tp-split-line" style={{ display: 'block', textAlign: 'start', position: 'relative' }}>
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>A</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>r</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>g</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>e</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>n</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>t</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>i</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>n</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>a</div>
                          </div>
                        </div>
                      </h4>
                      <div className="tp_text_anim">
                        <p style={{ perspective: '400px' }}>
                          Somos más de 60.000 profesionales unidos por la pasión por la tecnología y el aprendizaje constante.
                          Ahora damos un paso más: nace el Club de Programadores Argentina, un espacio exclusivo diseñado para potenciar tu crecimiento profesional y conectar con la comunidad de una manera más cercana y organizada.
                        </p>
                      </div>
                      <div className="tp_fade_anim" data-fade-from="top" data-ease="bounce" style={{ translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>
                        {/* <a className="tp-btn-black-radius btn-blue-bg d-inline-flex align-items-center justify-content-between mr-15" href="https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808497f5faa7019800406b1d03db&success_url=https://programadoresargentina.com/club?success=true&failure_url=https://programadoresargentina.com/club?success=false" data-name="MP-payButton">
                          <span>
                            <span className="text-1">Suscribirse por $4000 /mes</span>
                            <span className="text-2">Suscribirme</span>
                          </span>
                          <i>
                            <span>
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 11L11 1M11 1H1M11 1V11" stroke="#21212D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                              </svg>
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 11L11 1M11 1H1M11 1V11" stroke="#21212D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                              </svg>
                            </span>
                          </i>
                        </a> */}
                        <a className="tp-btn-black-radius btn-blue-bg d-inline-flex align-items-center justify-content-between mr-15" href="#" data-name="MP-payButton">
                          <span>
                            <span className="text-1">Suscribirse por $4000 /mes</span>
                            <span className="text-2">El club se encuentra lleno</span>
                          </span>
                          <i>
                            <span>
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 11L11 1M11 1H1M11 1V11" stroke="#21212D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                              </svg>
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 11L11 1M11 1H1M11 1V11" stroke="#21212D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                              </svg>
                            </span>
                          </i>
                        </a>
                      </div>
                      
                      
                      <script type="text/javascript" dangerouslySetInnerHTML={{
                        __html: `
                          (function() {
                          function $MPC_load() {
                              window.$MPC_loaded !== true && (function() {
                              var s = document.createElement("script");
                              s.type = "text/javascript";
                              s.async = true;
                              s.src = document.location.protocol + "//secure.mlstatic.com/mptools/render.js";
                              var x = document.getElementsByTagName('script')[0];
                              x.parentNode.insertBefore(s, x);
                              window.$MPC_loaded = true;
                          })();
                          }
                          window.$MPC_loaded !== true ? (window.attachEvent ? window.attachEvent('onload', $MPC_load) : window.addEventListener('load', $MPC_load, false)) : null;
                          })();
                        `
                      }} />
                    </div>
                  </div>
                  <div className="col-xl-6">
                    <div className="row align-items-end">
                      <div className="col-lg-6">
                        <div className="it-about-thumb">
                          <div className="p-relative">
                            <div className="it-about-thumb-inner mb-50">
                              <img className="m-0" data-speed=".9" src="/assets/images/logo-club.png" alt="" style={{ width: '100%' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* hero area end */}
            
            {/* benifit area start */}
            <div className="it-benifit-area p-relative pb-120">
              <div className="container container-1230">
                <div className="it-benifit-bg pt-120 pb-120 z-index-1" data-bg-color="#1A1B1E">
                  <div className="it-benifit-shape">
                    <img className="tp-zoom-in-out" src="/assets/img/home-11/feature/benifits-shape.png" alt="" />
                  </div>
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="it-benifit-title-box mb-55">
                        <span className="tp-section-subtitle-platform platform-text-black mb-20 tp-split-text tp-split-right">Beneficios</span>
                        <h4 className="tp-section-title-platform platform-text-black mb-20 tp-split-text tp-split-right">Un espacio de crecimiento y oportunidades</h4>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="it-benifit-item">
                        <div className="it-benifit-icon">
                          <span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        </div>
                        <div className="it-benifit-content">
                          <h4 className="it-benifit-title"><a href="#" style={{ color: 'goldenrod' }}>Canales de Networking Exclusivos</a></h4>
                          <p>
                            Acceso exclusivo a grupos privados para conectar con otros profesionales del sector. Moderados activamente para mantener la calidad de las conversaciones.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="it-benifit-item">
                        <div className="it-benifit-icon">
                          <span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20 7L10 2L2 7V20L10 25L20 20V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M10 2V25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M2 7L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M7 16H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        </div>
                        <div className="it-benifit-content">
                          <h4 className="it-benifit-title"><a href="#">Oportunidades Laborales</a></h4>
                          <p>
                            Nuestro sistema automatizado recibe ofertas laborales de LinkedIn, Google Jobs, comunidades y grupos privados.
                            Nuestro BOT puede emparejar estas ofertas con tus preferencias, enviándote notificaciones por WhatsApp cuando se encuentren oportunidades que coincidan con tu perfil.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="it-benifit-item">
                        <div className="it-benifit-icon">
                          <span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2 3H6A2 2 0 0 1 8 5V19A2 2 0 0 1 6 21H2A2 2 0 0 1 0 19V5A2 2 0 0 1 2 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M22 3H18A2 2 0 0 0 16 5V19A2 2 0 0 0 18 21H22A2 2 0 0 0 24 19V5A2 2 0 0 0 22 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M12 3H16A2 2 0 0 1 18 5V19A2 2 0 0 1 16 21H12A2 2 0 0 1 10 19V5A2 2 0 0 1 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        </div>
                        <div className="it-benifit-content">
                          <h4 className="it-benifit-title"><a href="#" style={{ color: 'goldenrod' }}>Material Exclusivo IT</a></h4>
                          <p>
                            Contenido exclusivo sobre tecnología y análisis del mercado tech argentino, actualizado semanalmente.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-50">
                    <div className="col-lg-4">
                      <div className="it-benifit-item">
                        <div className="it-benifit-icon">
                          <span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M19 3L19.5 4.5L21 5L19.5 5.5L19 7L18.5 5.5L17 5L18.5 4.5L19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M5 3L5.5 4.5L7 5L5.5 5.5L5 7L4.5 5.5L3 5L4.5 4.5L5 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        </div>
                        <div className="it-benifit-content">
                          <h4 className="it-benifit-title"><a href="#">Mentorías Grupales</a></h4>
                          <p>
                            Sesiones de mentoría en grupo donde podrás resolver dudas técnicas, recibir feedback y aprender de la experiencia de otros desarrolladores.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="it-benifit-item">
                        <div className="it-benifit-icon">
                          <span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M12 18V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M4.93 4.93L7.76 7.76" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M16.24 16.24L19.07 19.07" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M2 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M18 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M4.93 19.07L7.76 16.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                          </span>
                        </div>
                        <div className="it-benifit-content">
                          <h4 className="it-benifit-title"><a href="#" style={{ color: 'goldenrod' }}>Sorteo Mensual</a></h4>
                          <p>
                            Todos los meses realizamos un sorteo de cursos, libros técnicos o herramientas de desarrollo exclusivas para miembros del club.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="it-benifit-item">
                        <div className="it-benifit-icon">
                          <span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                        </div>
                        <div className="it-benifit-content">
                          <h4 className="it-benifit-title"><a href="#">Apoyo a la Comunidad IT</a></h4>
                          <p>
                            Contribuye al crecimiento de la comunidad tecnológica argentina compartiendo conocimiento y apoyando a otros desarrolladores en su camino profesional.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* benifit area end */}

            {/* faq area start */}
            <div className="app-faq-area p-relative pb-120">
              <div className="it-faq-shape-1">
                <img data-speed=".9" src="/assets/img/home-11/faq/faq-1.png" alt="" />
              </div>
              <div className="container container-1230">
                <div className="row">
                  <div className="col-lg-4">
                    <div className="app-faq-heading p-relative mb-40">
                      <span className="tp-section-subtitle border-bg bg-color">FAQ</span>
                      <h3 className="tp-section-title-platform platform-text-black fs-84 tp-split-text tp-split-right mb-70">Tienes <br />preguntas?</h3>
                      <img data-speed="1.1" className="it-faq-shape-2" src="/assets/img/home-11/faq/faq-2.png" alt="" />
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="app-faq-wrap pl-70 z-index-1 tp_fade_anim" data-fade-from="right">
                      <div className="ai-faq-accordion-wrap">
                        <div className="accordion" id="accordionExample1">
                          <div className="accordion-items">
                            <h2 className="accordion-header">
                              <button className="accordion-buttons" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne1" aria-expanded="true" aria-controls="collapseOne1">
                                ¿Qué es el Club Programadores Argentina?
                                <span className="accordion-icon"></span>
                              </button>
                            </h2>
                            <div id="collapseOne1" className="accordion-collapse collapse show" data-bs-parent="#accordionExample1">
                              <div className="accordion-body">
                                <p>
                                  El Club Programadores Argentina es una comunidad exclusiva para desarrolladores, diseñadores y profesionales de la tecnología en Argentina. Es un ambiente aislado de la comunidad donde los miembros comparten material exclusivo y de gran valor.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="accordion-items">
                            <h2 className="accordion-header">
                              <button className="accordion-buttons collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo2" aria-expanded="false" aria-controls="collapseTwo2">
                                ¿Cómo funciona la suscripción mensual?
                                <span className="accordion-icon"></span>
                              </button>
                            </h2>
                            <div id="collapseTwo2" className="accordion-collapse collapse" data-bs-parent="#accordionExample1">
                              <div className="accordion-body">
                                <p>
                                  La suscripción es mensual y se renueva automáticamente. Puedes cancelar en cualquier momento desde tu cuenta de MercadoPago. El acceso al club se activa inmediatamente después del pago.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="accordion-items">
                            <h2 className="accordion-header">
                              <button className="accordion-buttons collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree3" aria-expanded="false" aria-controls="collapseThree3">
                                ¿Qué tipo de contenido exclusivo recibo?
                                <span className="accordion-icon"></span>
                              </button>
                            </h2>
                            <div id="collapseThree3" className="accordion-collapse collapse" data-bs-parent="#accordionExample1">
                              <div className="accordion-body">
                                <p>
                                  Recibes análisis del mercado tech argentino, tendencias tecnológicas, guías de desarrollo, recursos exclusivos, y acceso a webinars y eventos especiales solo para miembros del club.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="accordion-items">
                            <h2 className="accordion-header">
                              <button className="accordion-buttons collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour4" aria-expanded="false" aria-controls="collapseFour4">
                                ¿Qué tipo de oportunidades laborales ofrecen?
                                <span className="accordion-icon"></span>
                              </button>
                            </h2>
                            <div id="collapseFour4" className="accordion-collapse collapse" data-bs-parent="#accordionExample1">
                              <div className="accordion-body">
                                <p>
                                  Publicamos ofertas de trabajo exclusivas todas las semanas. 
                                  Las posiciones publicadas son principalmente para desarrolladores y van de juniors a senior. Empresas suelen compartir oportunidades por
                                  privado a nuestra comunidad. Además contamos con un BOT automático donde recibirás nuevas oportunidades directamente en tu mail.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="accordion-items">
                            <h2 className="accordion-header">
                              <button className="accordion-buttons collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive5" aria-expanded="false" aria-controls="collapseFive5">
                                ¿Puedo cancelar mi suscripción en cualquier momento?
                                <span className="accordion-icon"></span>
                              </button>
                            </h2>
                            <div id="collapseFive5" className="accordion-collapse collapse" data-bs-parent="#accordionExample1">
                              <div className="accordion-body">
                                <p>
                                  Puedes cancelar en cualquier momento desde tu cuenta de Mercado Pago. Mantendrás acceso hasta el final del período pagado.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="accordion-items">
                            <h2 className="accordion-header">
                              <button className="accordion-buttons collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSeven7" aria-expanded="false" aria-controls="collapseSeven7">
                                ¿Cómo me uno a los canales privados?
                                <span className="accordion-icon"></span>
                              </button>
                            </h2>
                            <div id="collapseSeven7" className="accordion-collapse collapse" data-bs-parent="#accordionExample1">
                              <div className="accordion-body">
                                <p>
                                  Una vez que te suscribas, recibirás un enlace de invitación privado a tu mail. Allí tendrás acceso a canales específicos por tecnología, networking, ofertas laborales y eventos, con moderación activa para mantener la calidad de las conversaciones.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="accordion-items">
                            <h2 className="accordion-header">
                              <button className="accordion-buttons collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEight8" aria-expanded="false" aria-controls="collapseEight8">
                                ¿Puedo ser expulsado del club?
                                <span className="accordion-icon"></span>
                              </button>
                            </h2>
                            <div id="collapseEight8" className="accordion-collapse collapse" data-bs-parent="#accordionExample1">
                              <div className="accordion-body">
                                <p>
                                  Si, nuestros canales privados cuentan con reglas de conducta. Si se violan repetidamente, serás expulsado y no tendrás acceso al club (el dinero que pagaste no será reembolsado).
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="accordion-items">
                            <h2 className="accordion-header">
                              <button className="accordion-buttons collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNine9" aria-expanded="false" aria-controls="collapseNine9">
                                ¿Existe algún sistema de reembolso o período de prueba?
                                <span className="accordion-icon"></span>
                              </button>
                            </h2>
                            <div id="collapseNine9" className="accordion-collapse collapse" data-bs-parent="#accordionExample1">
                              <div className="accordion-body">
                                <p>
                                  No, actualmente no contamos con ningún sistema de reembolso o período de prueba.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* faq area end */}
          </main>
          
          <Footer />
        </div>
      </div>
    </>
  );
}
