'use client'

import { JSX } from "react";
import { useAuth } from '@/contexts/AuthContext';
import UserDropdown from './UserDropdown';

export default function Header(): JSX.Element {
  const { isAuthenticated, isLoading } = useAuth();
  return (
    <div id="header-sticky" className="tp-header-10-area tp-header-11-style tp-header-blur sticky-black-bg header-11-dark-style header-transparent">
      <div className="container container-1630">
        <div className="tp-header-10-wrapper mt-30">
          <div className="row align-items-center">
            <div className="col-xl-2 col-lg-4 col-md-6 col-5">
              <div className="tp-header-10-logo">
                <a href="/">
                  <img data-width="40" width="40" src="/assets/images/logo.png" alt="Logo Comunidad Programadores Argentina" />
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
                        <a href="/articulos">Artículos de la comunidad</a>
                      </li>
                      <li>
                        <a href="/club/libros">Libros Exclusivos</a>
                      </li>
                      <li className="d-block d-md-none">
                        <a href="/club" className="tp-btn-black btn-transparent-bg">
                              <span className="tp-btn-black-filter-blur">
                                  <svg width="0" height="0">
                                      <defs>
                                          <filter id="buttonFilter11">
                                              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"></feGaussianBlur>
                                              <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"></feColorMatrix>
                                              <feComposite in="SourceGraphic" in2="buttonFilter11" operator="atop"></feComposite>
                                              <feBlend in="SourceGraphic" in2="buttonFilter11"></feBlend>
                                          </filter>
                                      </defs>
                                  </svg>
                              </span>
                              <span className="tp-btn-black-filter d-inline-flex align-items-center" style={{filter: "url(#buttonFilter11)"}}>
                                  <span className="tp-btn-black-text">Unirse al Club</span>
                                  <span className="tp-btn-black-circle">
                                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                      </svg>
                                  </span>
                              </span>
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
                <div className="tp-header-10-right d-flex align-items-center">
                  {/* Botón de autenticación para mobile */}
                  <div className="tp-header-11-btn-box d-block d-md-none ml-20">
                    {!isLoading && (
                      <>
                        {isAuthenticated ? (
                          <UserDropdown />
                        ) : (
                          <a href="/ingresar" className="tp-btn-black btn-green-light-bg">
                              <span className="tp-btn-black-filter-blur">
                                  <svg width="0" height="0">
                                      <defs>
                                          <filter id="buttonFilter11">
                                              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"></feGaussianBlur>
                                              <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"></feColorMatrix>
                                              <feComposite in="SourceGraphic" in2="buttonFilter11" operator="atop"></feComposite>
                                              <feBlend in="SourceGraphic" in2="buttonFilter11"></feBlend>
                                          </filter>
                                      </defs>
                                  </svg>
                              </span>
                              <span className="tp-btn-black-filter d-inline-flex align-items-center" style={{filter: "url(#buttonFilter11)"}}>
                                  <span className="tp-btn-black-text">Ingresar</span>
                                  <span className="tp-btn-black-circle">
                                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                      </svg>
                                  </span>
                              </span>
                          </a>
                        )}
                      </>
                    )}
                  </div>
                  
                  {/* Botón de autenticación para desktop */}
                  <div className="tp-header-11-btn-box d-none d-md-block ml-20">
                    {!isLoading && (
                      <>
                        {isAuthenticated ? (
                          <UserDropdown />
                        ) : (
                          <a href="/ingresar" className="tp-btn-black btn-green-light-bg">
                              <span className="tp-btn-black-filter-blur">
                                  <svg width="0" height="0">
                                      <defs>
                                          <filter id="buttonFilter11">
                                              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"></feGaussianBlur>
                                              <feColorMatrix in="blur" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"></feColorMatrix>
                                              <feComposite in="SourceGraphic" in2="buttonFilter11" operator="atop"></feComposite>
                                              <feBlend in="SourceGraphic" in2="buttonFilter11"></feBlend>
                                          </filter>
                                      </defs>
                                  </svg>
                              </span>
                              <span className="tp-btn-black-filter d-inline-flex align-items-center" style={{filter: "url(#buttonFilter11)"}}>
                                  <span className="tp-btn-black-text">Ingresar</span>
                                  <span className="tp-btn-black-circle">
                                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                      </svg>
                                  </span>
                              </span>
                          </a>
                        )}
                      </>
                    )}
                  </div>
                  
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
  );
}
