"use client";

export default function HeadLinks() {
  // Usar un script inline para evitar que Next.js analice el código durante el build
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            if (typeof window === 'undefined') return;
            
            const links = [
              { rel: 'shortcut icon', type: 'image/x-icon', href: '/assets/images/favicon.ico' },
              { rel: 'stylesheet', href: '/assets/css/bootstrap.css' },
              { rel: 'stylesheet', href: '/assets/css/slick.css' },
              { rel: 'stylesheet', href: '/assets/css/swiper-bundle.css' },
              { rel: 'stylesheet', href: '/assets/css/magnific-popup.css' },
              { rel: 'stylesheet', href: '/assets/css/font-awesome-pro.css' },
              { rel: 'stylesheet', href: '/assets/css/spacing.css' },
              { rel: 'stylesheet', href: '/assets/css/atropos.min.css' },
              { rel: 'stylesheet', href: '/assets/css/main.css' },
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
  );
}


