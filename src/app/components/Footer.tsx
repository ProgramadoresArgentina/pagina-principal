import { JSX } from "react";

export default function Footer(): JSX.Element {
  return (
    <footer>
      {/* Footer Area */}
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
                    <li><a href="/articulos">Articulos</a></li>
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

      {/* Copyright Area */}
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
  );
}
