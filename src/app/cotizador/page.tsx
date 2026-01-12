import { JSX } from 'react';
import { Metadata } from 'next';
import BackToTop from '../components/BackToTop';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import CotizadorPageContent from './CotizadorPageContent';

export const metadata: Metadata = {
  title: 'Cotizador de Proyectos | Programadores Argentina',
  description:
    'Cotizá tu proyecto de software en minutos con un estimado orientativo. Respondé algunas preguntas y dejá tu email para que te contactemos en 24–48 hs.',
  keywords: [
    'cotizador de software',
    'cotizar proyecto',
    'presupuesto desarrollo web',
    'presupuesto app',
    'programadores argentina',
    'desarrollo a medida',
    'estimador de proyecto',
  ],
  authors: [{ name: 'Programadores Argentina' }],
  creator: 'Programadores Argentina',
  publisher: 'Programadores Argentina',
  metadataBase: new URL('https://programadoresargentina.com'),
  alternates: { canonical: '/cotizador' },
  openGraph: {
    title: 'Cotizador de Proyectos | Programadores Argentina',
    description:
      'Respondé preguntas, obtené un estimado orientativo y dejá tu email. Te contactamos en 24–48 hs.',
    url: 'https://programadoresargentina.com/cotizador',
    siteName: 'Programadores Argentina',
    images: [
      {
        url: '/assets/images/og-home-programadores-argentina.jpg',
        width: 1200,
        height: 630,
        alt: 'Cotizador de Proyectos - Programadores Argentina',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cotizador de Proyectos | Programadores Argentina',
    description:
      'Respondé preguntas, obtené un estimado orientativo y dejá tu email. Te contactamos en 24–48 hs.',
    images: ['/assets/images/og-home-programadores-argentina.jpg'],
    creator: '@programadores_argentina',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function CotizadorPage(): JSX.Element {
  return (
    <>
      <BackToTop />
      <Navigation />

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <CotizadorPageContent />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}

