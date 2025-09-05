"use client";
import { JSX, useEffect } from "react";

export default function PublicGroups(): JSX.Element {
  useEffect(() => {
    // Inicializar animaciones cuando el componente se monte
    const initAnimations = () => {
      if (typeof window !== 'undefined') {
        const checkAndInit = () => {
          if (window.jQuery && window.jQuery.fn) {
            try {
              // Reinicializar animaciones de servicio
              if (window.jQuery.fn.tpServicePin) {
                window.jQuery('.tp-service-pin').tpServicePin();
              }
              
              // Forzar reinicialización de animaciones
              const serviceItems = document.querySelectorAll('.tp-service-item');
              serviceItems.forEach((item, index) => {
                // Remover y agregar clases para forzar reinicialización
                item.classList.remove('tp_fade_anim');
                setTimeout(() => {
                  item.classList.add('tp_fade_anim');
                }, index * 100);
              });
              
              // Disparar eventos para activar animaciones
              setTimeout(() => {
                window.dispatchEvent(new Event('scroll'));
                window.dispatchEvent(new Event('resize'));
              }, 200);
              
            } catch (error) {
              console.log('Animations will be initialized by main scripts');
            }
          } else {
            // Si jQuery no está listo, intentar de nuevo
            setTimeout(checkAndInit, 100);
          }
        };

        // Esperar un poco para que los scripts se carguen
        setTimeout(checkAndInit, 300);
      }
    };

    initAnimations();
  }, []);

  return (
    <div id="down" className="tp-service-area pt-120">
      <div className="container-fluid p-0">
        <div className="row gx-0">
          <div className="col-12">
            <div className="tp-service-title-box">
              <span className="tp-section-subtitle pre">Grupos Públicos</span>
            </div>
          </div>
        </div>
        <div className="tp-service-pin">
          <div className="tp-service-item tp-service-panel tp_fade_anim" data-animation="fadeInUp" data-delay="0.1s">
            <div className="row">
              <div className="col-xxl-3 col-xl-2 col-lg-1 col-md-1">
                <div className="tp-service-number">
                  <span>Comunidad</span>
                </div>
              </div>
              <div className="col-xxl-5 col-xl-6 col-lg-7 col-md-7">
                <div className="tp-service-content">
                  <h4 className="tp-section-title tp_text_invert">Whatsapp <small style={{ fontSize: '17px', letterSpacing: '2px' }}>(+1000 miembros)</small></h4>
                  <div className="tp-service-btn mb-0">
                    <a href="https://chat.whatsapp.com/Ce4YJteKehD2JZUDAQaUxh" className="tp-btn-black btn-red-bg">
                      <span className="tp-btn-black-filter-blur">
                        <svg width="0" height="0">
                          <defs>
                            <filter id="buttonFilter1">
                              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"></feGaussianBlur>
                              <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"></feColorMatrix>
                              <feComposite in="SourceGraphic" in2="buttonFilter1" operator="atop"></feComposite>
                              <feBlend in="SourceGraphic" in2="buttonFilter1"></feBlend>
                            </filter>
                          </defs>
                        </svg>
                      </span>
                      <span className="tp-btn-black-filter d-inline-flex align-items-center" style={{ filter: 'url(#buttonFilter1)' }}>
                        <span className="tp-btn-black-text">Unirme</span>
                        <span className="tp-btn-black-circle">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tp-service-item tp-service-panel tp_fade_anim" data-animation="fadeInUp" data-delay="0.2s">
            <div className="row">
              <div className="col-xxl-3 col-xl-2 col-lg-1 col-md-1">
                <div className="tp-service-number">
                  <span>Página</span>
                </div>
              </div>
              <div className="col-xxl-5 col-xl-6 col-lg-7 col-md-7">
                <div className="tp-service-content">
                  <h4 className="tp-section-title tp_text_invert">linkedin <small style={{ fontSize: '17px', letterSpacing: '2px' }}>(+66.000 miembros)</small></h4>
                  <div className="tp-service-btn mb-0">
                    <a href="https://www.linkedin.com/company/programadores-argentina" className="tp-btn-black btn-red-bg">
                      <span className="tp-btn-black-filter-blur">
                        <svg width="0" height="0">
                          <defs>
                            <filter id="buttonFilter2">
                              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"></feGaussianBlur>
                              <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"></feColorMatrix>
                              <feComposite in="SourceGraphic" in2="buttonFilter2" operator="atop"></feComposite>
                              <feBlend in="SourceGraphic" in2="buttonFilter2"></feBlend>
                            </filter>
                          </defs>
                        </svg>
                      </span>
                      <span className="tp-btn-black-filter d-inline-flex align-items-center" style={{ filter: 'url(#buttonFilter2)' }}>
                        <span className="tp-btn-black-text">Seguir</span>
                        <span className="tp-btn-black-circle">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tp-service-item tp-service-panel tp_fade_anim" data-animation="fadeInUp" data-delay="0.3s">
            <div className="row">
              <div className="col-xxl-3 col-xl-2 col-lg-1 col-md-1">
                <div className="tp-service-number">
                  <span>Página</span>
                </div>
              </div>
              <div className="col-xxl-5 col-xl-6 col-lg-7 col-md-7">
                <div className="tp-service-content">
                  <h4 className="tp-section-title tp_text_invert">Instagram <small style={{ fontSize: '17px', letterSpacing: '2px' }}>(+24.500 miembros)</small></h4>
                  <div className="tp-service-btn mb-0">
                    <a href="https://www.instagram.com/programadores_argentina/" className="tp-btn-black btn-red-bg">
                      <span className="tp-btn-black-filter-blur">
                        <svg width="0" height="0">
                          <defs>
                            <filter id="buttonFilter3">
                              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"></feGaussianBlur>
                              <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"></feColorMatrix>
                              <feComposite in="SourceGraphic" in2="buttonFilter3" operator="atop"></feComposite>
                              <feBlend in="SourceGraphic" in2="buttonFilter3"></feBlend>
                            </filter>
                          </defs>
                        </svg>
                      </span>
                      <span className="tp-btn-black-filter d-inline-flex align-items-center" style={{ filter: 'url(#buttonFilter3)' }}>
                        <span className="tp-btn-black-text">Seguir</span>
                        <span className="tp-btn-black-circle">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
