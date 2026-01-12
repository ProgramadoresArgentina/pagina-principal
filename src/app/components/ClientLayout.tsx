"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NewsletterPopup from "./NewsletterPopup";
import { useNewsletterPopup } from "@/hooks/useNewsletterPopup";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { showPopup, closePopup } = useNewsletterPopup()
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Reinicializar scripts cuando cambia la ruta
  useEffect(() => {
    // Esperar a que el DOM esté listo
    const timer = setTimeout(() => {
      // Reinicializar Swiper
      if (typeof window !== 'undefined' && (window as any).Swiper) {
        // Destruir todas las instancias existentes de Swiper
        document.querySelectorAll('.swiper-initialized').forEach((swiperEl: any) => {
          if (swiperEl && swiperEl.swiper) {
            swiperEl.swiper.destroy(true, true);
          }
        });

        // Reinicializar swipers
        const initSwipers = () => {
          // Brand swiper
          const brandSwiper = document.querySelector('.tp-brand-active');
          if (brandSwiper && !(brandSwiper as any).swiper) {
            new (window as any).Swiper('.tp-brand-active', {
              slidesPerView: 'auto',
              spaceBetween: 30,
              loop: true,
              speed: 12000,
              autoplay: {
                delay: 0,
                disableOnInteraction: false,
              },
            });
          }

          // Otros swipers que puedas tener
          document.querySelectorAll('.swiper-container:not(.swiper-initialized)').forEach((container) => {
            new (window as any).Swiper(container, {
              slidesPerView: 1,
              spaceBetween: 30,
              loop: true,
              autoplay: {
                delay: 3000,
                disableOnInteraction: false,
              },
            });
          });
        };

        initSwipers();
      }

      // Reinicializar animaciones con GSAP/ScrollTrigger si existen
      if (typeof window !== 'undefined' && (window as any).gsap && (window as any).ScrollTrigger) {
        (window as any).ScrollTrigger.refresh();
      }

      // Reinicializar splitting.js para animaciones de texto
      if (typeof window !== 'undefined' && (window as any).Splitting) {
        (window as any).Splitting();
      }

      // Reinicializar otros plugins que necesiten
      if (typeof window !== 'undefined' && (window as any).jQuery) {
        const $ = (window as any).jQuery;
        
        // Reinicializar nice-select si existe
        if ($.fn.niceSelect) {
          $('select').niceSelect('destroy');
          $('select').niceSelect();
        }

        // Reinicializar magnific-popup si existe
        if ($.fn.magnificPopup) {
          $('.popup-image').magnificPopup({
            type: 'image',
            gallery: { enabled: true }
          });
        }

        // Reinicializar slick si existe
        if ($.fn.slick) {
          $('.slick-slider').each(function() {
            if ($(this).hasClass('slick-initialized')) {
              $(this).slick('unslick');
            }
          });
          
          $('.slick-slider').each(function() {
            $(this).slick({
              dots: true,
              arrows: true,
              infinite: true,
              speed: 500,
              slidesToShow: 1,
              slidesToScroll: 1,
              autoplay: true,
              autoplaySpeed: 3000,
            });
          });
        }
      }

      // Forzar recalcular animaciones de parallax y efectos
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('resize'));
        window.dispatchEvent(new Event('scroll'));
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [pathname]); // Se ejecuta cada vez que cambia la ruta

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
        }, 500);
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
