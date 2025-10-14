import { JSX } from "react";
import { Metadata } from "next";
import BackToTop from "../../components/BackToTop";
import Header from "../../components/Header";
import MobileHeader from "../../components/MobileHeader";
import Footer from "../../components/Footer";
import BooksList from "./components/BooksList";

export const metadata: Metadata = {
  title: "Libros Exclusivos - Club Programadores Argentina",
  description: "Accede a nuestra biblioteca exclusiva de libros técnicos y recursos de programación disponibles solo para miembros del Club Programadores Argentina.",
  keywords: [
    "libros programación",
    "libros técnicos argentina",
    "recursos programación",
    "biblioteca digital programadores",
    "libros desarrollo software",
    "material exclusivo programación"
  ],
  authors: [{ name: "Programadores Argentina" }],
  creator: "Programadores Argentina",
  publisher: "Programadores Argentina",
  metadataBase: new URL("https://programadoresargentina.com"),
  alternates: {
    canonical: "/club/libros",
  },
  openGraph: {
    title: "Libros Exclusivos - Club Programadores Argentina",
    description: "Accede a nuestra biblioteca exclusiva de libros técnicos y recursos de programación.",
    url: "https://programadoresargentina.com/club/libros",
    siteName: "Programadores Argentina",
    images: [
      {
        url: "/assets/images/logo-club.png",
        width: 1200,
        height: 630,
        alt: "Libros Exclusivos - Club Programadores Argentina",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Libros Exclusivos - Club Programadores Argentina",
    description: "Accede a nuestra biblioteca exclusiva de libros técnicos y recursos de programación.",
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

export default function ClubLibros(): JSX.Element {
  return (
    <>
      <BackToTop />
      <Header />
      <MobileHeader />

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
                <div className="row">
                  <div className="col-xl-12">
                    <div className="it-about-title-box z-index-2 text-center">
                      <h4 className="tp-section-title-platform platform-text-black fs-84 mb-30 pt-30 tp-split-text tp-split-right" style={{ perspective: '400px' }}>
                        <div className="tp-split-line" style={{ display: 'block', textAlign: 'center', position: 'relative' }}>
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>L</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>i</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>b</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>r</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>o</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>s</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}> </div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>E</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>x</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>c</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>l</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>u</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>s</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>i</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>v</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>o</div>
                            <div style={{ position: 'relative', display: 'inline-block', translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>s</div>
                          </div>
                        </div>
                      </h4>
                      <div className="tp_text_anim">
                        <p style={{ perspective: '400px', maxWidth: '800px', margin: '0 auto' }}>
                          Accede a nuestra biblioteca exclusiva de libros técnicos y recursos de programación. 
                          Una colección cuidadosamente seleccionada de materiales que te ayudarán a crecer profesionalmente.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* hero area end */}
            
            {/* books area start */}
            <div className="it-benifit-area p-relative pb-120">
              <div className="container container-1230">
                <div className="it-benifit-bg pt-120 pb-120 z-index-1" data-bg-color="#1A1B1E">
                  <div className="it-benifit-shape">
                    <img className="tp-zoom-in-out" src="/assets/img/home-11/feature/benifits-shape.png" alt="" />
                  </div>
                  <div className="row">
                    <div className="col-xl-12">
                      <div className="it-benifit-title-box mb-55 text-center">
                        <span className="tp-section-subtitle-platform platform-text-black mb-20 tp-split-text tp-split-right">Biblioteca Digital</span>
                        <h4 className="tp-section-title-platform platform-text-black mb-20 tp-split-text tp-split-right">Explora nuestra colección</h4>
                      </div>
                    </div>
                  </div>
                  
                  <BooksList />
                </div>
              </div>
            </div>
            {/* books area end */}
          </main>
          
          <Footer />
        </div>
      </div>
    </>
  );
}
