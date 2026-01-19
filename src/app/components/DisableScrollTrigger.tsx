'use client';

import { useEffect } from 'react';

/**
 * Componente que desactiva ScrollTrigger de GSAP en la página donde se usa.
 * Útil para páginas con contenido dinámico que causa saltos de scroll.
 */
export default function DisableScrollTrigger() {
  useEffect(() => {
    // Esperar a que GSAP cargue
    const disableScrollTrigger = () => {
      const win = window as any;

      if (win.ScrollTrigger) {
        // Matar todos los ScrollTriggers existentes
        win.ScrollTrigger.getAll().forEach((trigger: any) => {
          trigger.kill();
        });

        // Deshabilitar ScrollTrigger globalmente para esta página
        win.ScrollTrigger.defaults({ markers: false });
        win.ScrollTrigger.config({ autoRefreshEvents: 'none' });
      }

      // También deshabilitar ScrollSmoother si existe
      if (win.ScrollSmoother) {
        const smoother = win.ScrollSmoother.get();
        if (smoother) {
          smoother.kill();
        }
      }
    };

    // Intentar inmediatamente
    disableScrollTrigger();

    // También intentar después de que carguen los scripts
    const timeout = setTimeout(disableScrollTrigger, 500);
    const timeout2 = setTimeout(disableScrollTrigger, 1000);
    const timeout3 = setTimeout(disableScrollTrigger, 2000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, []);

  return null;
}
