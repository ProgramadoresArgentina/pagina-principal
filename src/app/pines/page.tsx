'use client'

import React, { useEffect, useState } from 'react'
import Header from '@/app/components/Header'
import MobileHeader from '@/app/components/MobileHeader'
import Footer from '@/app/components/Footer'
import BackToTop from '@/app/components/BackToTop'

interface Pin {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
  category: string | null;
}

export default function MedallasPage() {
  const [pins, setPins] = useState<Pin[]>([])
  const [loading, setLoading] = useState(true)
  const [visiblePins, setVisiblePins] = useState<number[]>([])
  const [flippedPins, setFlippedPins] = useState<number[]>([])

  useEffect(() => {
    const loadPins = async () => {
      try {
        const res = await fetch('/api/pins')
        if (res.ok) {
          const data = await res.json()
          setPins(data.pins || [])
        }
      } catch (error) {
        console.error('Error al cargar pins:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPins()
  }, [])

  useEffect(() => {
    if (pins.length > 0) {
      // Animar la aparición de los pins uno por uno
      pins.forEach((_, index) => {
        setTimeout(() => {
          setVisiblePins(prev => [...prev, index])
        }, index * 200) // 200ms de delay entre cada pin
      })
    }
  }, [pins])

  const handlePinClick = (index: number) => {
    setFlippedPins(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    )
  }

  if (loading) {
    return (
      <>
        <BackToTop />
        <Header />
        <MobileHeader />
        <div className="body-overlay"></div>
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <main>
              <div className="tp-breadcrumb-area tp-breadcrumb-ptb" data-background="/assets/img/blog/blog-masonry/blog-bradcum-bg.png">
                <div className="container container-1330">
                  <div className="row justify-content-center">
                    <div className="col-xxl-12">
                      <div className="tp-blog-heading-wrap p-relative pb-130">
                        <span className="tp-section-subtitle pre tp_fade_anim">Pines <svg xmlns="http://www.w3.org/2000/svg" width="81" height="9" viewBox="0 0 81 9" fill="none">
                            <rect y="4.04333" width="80" height="1" fill="white" />
                            <path d="M77 8.00783L80.5 4.52527L77 1.04271" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <h1 className="tp-blog-title tp_fade_anim smooth">🏆 Pines <img src="/assets/img/blog/blog-masonry/blog-bradcum-shape.png" alt="" /> <br /> <a href="#down"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M9.99999 1V19M9.99999 19L1 10M9.99999 19L19 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg></a> de la comunidad...</h1>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tp-blog-area">
                <div className="container container-1330">
                  <div className="row">
                    <div className="col-12">
                      <div className="tp-blog-wrapper">
                        <div className="text-center">
                          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
                          <p className="mt-4 text-gray-400">Cargando pines...</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
            <Footer />
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <BackToTop />
      <Header />
      <MobileHeader />
      <div className="body-overlay"></div>
      {/* offcanvas area end */}
    
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            {/* breadcurmb area start */}
            <div className="tp-breadcrumb-area tp-breadcrumb-ptb" data-background="/assets/img/blog/blog-masonry/blog-bradcum-bg.png">
              <div className="container container-1330">
                <div className="row justify-content-center">
                  <div className="col-xxl-12">
                    <div className="tp-blog-heading-wrap p-relative pb-64">
                      <span className="tp-section-subtitle pre tp_fade_anim">Pines <svg xmlns="http://www.w3.org/2000/svg" width="81" height="9" viewBox="0 0 81 9" fill="none">
                          <rect y="4.04333" width="80" height="1" fill="white" />
                          <path d="M77 8.00783L80.5 4.52527L77 1.04271" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>

                      <h1 className="tp-blog-title tp_fade_anim smooth">🏆 Pines <img src="/assets/img/blog/blog-masonry/blog-bradcum-shape.png" alt="" /> <br /> <a href="#down"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M9.99999 1V19M9.99999 19L1 10M9.99999 19L19 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg></a> de la comunidad...</h1>

                      {/* Descripción */}
                      <div className="text-center mt-4">
                        <p className="text-white mb-3" style={{ fontSize: '16px', lineHeight: '1.6', opacity: '0.9' }}>
                          Los pines se pueden exhibir en tu perfil de GitHub. Hacé hover sobre cada medalla para ver cómo ganarla.
                        </p>
                        <p className="text-white" style={{ fontSize: '16px', lineHeight: '1.6', opacity: '0.9' }}>
                          Para ver tus pines adquiridos, visitá <a href="/mi-cuenta" className="text-decoration-none" style={{ color: '#D0FF71', fontWeight: 'bold' }}>Mi Cuenta</a>.
                        </p>
                      </div>

                      <div className="tp-blog-shape">
                        <span><svg xmlns="http://www.w3.org/2000/svg" width="109" height="109" viewBox="0 0 109 109" fill="none">
                          <path d="M46.8918 0.652597C52.0111 11.5756 61.1509 45.3262 42.3414 57.6622C32.5453 63.8237 11.8693 68.6772 1.79348 40.7372C-2.00745 30.1973 6.53261 20.5828 26.243 25.965C37.6149 29.0703 65.0949 36.1781 78.8339 57.5398C86.0851 68.8141 93.074 92.3859 89.9278 107.942M89.9278 107.942C90.8943 100.431 95.9994 85.8585 108.687 87.6568M89.9278 107.942C90.4304 103.013 86.878 91.2724 68.6481 83.7468M63.5129 27.0092C68.0375 28.7613 82.5356 36.982 88.0712 51.886" stroke="white" strokeWidth="1.5" />
                        </svg></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* breadcurmb area end */}

            {/* medallas area start */}
            <div className="tp-blog-area">
              <div className="container container-1330">
                <div className="row">
                  <div className="col-12">
                    <div className="tp-blog-wrapper">
                      <style jsx>{`
                        .pin-column {
                          flex: 0 0 auto;
                          width: 50%;
                        }
                        
                        @media (min-width: 768px) {
                          .pin-column {
                            width: 20%;
                          }
                        }
                        
                        .sticker-container {
                          perspective: 1000px;
                          width: 100%;
                          height: 220px;
                          max-width: 220px;
                        }
                        
                        .sticker {
                          position: relative;
                          width: 100%;
                          height: 100%;
                          transform-style: preserve-3d;
                          transition: transform 0.6s;
                          cursor: pointer;
                        }
                        
                        .sticker.flipped {
                          transform: rotateY(180deg);
                        }
                        
                        .sticker-container:hover .sticker-front::before {
                          animation: holographic 1.5s ease infinite;
                        }
                        
                        @media (min-width: 768px) {
                          .sticker-container:hover .sticker {
                            transform: rotateY(180deg);
                          }
                        }
                        
                        .sticker-front, .sticker-back {
                          position: absolute;
                          width: 100%;
                          height: 100%;
                          backface-visibility: hidden;
                          display: flex;
                          align-items: center;
                          justify-content: center;
                          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                          border-radius: 12px;
                          overflow: hidden;
                        }
                        
                        .sticker-front {
                          background: linear-gradient(135deg, #1a1b1e 0%, #2d2e32 100%);
                          position: relative;
                        }
                        
                        .sticker-front::before {
                          content: '';
                          position: absolute;
                          top: 0;
                          left: 0;
                          right: 0;
                          bottom: 0;
                          background: linear-gradient(
                            135deg,
                            transparent 0%,
                            rgba(255, 255, 255, 0.1) 25%,
                            rgba(255, 255, 255, 0.2) 50%,
                            rgba(255, 255, 255, 0.1) 75%,
                            transparent 100%
                          );
                          background-size: 200% 200%;
                          animation: holographic 3s ease infinite;
                          pointer-events: none;
                          mix-blend-mode: overlay;
                        }
                        
                        .sticker-front::after {
                          content: '';
                          position: absolute;
                          top: 0;
                          left: 0;
                          right: 0;
                          bottom: 0;
                          background: 
                            repeating-linear-gradient(
                              0deg,
                              rgba(208, 255, 113, 0.03) 0px,
                              rgba(208, 255, 113, 0.03) 1px,
                              transparent 1px,
                              transparent 2px
                            ),
                            repeating-linear-gradient(
                              90deg,
                              rgba(208, 255, 113, 0.03) 0px,
                              rgba(208, 255, 113, 0.03) 1px,
                              transparent 1px,
                              transparent 2px
                            );
                          pointer-events: none;
                        }
                        
                        @keyframes holographic {
                          0% {
                            background-position: 0% 0%;
                          }
                          50% {
                            background-position: 100% 100%;
                          }
                          100% {
                            background-position: 0% 0%;
                          }
                        }
                        
                        .sticker-back {
                          background: linear-gradient(135deg, #2d2e32 0%, #1a1b1e 100%);
                          transform: rotateY(180deg);
                          width: 100%;
                          height: 100%;
                          border-radius: 12px;
                          top: 0;
                          left: 0;
                        }
                        
                        .sticker-back img {
                          width: 80px;
                          height: 80px;
                          margin-bottom: 10px;
                        }
                      `}</style>
                      {/* Grid de medallas como stickers */}
                      <div className="row g-4" style={{ paddingTop: '130px',paddingBottom: '300px' }}>
                        {pins.map((pin, index) => (
                          <div
                            key={pin.id}
                            className={`pin-column d-flex justify-content-center transform transition-all duration-700 ease-out ${
                              visiblePins.includes(index) 
                                ? 'opacity-100 translate-y-0 scale-100' 
                                : 'opacity-0 translate-y-8 scale-95'
                            }`}
                            style={{
                              transitionDelay: `${index * 200}ms`
                            }}
                          >
                            {/* Sticker con efecto flip */}
                            <div 
                              className="sticker-container"
                              onClick={() => handlePinClick(index)}
                            >
                              <div className={`sticker ${flippedPins.includes(index) ? 'flipped' : ''}`}>
                                {/* Frente del sticker */}
                                <div className="sticker-front">
                                  <img 
                                    src={pin.imageUrl} 
                                    alt={pin.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                </div>
                                
                                {/* Reverso del sticker */}
                                <div className="sticker-back">
                                  <div className="text-center flex flex-col items-center justify-center h-full" style={{ padding: '20px' }}>
                                    <p style={{ 
                                      fontSize: (pin.description || '').length > 80 ? '14px' : (pin.description || '').length > 50 ? '15px' : '16px',
                                      lineHeight: '1.5',
                                      textTransform: 'uppercase',
                                      fontWeight: '600',
                                      color: '#FFD700',
                                      textShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
                                    }}>
                                      {pin.description || 'Contactá a los administradores de la comunidad para más información.'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* medallas area end */}
          </main>

          <Footer />
        </div>
      </div>
    </>
  )
}
