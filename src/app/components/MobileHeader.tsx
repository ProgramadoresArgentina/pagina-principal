import { JSX } from "react";

export default function MobileHeader(): JSX.Element {
  return (
    <>
      {/* Search Area */}
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

      {/* Offcanvas Area */}
      <div className="tp-offcanvas-area">
        <div className="tp-offcanvas-wrapper offcanvas-black-bg">
          <div className="tp-offcanvas-top d-flex align-items-center justify-content-between">
            <div className="tp-offcanvas-logo">
              <a href="/">
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
    </>
  );
}
