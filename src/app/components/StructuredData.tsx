import { JSX } from "react";

interface StructuredDataProps {
  type: 'Organization' | 'Article' | 'WebSite' | 'WebPage' | 'SiteNavigationElement';
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps): JSX.Element {
  const getStructuredData = () => {
    switch (type) {
      case 'Organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Programadores Argentina",
          "description": "Comunidad más grande de programadores de Argentina con más de 60.000 miembros",
          "url": "https://programadoresargentina.com",
          "logo": "https://programadoresargentina.com/assets/images/LogoProgramadoresArgentina.webp",
          "sameAs": [
            "https://www.linkedin.com/company/programadores-argentina",
            "https://www.instagram.com/programadores_argentina/",
            "https://chat.whatsapp.com/Ce4YJteKehD2JZUDAQaUxh"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "email": "programadoresargentina@gmail.com",
            "contactType": "customer service"
          },
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "AR"
          },
          "foundingDate": "2018",
          "numberOfEmployees": "60000+",
          "industry": "Technology"
        };

      case 'WebSite':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Programadores Argentina",
          "url": "https://programadoresargentina.com",
          "description": "Comunidad de programadores más grande de Argentina",
          "publisher": {
            "@type": "Organization",
            "name": "Programadores Argentina"
          },
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://programadoresargentina.com/articulos?search={search_term_string}",
            "query-input": "required name=search_term_string"
          },
          // Enlaces principales para ayudar a Google a generar sitelinks
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Club Exclusivo",
                "url": "https://programadoresargentina.com/club"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Artículos",
                "url": "https://programadoresargentina.com/articulos"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Cotizar Proyecto",
                "url": "https://programadoresargentina.com/cotizador"
              },
              {
                "@type": "ListItem",
                "position": 4,
                "name": "Foro",
                "url": "https://programadoresargentina.com/foro"
              },
              {
                "@type": "ListItem",
                "position": 5,
                "name": "Libros Exclusivos",
                "url": "https://programadoresargentina.com/club/libros"
              },
              {
                "@type": "ListItem",
                "position": 6,
                "name": "Pines",
                "url": "https://programadoresargentina.com/pines"
              }
            ]
          }
        };

      case 'Article':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data.title,
          "description": data.description,
          "image": data.image,
          "author": {
            "@type": "Organization",
            "name": "Programadores Argentina"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Programadores Argentina",
            "logo": {
              "@type": "ImageObject",
              "url": "https://programadoresargentina.com/assets/images/LogoProgramadoresArgentina.webp"
            }
          },
          "datePublished": data.publishedTime,
          "dateModified": data.modifiedTime,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": data.url
          },
          "articleSection": data.section,
          "keywords": data.keywords
        };

      case 'WebPage':
        return {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": data.title,
          "description": data.description,
          "url": data.url,
          "isPartOf": {
            "@type": "WebSite",
            "name": "Programadores Argentina",
            "url": "https://programadoresargentina.com"
          },
          "about": {
            "@type": "Organization",
            "name": "Programadores Argentina"
          }
        };

      case 'SiteNavigationElement':
        return {
          "@context": "https://schema.org",
          "@type": "SiteNavigationElement",
          "name": "Navegación Principal",
          "url": "https://programadoresargentina.com",
          "hasPart": [
            {
              "@type": "SiteNavigationElement",
              "name": "Club Exclusivo",
              "url": "https://programadoresargentina.com/club"
            },
            {
              "@type": "SiteNavigationElement",
              "name": "Artículos",
              "url": "https://programadoresargentina.com/articulos"
            },
            {
              "@type": "SiteNavigationElement",
              "name": "Cotizar Proyecto",
              "url": "https://programadoresargentina.com/cotizador"
            },
            {
              "@type": "SiteNavigationElement",
              "name": "Foro",
              "url": "https://programadoresargentina.com/foro"
            },
            {
              "@type": "SiteNavigationElement",
              "name": "Libros Exclusivos",
              "url": "https://programadoresargentina.com/club/libros"
            },
            {
              "@type": "SiteNavigationElement",
              "name": "Pines",
              "url": "https://programadoresargentina.com/pines"
            }
          ]
        };

      default:
        return {};
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData(), null, 2)
      }}
    />
  );
}
