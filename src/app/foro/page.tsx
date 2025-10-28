import { JSX } from "react";
import { Metadata } from "next";
import BackToTop from "../components/BackToTop";
import Header from "../components/Header";
import MobileHeader from "../components/MobileHeader";
import Footer from "../components/Footer";
import ForumPageContent from "@/app/components/ForumPageContent";
import CreatePostButton from "../components/CreatePostButton";

export const metadata: Metadata = {
  title: "Foro Programadores Argentina - Comunidad de Desarrolladores",
  description: "Participa en el foro de Programadores Argentina. Comparte conocimientos, resuelve dudas técnicas y conecta con otros desarrolladores de la comunidad.",
  keywords: [
    "foro programadores argentina",
    "comunidad desarrolladores argentina",
    "discusiones técnicas argentina",
    "ayuda programación argentina",
    "foro tech argentina",
    "comunidad IT argentina",
    "programadores foro",
    "desarrolladores comunidad"
  ],
  authors: [{ name: "Programadores Argentina" }],
  creator: "Programadores Argentina",
  publisher: "Programadores Argentina",
  metadataBase: new URL("https://programadoresargentina.com"),
  alternates: {
    canonical: "/foro",
  },
  openGraph: {
    title: "Foro Programadores Argentina - Comunidad de Desarrolladores",
    description: "Participa en el foro de Programadores Argentina. Comparte conocimientos y conecta con otros desarrolladores.",
    url: "https://programadoresargentina.com/foro",
    siteName: "Programadores Argentina",
    images: [
      {
        url: "/assets/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Foro Programadores Argentina",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Foro Programadores Argentina - Comunidad de Desarrolladores",
    description: "Participa en el foro de Programadores Argentina. Comparte conocimientos y conecta con otros desarrolladores.",
    images: ["/assets/images/logo.png"],
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

export default function ForoPage(): JSX.Element {
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
                      Foro de la Comunidad
                      </h4>
                      <div className="tp_text_anim">
                        <p style={{ perspective: '400px', maxWidth: '800px', margin: '0 auto' }}>
                          Participa en las discusiones de la comunidad de programadores argentinos. 
                          Comparte conocimientos, resuelve dudas y conecta con otros desarrolladores.
                        </p>
                      </div>
                      
                      {/* Botón para crear nuevo post */}
                      <CreatePostButton />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* hero area end */}
            
            {/* forum area start */}
            <div className="it-benifit-area p-relative pb-120">
              <div className="container container-1230">
                <div className="it-benifit-bg pb-120 z-index-1" data-bg-color="#1A1B1E" style={{ paddingTop: '30px' }}>
                  <ForumPageContent />
                </div>
              </div>
            </div>
            {/* forum area end */}
          </main>
          
          <Footer />
        </div>
      </div>
    </>
  );
}
