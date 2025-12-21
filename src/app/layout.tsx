import Script from 'next/script';
import type { Metadata } from 'next';
import ClientLayout from './components/ClientLayout';
import { AuthProvider } from '@/contexts/AuthContext';
import StructuredData from './components/StructuredData';

export const metadata: Metadata = {
  title: 'Comunidad Programadores Argentina',
  description: 'Comunidad de programadores de Argentina. Sumate a nuestra comunidad de Discord y participá de eventos, workshops y mucho más.',
  icons: {
    icon: '/assets/images/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR" className='no-js agntix-dark'>
      <body className="tp-magic-cursor">
        {/* Datos estructurados para navegación - ayuda a Google a generar sitelinks */}
        <StructuredData 
          type="SiteNavigationElement" 
          data={{}}
        />
        {/* Cargar CSS dinámicamente */}
        <Script
          id="load-css"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;
                var links = [
                  { rel: 'shortcut icon', type: 'image/x-icon', href: '/assets/images/favicon.ico' },
                  { rel: 'stylesheet', href: '/assets/css/bootstrap.css' },
                  { rel: 'stylesheet', href: '/assets/css/slick.css' },
                  { rel: 'stylesheet', href: '/assets/css/swiper-bundle.css' },
                  { rel: 'stylesheet', href: '/assets/css/magnific-popup.css' },
                  { rel: 'stylesheet', href: '/assets/css/font-awesome-pro.css' },
                  { rel: 'stylesheet', href: '/assets/css/spacing.css' },
                  { rel: 'stylesheet', href: '/assets/css/atropos.min.css' },
                  { rel: 'stylesheet', href: '/assets/css/main.css' }
                ];
                links.forEach(function(linkProps) {
                  var existingLink = document.querySelector('link[href="' + linkProps.href + '"]');
                  if (!existingLink) {
                    var link = document.createElement('link');
                    Object.keys(linkProps).forEach(function(key) {
                      link.setAttribute(key, linkProps[key]);
                    });
                    document.head.appendChild(link);
                  }
                });
              })();
            `,
          }}
        />
        {/* Google Tag Manager */}
        <Script
          id="gtm-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NW6NFH4P');`,
          }}
        />
        {/* End Google Tag Manager */}
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-NW6NFH4P"
            height="0" 
            width="0" 
            style={{display:'none',visibility:'hidden'}}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        
        <div id="magic-cursor" className="cursor-bg-red-2">
          <div id="ball"></div>
        </div>
        <div id="preloader">
          <div className="ssh-preloader" role="status" aria-live="polite">
            <div className="ssh-terminal" aria-label="Conectando por SSH">
              <div className="ssh-terminal__bar">
                <span className="dot dot--red" />
                <span className="dot dot--yellow" />
                <span className="dot dot--green" />
                <span className="ssh-title">ssh usuario@programadoresargentina</span>
              </div>
              <div className="ssh-terminal__body">
                <div className="line" style={{animationDelay:'0.05s'}}>$ ssh usuario@server</div>
                <div className="line" style={{animationDelay:'0.35s'}}>Connecting to 147.93.13.112:22 ...</div>
                <div className="line" style={{animationDelay:'0.75s'}}>Authenticating with public key ...</div>
                <div className="line" style={{animationDelay:'1.15s'}}>Login successful.</div>
                <div className="line" style={{animationDelay:'1.55s'}}>Starting UI services ...</div>
                <div className="line" style={{animationDelay:'1.95s'}}>Loading assets [####_______] 35%</div>
                <div className="line" style={{animationDelay:'2.35s'}}>Loading assets [##########__] 85%</div>
                <div className="line" style={{animationDelay:'2.75s'}}>Launching interface ...</div>
                <div className="cursor" />
              </div>
            </div>
          </div>
          <style>{`
            /* SSH Preloader - estilos embebidos y responsivos */
            #preloader {
              position: fixed;
              inset: 0;
              z-index: 99999;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 16px;
              background: radial-gradient(1200px 600px at 20% 0%, #0d1117 0%, #0b0f14 40%, #0a0d12 100%);
            }

            .ssh-preloader { width: 100%; display: flex; align-items: center; justify-content: center; }

            .ssh-terminal {
              width: min(92vw, 760px);
              border-radius: 12px;
              overflow: hidden;
              background: rgba(8, 12, 16, 0.85);
              border: 1px solid rgba(208, 255, 113, 0.18);
              box-shadow: 0 10px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03);
              backdrop-filter: blur(6px);
            }

            .ssh-terminal__bar {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 10px 12px;
              background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
              border-bottom: 1px solid rgba(255,255,255,0.08);
            }

            .dot { width: 10px; height: 10px; border-radius: 999px; display: inline-block; }
            .dot--red { background: #ff5f56; }
            .dot--yellow { background: #ffbd2e; }
            .dot--green { background: #27c93f; }

            .ssh-title { color: rgba(255,255,255,0.55); font-size: 12px; margin-left: 6px; user-select: none; }

            .ssh-terminal__body {
              padding: 14px 16px 18px 16px;
              color: #D0FF71;
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
              line-height: 1.65;
              font-size: clamp(12px, 3.5vw, 14px);
              min-height: 180px;
            }

            .line { opacity: 0; transform: translateY(4px); white-space: nowrap; overflow: hidden; }
            .line { animation: fadeInUp 0.45s ease forwards; }

            @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }

            .cursor {
              width: 10px; height: 16px; margin-top: 8px;
              background: #D0FF71; display: inline-block;
              animation: blink 1s steps(1, end) infinite;
            }

            @keyframes blink { 50% { opacity: 0; } }

            /* Efecto sutil de grilla de terminal */
            #preloader::before {
              content: '';
              position: absolute; inset: 0; pointer-events: none;
              background-image:
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
              background-size: 18px 18px, 18px 18px;
              mask-image: radial-gradient(circle at 50% 50%, rgba(0,0,0,0.6), transparent 70%);
            }

            /* Mobile tweaks */
            @media (max-width: 480px) {
              .ssh-terminal { border-radius: 10px; }
              .ssh-terminal__bar { padding: 8px 10px; gap: 6px; }
              .ssh-title { font-size: 11px; }
              .ssh-terminal__body { padding: 12px; font-size: 12px; }
              .cursor { width: 8px; height: 14px; }
            }

            /* Accesibilidad: reducir movimiento */
            @media (prefers-reduced-motion: reduce) {
              .line { animation: none; opacity: 1; transform: none; }
              .cursor { animation: none; }
            }
          `}</style>
        </div>
        <div className="back-to-top-wrapper">
          <button id="back_to_top" type="button" className="back-to-top-btn">
            <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 6L6 1L1 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
        </AuthProvider>

        <Script src="/assets/js/vendor/jquery.js" strategy="beforeInteractive" />
        <Script src="/assets/js/bootstrap-bundle.js" />
        <Script src="/assets/js/swiper-bundle.js" />
        <Script src="/assets/js/plugin.js" />
        <Script src="/assets/js/three.js" />
        <Script src="/assets/js/slick.js" />
        <Script src="/assets/js/scroll-magic.js" />
        <Script src="/assets/js/hover-effect.umd.js" />
        <Script src="/assets/js/magnific-popup.js" />
        <Script src="/assets/js/parallax-slider.js" />
        <Script src="/assets/js/nice-select.js" />
        <Script src="/assets/js/purecounter.js" />
        <Script src="/assets/js/isotope-pkgd.js" />
        <Script src="/assets/js/imagesloaded-pkgd.js" />
        <Script src="/assets/js/ajax-form.js" />
        <Script src="/assets/js/Observer.min.js" />
        <Script src="/assets/js/splitting.min.js" />
        <Script src="/assets/js/webgl.js" />
        <Script src="/assets/js/parallax-scroll.js" />
        <Script src="/assets/js/atropos.js" />
        <Script src="/assets/js/slider-active.js" />
        <Script src="/assets/js/main.js" />
        <Script src="/assets/js/tp-cursor.js" />
        <Script src="/assets/js/portfolio-slider-1.js" />
        <Script src="/assets/js/distortion-img.js" type="module" />
        <Script src="/assets/js/skew-slider/index.js" type="module" />
        <Script src="/assets/js/img-revel/index.js" type="module" />
        
        {/* Google Analytics 4 */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-90V0GHL08C" />
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-90V0GHL08C');
          `}
        </Script>
      </body>
    </html>
  );
}