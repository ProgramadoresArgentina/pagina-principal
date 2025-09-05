
export default function Home(): JSX.Element {
  return (
    <>
      <div className="back-to-top-wrapper">
        <button id="back_to_top" type="button" className="back-to-top-btn">
          <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 6L6 1L1 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div id="header-sticky" className="tp-header-10-area tp-header-11-style tp-header-blur sticky-black-bg header-11-dark-style header-transparent">
        <div className="container container-1630">
          <div className="tp-header-10-wrapper mt-30">
            <div className="row align-items-center">
              <div className="col-xl-2 col-lg-4 col-md-6 col-5">
                <div className="tp-header-10-logo">
                  <a href="/">
                    <img data-width="40" src="/assets/images/logo.png" alt="Logo Comunidad Programadores Argentina" />
                  </a>
                </div>
              </div>
              <div className="col-xl-10 col-lg-8 col-md-6 col-7">
                <div className="tp-header-10-box d-flex align-items-center justify-content-end justify-content-xl-between">
                  <div className="tp-header-menu tp-header-10-menu tp-header-dropdown dropdown-black-bg d-none d-xl-block">
                    <nav className="tp-mobile-menu-active">
                      <ul>
                        <li>
                          <a href="/">Inicio</a>
                        </li>
                        <li>
                          <a href="/articulos">Blogs y Artículos de la comunidad</a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                  <div className="tp-header-10-right d-flex align-items-center">
                    <div className="tp-header-11-btn-box d-none d-md-block ml-20">
                      <a className="tp-btn-black-radius d-flex align-items-center justify-content-between" href="/club">
                        <span>
                          <span className="text-1">Unirse al Club</span>
                          <span className="text-2">Unirme!</span>
                        </span>
                        <i>
                          <span>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </i>
                      </a>
                    </div>
                    <div className="tp-header-10-offcanvas ml-15 d-block d-md-none">
                      <div className="tp-header-bar">
                        <button className="tp-offcanvas-open-btn">
                          <i></i>
                          <i></i>
                          <i></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tp-search-area search-black p-relative">
        <div className="tp-search-close">
          <button className="tp-search-close-btn">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="path-1" d="M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path className="path-2" d="M1 1L11 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="container container-1230">
          <div className="row">
            <div className="tp-search-wrapper">
              <div className="col-lg-8">
                <div className="tp-search-content">
                  <div className="search p-relative">
                    <input type="text" className="search-input" placeholder="Search" />
                    <button className="tp-search-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18.0508 18.05L23.0009 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M20.8004 10.9C20.8004 5.43237 16.3679 1 10.9002 1C5.43246 1 1 5.43237 1 10.9C1 16.3676 5.43246 20.7999 10.9002 20.7999C16.3679 20.7999 20.8004 16.3676 20.8004 10.9Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tp-offcanvas-area">
        <div className="tp-offcanvas-wrapper offcanvas-black-bg">
          <div className="tp-offcanvas-top d-flex align-items-center justify-content-between">
            <div className="tp-offcanvas-logo">
              <a href="index.html">
                <img className="logo-1" data-width="120" src="/assets/images/logo.png" alt="Logo Comunidad Programadores Argentina" />
                <img className="logo-2" data-width="120" src="/assets/images/logo.png" alt="Logo Comunidad Programadores Argentina" />
              </a>
            </div>
            <div className="tp-offcanvas-close">
              <button className="tp-offcanvas-close-btn">
                <svg width="37" height="38" viewBox="0 0 37 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.19141 9.80762L27.5762 28.1924" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9.19141 28.1924L27.5762 9.80761" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
          <div className="tp-offcanvas-main">
            <div className="tp-offcanvas-content d-none d-xl-block">
              <h3 className="tp-offcanvas-title">Hello There!</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, </p>
            </div>
            <div className="tp-offcanvas-menu d-xl-none">
              <nav></nav>
            </div>
            <div className="tp-offcanvas-gallery d-none d-xl-block">
              <div className="row gx-2">
                <div className="col-md-3 col-3">
                  <div className="tp-offcanvas-gallery-img fix">
                    <a className="popup-image" href="/assets/img/offcanvas/offcanvas-1.jpg"><img src="/assets/img/offcanvas/offcanvas-1.jpg" alt="" /></a>
                  </div>
                </div>
                <div className="col-md-3 col-3">
                  <div className="tp-offcanvas-gallery-img fix">
                    <a className="popup-image" href="/assets/img/offcanvas/offcanvas-2.jpg"><img src="/assets/img/offcanvas/offcanvas-2.jpg" alt="" /></a>
                  </div>
                </div>
                <div className="col-md-3 col-3">
                  <div className="tp-offcanvas-gallery-img fix">
                    <a className="popup-image" href="/assets/img/offcanvas/offcanvas-3.jpg"><img src="/assets/img/offcanvas/offcanvas-3.jpg" alt="" /></a>
                  </div>
                </div>
                <div className="col-md-3 col-3">
                  <div className="tp-offcanvas-gallery-img fix">
                    <a className="popup-image" href="/assets/img/offcanvas/offcanvas-4.jpg"><img src="/assets/img/offcanvas/offcanvas-4.jpg" alt="" /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="body-overlay"></div>

      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <div className="ar-hero-area pp-service-2 p-relative pb-45" data-background="/assets/img/blog/blog-masonry/blog-bradcum-bg.png">
              <div className="tp-career-shape-1" style={{ top: '70%', right: '10%' }}>
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="84" height="84" viewBox="0 0 84 84" fill="none">
                    <path d="M36.3761 0.5993C40.3065 8.98556 47.3237 34.898 32.8824 44.3691C25.3614 49.0997 9.4871 52.826 1.7513 31.3747C-1.16691 23.2826 5.38982 15.9009 20.5227 20.0332C29.2536 22.4173 50.3517 27.8744 60.9 44.2751C66.4672 52.9311 71.833 71.0287 69.4175 82.9721M69.4175 82.9721C70.1596 77.2054 74.079 66.0171 83.8204 67.3978M69.4175 82.9721C69.8033 79.1875 67.076 70.1737 53.0797 64.3958M49.1371 20.8349C52.611 22.1801 63.742 28.4916 67.9921 39.9344" stroke="#ffffff" strokeWidth="1.5" />
                  </svg>
                </span>
              </div>
              <div className="ar-about-us-4-shape">
                <img src="/assets/images/logo-club.png" alt="Logo Club Programadores Argentina" width="210" height="290" />
              </div>
              <div className="container container-1830">
                <div className="row justify-content-center">
                  <div className="col-xl-12">
                    <div className="pp-service-2-title-box">
                      <h3 className="ar-about-us-4-title tp-char-animation display-1">Comunidad<br />
                        Programadores<br />Argentina <img className="tp_fade_anim" style={{ borderRadius: '5px', marginBottom: '10px', marginLeft: '10px' }} data-delay="2.5" data-fade-from="top" data-ease="bounce" src="/assets/images/argentina-flag.webp" alt="Bandera Argentina" width="58" height="42" /></h3>
                    </div>
                  </div>
                </div><div className="it-hero-btn-box d-flex align-items-center flex-wrap">
                  <div className="tp_fade_anim" data-delay=".5" data-fade-from="top" data-ease="bounce">
                    <a className="tp-btn-black-radius btn-blue-bg  d-inline-flex align-items-center justify-content-between mr-15" href="/club">
                      <span>
                        <span className="text-1">Unirse al Club</span>
                        <span className="text-2">Unirme!</span>
                      </span>
                      <i>
                        <span>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 11L11 1M11 1H1M11 1V11" stroke="#21212D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 11L11 1M11 1H1M11 1V11" stroke="#21212D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </i>
                    </a>
                  </div>
                  <div className="tp_fade_anim" data-delay=".7" data-fade-from="top" data-ease="bounce">
                    <a className="tp-btn-black-radius btn-blue-bg btn-border d-inline-flex align-items-center justify-content-between" href="contact-us-dark.html">
                      <span>
                        <span className="text-1">Contactarnos</span>
                        <span className="text-2">Contactar</span>
                      </span>
                      <i>
                        <span>
                          <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 2.5C16 1.675 15.325 1 14.5 1H2.5C1.675 1 1 1.675 1 2.5M16 2.5V11.5C16 12.325 15.325 13 14.5 13H2.5C1.675 13 1 12.325 1 11.5V2.5M16 2.5L8.5 7.75L1 2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 2.5C16 1.675 15.325 1 14.5 1H2.5C1.675 1 1 1.675 1 2.5M16 2.5V11.5C16 12.325 15.325 13 14.5 13H2.5C1.675 13 1 12.325 1 11.5V2.5M16 2.5L8.5 7.75L1 2.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      </i>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="pp-brand-area ar-brand-style">
              <div className="tp-brand-wrapper z-index-1">
                <div className="swiper-container tp-brand-active swiper-initialized swiper-horizontal swiper-pointer-events">
                  <div className="swiper-wrapper slide-transtion" id="swiper-wrapper-109618055a3598e4c" aria-live="off" style={{ transitionDuration: '12000ms', transform: 'translate3d(-2488.96px, 0px, 0px)' }}><div className="swiper-slide swiper-slide-duplicate" data-swiper-slide-index="0" role="group" aria-label="1 / 5" style={{ marginRight: '30px' }}>
                    <div className="pp-brand-item">
                      <span className="pp-brand-title">DESARROLLADORES</span>
                      <span className="pp-brand-icon"><svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M16.384 0H14.2411V12.4133L5.46352 3.63578L3.94829 5.15102L12.7258 13.9286H0.3125V16.0715H12.7258L3.94829 24.849L5.46352 26.3642L14.2411 17.5866V30H16.384V17.5866L25.1615 26.3642L26.6767 24.849L17.8991 16.0715H30.3125V13.9286H17.8991L26.6767 5.151L25.1615 3.63578L16.384 12.4133V0Z" fill="#FFF669"></path>
                      </svg></span>
                    </div>
                  </div>
                    <div className="swiper-slide swiper-slide-prev" data-swiper-slide-index="2" role="group" aria-label="3 / 5" style={{ marginRight: '30px' }}>
                      <div className="pp-brand-item">
                        <span className="pp-brand-title">RECLUTADORES</span>
                        <span className="pp-brand-icon"><svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M16.384 0H14.2411V12.4133L5.46352 3.63578L3.94829 5.15102L12.7258 13.9286H0.3125V16.0715H12.7258L3.94829 24.849L5.46352 26.3642L14.2411 17.5866V30H16.384V17.5866L25.1615 26.3642L26.6767 24.849L17.8991 16.0715H30.3125V13.9286H17.8991L26.6767 5.151L25.1615 3.63578L16.384 12.4133V0Z" fill="#FFF669"></path>
                        </svg></span>
                      </div>
                    </div>
                    <div className="swiper-slide swiper-slide-active" data-swiper-slide-index="3" role="group" aria-label="4 / 5" style={{ marginRight: '30px' }}>
                      <div className="pp-brand-item">
                        <span className="pp-brand-title">CIBERSEGURIDAD</span>
                        <span className="pp-brand-icon"><svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M16.384 0H14.2411V12.4133L5.46352 3.63578L3.94829 5.15102L12.7258 13.9286H0.3125V16.0715H12.7258L3.94829 24.849L5.46352 26.3642L14.2411 17.5866V30H16.384V17.5866L25.1615 26.3642L26.6767 24.849L17.8991 16.0715H30.3125V13.9286H17.8991L26.6767 5.151L25.1615 3.63578L16.384 12.4133V0Z" fill="#FFF669"></path>
                        </svg></span>
                      </div>
                    </div>
                    <div className="swiper-slide swiper-slide-next" data-swiper-slide-index="4" role="group" aria-label="5 / 5" style={{ marginRight: '30px' }}>
                      <div className="pp-brand-item">
                        <span className="pp-brand-title">DISEÑADORES</span>
                        <span className="pp-brand-icon"><svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M16.384 0H14.2411V12.4133L5.46352 3.63578L3.94829 5.15102L12.7258 13.9286H0.3125V16.0715H12.7258L3.94829 24.849L5.46352 26.3642L14.2411 17.5866V30H16.384V17.5866L25.1615 26.3642L26.6767 24.849L17.8991 16.0715H30.3125V13.9286H17.8991L26.6767 5.151L25.1615 3.63578L16.384 12.4133V0Z" fill="#FFF669"></path>
                        </svg></span>
                      </div>
                    </div>
                    <div className="swiper-slide swiper-slide-duplicate" data-swiper-slide-index="0" role="group" aria-label="1 / 5" style={{ marginRight: '30px' }}>
                      <div className="pp-brand-item">
                        <span className="pp-brand-title">EMPRENDEDORES</span>
                        <span className="pp-brand-icon"><svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M16.384 0H14.2411V12.4133L5.46352 3.63578L3.94829 5.15102L12.7258 13.9286H0.3125V16.0715H12.7258L3.94829 24.849L5.46352 26.3642L14.2411 17.5866V30H16.384V17.5866L25.1615 26.3642L26.6767 24.849L17.8991 16.0715H30.3125V13.9286H17.8991L26.6767 5.151L25.1615 3.63578L16.384 12.4133V0Z" fill="#FFF669"></path>
                        </svg></span>
                      </div>
                    </div><div className="swiper-slide swiper-slide-duplicate" data-swiper-slide-index="1" role="group" aria-label="2 / 5" style={{ marginRight: '30px' }}>
                      <div className="pp-brand-item">
                        <span className="pp-brand-title">LIDERES</span>
                        <span className="pp-brand-icon"><svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M16.384 0H14.2411V12.4133L5.46352 3.63578L3.94829 5.15102L12.7258 13.9286H0.3125V16.0715H12.7258L3.94829 24.849L5.46352 26.3642L14.2411 17.5866V30H16.384V17.5866L25.1615 26.3642L26.6767 24.849L17.8991 16.0715H30.3125V13.9286H17.8991L26.6767 5.151L25.1615 3.63578L16.384 12.4133V0Z" fill="#FFF669"></path>
                        </svg></span>
                      </div>
                    </div><div className="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-prev" data-swiper-slide-index="2" role="group" aria-label="3 / 5" style={{ marginRight: '30px' }}>
                      <div className="pp-brand-item">
                        <span className="pp-brand-title">INTELIGENCIA ARTIFICIAL</span>
                        <span className="pp-brand-icon"><svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M16.384 0H14.2411V12.4133L5.46352 3.63578L3.94829 5.15102L12.7258 13.9286H0.3125V16.0715H12.7258L3.94829 24.849L5.46352 26.3642L14.2411 17.5866V30H16.384V17.5866L25.1615 26.3642L26.6767 24.849L17.8991 16.0715H30.3125V13.9286H17.8991L26.6767 5.151L25.1615 3.63578L16.384 12.4133V0Z" fill="#FFF669"></path>
                        </svg></span>
                      </div>
                    </div><div className="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-active" data-swiper-slide-index="3" role="group" aria-label="4 / 5" style={{ marginRight: '30px' }}>
                      <div className="pp-brand-item">
                        <span className="pp-brand-title">CEOs</span>
                        <span className="pp-brand-icon"><svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M16.384 0H14.2411V12.4133L5.46352 3.63578L3.94829 5.15102L12.7258 13.9286H0.3125V16.0715H12.7258L3.94829 24.849L5.46352 26.3642L14.2411 17.5866V30H16.384V17.5866L25.1615 26.3642L26.6767 24.849L17.8991 16.0715H30.3125V13.9286H17.8991L26.6767 5.151L25.1615 3.63578L16.384 12.4133V0Z" fill="#FFF669"></path>
                        </svg></span>
                      </div>
                    </div><div className="swiper-slide swiper-slide-duplicate swiper-slide-duplicate-next" data-swiper-slide-index="4" role="group" aria-label="5 / 5" style={{ marginRight: '30px' }}>
                      <div className="pp-brand-item">
                        <span className="pp-brand-title">DATA</span>
                        <span className="pp-brand-icon"><svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M16.384 0H14.2411V12.4133L5.46352 3.63578L3.94829 5.15102L12.7258 13.9286H0.3125V16.0715H12.7258L3.94829 24.849L5.46352 26.3642L14.2411 17.5866V30H16.384V17.5866L25.1615 26.3642L26.6767 24.849L17.8991 16.0715H30.3125V13.9286H17.8991L26.6767 5.151L25.1615 3.63578L16.384 12.4133V0Z" fill="#FFF669"></path>
                        </svg></span>
                      </div>
                    </div></div>
                  <span className="swiper-notification" aria-live="assertive" aria-atomic="true"></span></div>
              </div>
            </div>

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
                  <div className="tp-service-item tp-service-panel">
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
                  <div className="tp-service-item tp-service-panel">
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
                  <div className="tp-service-item tp-service-panel">
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
                </div>
              </div>
            </div>

            <div className="pp-about-area pp-about-ptb p-relative pt-160 pb-160">
              <div className="pp-about-shape">
                <img data-speed=".8" src="/assets/img/home-14/about/about-shape.png" alt="" style={{ translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, -44.3991px)', willChange: 'transform' }} data-lag="0" />
              </div>
              <div className="container container-1430">
                <div className="row">
                  <div className="col-lg-3">
                    <div className="pp-about-left">
                      <span className="tp-section-subtitle-clash clash-subtitle-pos body-ff">
                        OBJETIVO
                        <i>
                          <svg width="102" height="9" viewBox="0 0 102 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M98 8L101.5 4.5L98 1M1 4H101V5H1V4Z" stroke="currentcolor" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </i>
                      </span>
                    </div>
                  </div>
                  <div className="col-lg-9">
                    <div className="pp-about-heading pb-55">
                      <h3 className="tp-section-title-teko fs-80 tp_fade_anim" style={{ translate: 'none', rotate: 'none', scale: 'none', transform: 'translate(0px, 0px)', opacity: 1 }}>
                        Un <span>Espacio de Conexión</span> <br />
                        con profesionales de la región
                      </h3>
                    </div>
                    <div className="pp-about-wrap">
                      <div className="pp-about-content tp_text_anim">
                        <p style={{ perspective: '400px' }}>
                          Programadores Argentina intenta fomentar la comunicación y educación IT en Argentina. Conectamos programadores y todos los talentos tech (testers, Scrum Masters, ciberseguridad, etc.).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="tp-video-area black-bg mt-120 fix">
              <div className="container-fluid p-0">
                <div className="tp-video-thumb-wrap">
                  <div className="tp-video-thumb d-none d-xl-block">
                    <img src="/assets/images/pic-3.webp" alt="" height="500" />
                  </div>
                  <div className="tp-video-thumb mb-25">
                    <video loop muted autoPlay playsInline>
                      <source src="/assets/images/banner-landing-programadoresargentina.mp4" type="video/mp4" />
                    </video>
                  </div>
                  <div className="tp-video-thumb d-none d-md-flex justify-content-center align-items-center mb-25">
                    <img src="/assets/images/pc-programadoresargentina.webp" alt="" style={{ height: '300px', objectFit: 'contain' }} />
                  </div>
                  <div className="tp-video-thumb d-none d-md-flex justify-content-center align-items-center mb-25">
                    <img src="/assets/images/juguito-programadoresargentina.webp" alt="" style={{ height: '300px', objectFit: 'contain' }} />
                  </div>
                  <div className="tp-video-thumb d-none d-xl-block">
                    <img src="/assets/images/pic-2.webp" alt="" />
                  </div>
                  <div className="tp-video-thumb d-none d-xl-block mb-25">
                    <img src="/assets/images/pic-1.webp" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </main>

          <footer>
            <div className="tp-footer-area tp-footer-style-6 pt-120 pb-35" data-bg-color="#1b1b1d">
              <div className="container">
                <div className="row align-items-center">
                  <div className="col-xl-4 col-lg-4 col-md-12">
                    <div className="tp-footer-widget tp-footer-col-1 pb-40 tp_fade_anim" data-delay=".3">
                      <h4 className="tp-footer-widget-title">Colaborando <br /> desde 2018.</h4>
                    </div>
                  </div>
                  <div className="col-xl-5 col-lg-4 col-md-6">
                    <div className="tp-footer-widget tp-footer-col-2 pb-40 tp_fade_anim" data-delay=".5">
                      <h4 className="tp-footer-widget-title-sm pre mb-25">Enlaces rápidos</h4>
                      <div className="tp-footer-widget-menu">
                        <ul>
                          <li><a href="#">Articulos</a></li>
                          <li><a href="/club">Club</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-4 col-md-6">
                    <div className="tp-footer-widget tp-footer-col-3 pb-40 mb-30 tp_fade_anim" data-delay=".7">
                      <h4 className="tp-footer-widget-title-sm pre mb-20">Contacto</h4>
                      <div className="tp-footer-widget-info">
                        <a href="mailto:programadoresargentina@gmail.com">programadoresargentina@gmail.com</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="tp-copyright-area tp-copyright-style-6" data-bg-color="#1b1b1d">
              <div className="container">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="tp-copyright-content text-center text-md-start tp_fade_anim" data-delay=".3" data-fade-from="bottom" data-ease="bounce" data-on-scroll="3">
                      <h2 className="tp-copyright-big-text">argentina</h2>
                    </div>
                  </div>
                </div>
                <div className="tp-copyright-bottom">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="tp-copyright-left text-center text-md-start">
                        <span>©2025 Programadores Argentina.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
