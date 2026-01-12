import { JSX } from "react";
import { Metadata } from "next";
import BackToTop from "../../components/BackToTop";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import PostPageContent from "../../components/PostPageContent";

export const metadata: Metadata = {
  title: "Post del Foro - Programadores Argentina",
  description: "Lee y participa en la discusión del foro de Programadores Argentina.",
  robots: {
    index: true,
    follow: true,
  },
};

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PostPage({ params }: PostPageProps): Promise<JSX.Element> {
  const { slug } = await params;
  return (
    <>
      <BackToTop />
      <Navigation />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            {/* hero area start */}
            <div className="it-about-area it-about-ptb pt-52 pb-90 p-relative">
              <div className="it-about-shape-wrap">
                <img data-speed="1.1" className="it-about-shape-1 d-none d-xxl-block" src="/assets/img/home-11/about/about-shape-1.png" alt="" style={{ translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 55.9091px)', willChange: 'transform' }} data-lag="0" />
                <img data-speed=".9" className="it-about-shape-2" src="/assets/img/home-11/about/about-shape-2.png" alt="" style={{ translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 9.00044px)', willChange: 'transform' }} data-lag="0" />
              </div>
            </div>
            {/* hero area end */}
            
            {/* post area start */}
            <div className="it-benifit-area p-relative pb-120">
              <div className="container container-1230">
                <div className="it-benifit-bg pb-120 z-index-1" data-bg-color="#1A1B1E" style={{ paddingTop: '30px' }}>
                  <PostPageContent slug={slug} />
                </div>
              </div>
            </div>
            {/* post area end */}
          </main>
          
          <Footer />
        </div>
      </div>
    </>
  );
}
