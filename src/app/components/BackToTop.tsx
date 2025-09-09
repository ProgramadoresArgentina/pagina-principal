'use client';

import { JSX, useState, useEffect } from "react";

export default function BackToTop(): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);

  // Mostrar/ocultar el botón basado en el scroll
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Función para hacer scroll hacia arriba
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className={`back-to-top-wrapper ${isVisible ? 'back-to-top-btn-show' : ''}`}>
      <button 
        id="back_to_top" 
        type="button" 
        className="back-to-top-btn"
        onClick={scrollToTop}
        aria-label="Volver arriba"
      >
        <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 6L6 1L1 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
