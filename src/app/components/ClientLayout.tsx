"use client";

import { useEffect, useState } from "react";
import NewsletterPopup from "./NewsletterPopup";
import { useNewsletterPopup } from "@/hooks/useNewsletterPopup";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { showPopup, closePopup } = useNewsletterPopup()
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Manejar el preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
      // Esperar a que la página esté completamente cargada
      const handleLoad = () => {
        setTimeout(() => {
          preloader.style.transition = 'opacity 0.5s ease';
          preloader.style.opacity = '0';
          setTimeout(() => {
            preloader.style.display = 'none';
          }, 500);
        }, 500); // Aumentar el tiempo para asegurar que todo esté cargado
      };

      if (document.readyState === 'complete') {
        handleLoad();
      } else {
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
      }
    }
  }, []);

  return (
    <>
      {children}
      {showPopup && <NewsletterPopup onClose={closePopup} />}
    </>
  );
}
