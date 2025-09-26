import Script from 'next/script';
import type { Metadata } from 'next';
import ClientLayout from './components/ClientLayout';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'Comunidad Programadores Argentina',
  description: 'Comunidad de programadores de Argentina. Sumate a nuestra comunidad de Discord y participá de eventos, workshops y mucho más.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-AR" className='no-js agntix-dark'>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NW6NFH4P');`,
          }}
        />
        {/* End Google Tag Manager */}
        
        <link rel="shortcut icon" type="image/x-icon" href="/assets/images/favicon.ico" />
        <link rel="stylesheet" href="/assets/css/bootstrap.css" />
        <link rel="stylesheet" href="/assets/css/slick.css" />
        <link rel="stylesheet" href="/assets/css/swiper-bundle.css" />
        <link rel="stylesheet" href="/assets/css/magnific-popup.css" />
        <link rel="stylesheet" href="/assets/css/font-awesome-pro.css" />
        <link rel="stylesheet" href="/assets/css/spacing.css" />
        <link rel="stylesheet" href="/assets/css/atropos.min.css" />
        <link rel="stylesheet" href="/assets/css/main.css" />
      </head>
      <body className="tp-magic-cursor">
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
          <div className="preloader">
            <span></span>
            <span></span>
          </div>
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
      </body>
    </html>
  );
}