'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { renderFirstParagraph } from '@/lib/articleUtils';
import PlateRenderer from './PlateRenderer';

interface LockedContentProps {
  children: React.ReactNode;
  isPublic: boolean;
  isSubscriberOnly?: boolean;
  excerpt: string;
  title: string;
  content?: any; // Contenido Plate para extraer primer párrafo
}

export default function LockedContent({ 
  children, 
  isPublic, 
  isSubscriberOnly = false,
  excerpt, 
  title,
  content 
}: LockedContentProps) {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();

  // Si el artículo es público y no es solo para suscriptores, mostrar todo
  if (isPublic && !isSubscriberOnly) {
    return <>{children}</>;
  }

  // Si es solo para suscriptores, verificar suscripción
  if (isSubscriberOnly) {
    // Si el usuario está autenticado y suscrito, mostrar todo el contenido
    if (isAuthenticated && user?.isSubscribed) {
      return <>{children}</>;
    }

    // Si no está suscrito, mostrar solo el primer párrafo con el mensaje de bloqueo
    return (
      <div className="locked-content">
        <div className="postbox-details-text mb-45">
          {/* Mostrar primer párrafo si hay contenido, sino usar excerpt */}
          {content ? (
            <div className="first-paragraph-preview">
              {renderFirstParagraph(content)}
            </div>
          ) : (
            <p className="mb-25">
              {excerpt}
            </p>
          )}
        </div>
        
        <div className="locked-message">
          <div className="tp-blog-locked-content p-relative">
            <div className="tp-blog-locked-overlay"></div>
            <div className="tp-blog-locked-info text-center">
              <div className="tp-blog-locked-icon mb-30">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 10V8C6 5.79086 7.79086 4 10 4H14C16.2091 4 18 5.79086 18 8V10M6 10H4C2.89543 10 2 10.8954 2 12V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20V12C22 10.8954 21.1046 10 20 10H18M6 10H18" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4 className="tp-blog-locked-title mb-20 text-white">Solo para miembros del Club</h4>
              <p className="tp-blog-locked-description mb-30 text-white">
                Este contenido es exclusivo para miembros suscritos al Club de Programadores Argentina. 
                Únete para acceder a artículos técnicos avanzados, tutoriales exclusivos y contenido premium.
              </p>
              <div className="tp-blog-locked-actions">
                {!isAuthenticated ? (
                  <a 
                    href={`/ingresar?redirect=${encodeURIComponent(pathname || '/')}`}
                    className="tp-btn-black btn-green-light-bg"
                  >
                    <span className="tp-btn-black-filter-blur">
                      <svg width="0" height="0">
                        <defs>
                          <filter id="buttonFilterLocked">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"></feGaussianBlur>
                            <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"></feColorMatrix>
                            <feComposite in="SourceGraphic" in2="buttonFilterLocked" operator="atop"></feComposite>
                            <feBlend in="SourceGraphic" in2="buttonFilterLocked"></feBlend>
                          </filter>
                        </defs>
                      </svg>
                    </span>
                    <span className="tp-btn-black-filter d-inline-flex align-items-center" style={{filter: "url(#buttonFilterLocked)"}}>
                      <span className="tp-btn-black-text">Iniciar Sesión</span>
                      <span className="tp-btn-black-circle">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      </span>
                    </span>
                  </a>
                ) : (
                  <a 
                    href="/club"
                    className="tp-btn-black btn-green-light-bg"
                  >
                    <span className="tp-btn-black-filter-blur">
                      <svg width="0" height="0">
                        <defs>
                          <filter id="buttonFilterSubscribe">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"></feGaussianBlur>
                            <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"></feColorMatrix>
                            <feComposite in="SourceGraphic" in2="buttonFilterSubscribe" operator="atop"></feComposite>
                            <feBlend in="SourceGraphic" in2="buttonFilterSubscribe"></feBlend>
                          </filter>
                        </defs>
                      </svg>
                    </span>
                    <span className="tp-btn-black-filter d-inline-flex align-items-center" style={{filter: "url(#buttonFilterSubscribe)"}}>
                      <span className="tp-btn-black-text">Suscribirse al Club</span>
                      <span className="tp-btn-black-circle">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      </span>
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si el artículo no es público (borrador), usar la lógica original
  if (!isPublic) {
    // Si el usuario está autenticado y suscrito, mostrar todo el contenido
    if (isAuthenticated && user?.isSubscribed) {
      return <>{children}</>;
    }

    // Si no está suscrito, mostrar solo el excerpt con el mensaje de bloqueo
    return (
      <div className="locked-content">
        <div className="postbox-details-text mb-45">
          <p className="mb-25">
            {excerpt}
          </p>
        </div>
        
        <div className="locked-message">
          <div className="tp-blog-locked-content p-relative">
            <div className="tp-blog-locked-overlay"></div>
            <div className="tp-blog-locked-info text-center">
              <div className="tp-blog-locked-icon mb-30">
                <svg width="50" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 10V8C6 5.79086 7.79086 4 10 4H14C16.2091 4 18 5.79086 18 8V10M6 10H4C2.89543 10 2 10.8954 2 12V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20V12C22 10.8954 21.1046 10 20 10H18M6 10H18" stroke="#D0FF71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4 className="tp-blog-locked-title mb-20 text-white">Solo miembros del club pueden leer este artículo</h4>
              <p className="tp-blog-locked-description mb-30 text-white">
                Este contenido es exclusivo para miembros suscritos al Club de Programadores Argentina. 
                Únete para acceder a artículos técnicos avanzados, tutoriales exclusivos y contenido premium.
              </p>
              <div className="tp-blog-locked-actions">
                {!isAuthenticated && (
                  <a 
                    href={`/ingresar?redirect=${encodeURIComponent(pathname || '/')}`}
                    className="tp-btn-black btn-green-light-bg"
                  >
                    <span className="tp-btn-black-filter-blur">
                      <svg width="0" height="0">
                        <defs>
                          <filter id="buttonFilterLocked">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"></feGaussianBlur>
                            <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"></feColorMatrix>
                            <feComposite in="SourceGraphic" in2="buttonFilterLocked" operator="atop"></feComposite>
                            <feBlend in="SourceGraphic" in2="buttonFilterLocked"></feBlend>
                          </filter>
                        </defs>
                      </svg>
                    </span>
                    <span className="tp-btn-black-filter d-inline-flex align-items-center" style={{filter: "url(#buttonFilterLocked)"}}>
                      <span className="tp-btn-black-text">Iniciar Sesión</span>
                      <span className="tp-btn-black-circle">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      </span>
                    </span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
