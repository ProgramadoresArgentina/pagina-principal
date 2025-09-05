import { useEffect } from 'react';

export const useAnimationInit = (selector: string, delay: number = 200) => {
  useEffect(() => {
    const initAnimations = () => {
      if (typeof window !== 'undefined') {
        const checkScripts = () => {
          // Verificar si jQuery está disponible
          if (window.jQuery && window.jQuery.fn) {
            const elements = document.querySelectorAll(selector);
            
            elements.forEach((element) => {
              // Forzar reinicialización removiendo y agregando clases
              const classList = element.classList;
              const classesToReinit = ['tp-service-panel', 'tp_fade_anim', 'tp_text_anim'];
              
              classesToReinit.forEach(className => {
                if (classList.contains(className)) {
                  classList.remove(className);
                  // Forzar reflow
                  element.offsetHeight;
                  classList.add(className);
                }
              });
            });

            // Intentar reinicializar plugins específicos
            try {
              if (window.jQuery.fn.tpServicePin) {
                window.jQuery('.tp-service-pin').tpServicePin();
              }
              if (window.jQuery.fn.tpFadeAnim) {
                window.jQuery('.tp_fade_anim').tpFadeAnim();
              }
            } catch (error) {
              console.log('Animation plugins not available yet');
            }

            // Disparar evento personalizado para otros scripts
            const event = new CustomEvent('reinitAnimations', {
              detail: { selector, elements }
            });
            window.dispatchEvent(event);
          } else {
            // Si jQuery no está listo, intentar de nuevo
            setTimeout(checkScripts, 100);
          }
        };

        checkScripts();
      }
    };

    const timer = setTimeout(initAnimations, delay);
    return () => clearTimeout(timer);
  }, [selector, delay]);
};
