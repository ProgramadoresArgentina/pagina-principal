'use client'

import React, { useEffect, useState } from 'react'
import Header from '@/app/components/Header'
import MobileHeader from '@/app/components/MobileHeader'
import Footer from '@/app/components/Footer'
import BackToTop from '@/app/components/BackToTop'
import { HoloCard } from 'react-holo-card-effect'

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

                      <h1 className="tp-blog-title tp_fade_anim smooth"> Pines 🏅 <img src="/assets/img/blog/blog-masonry/blog-bradcum-shape.png" alt="" /> <br /> <a href="#down"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M9.99999 1V19M9.99999 19L1 10M9.99999 19L19 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg></a> de la comunidad...</h1>

                      {/* Descripción */}
                      <div className="text-center mt-4">
                        <p className="text-white mb-3" style={{ fontSize: '16px', lineHeight: '1.6', opacity: '0.9' }}>
                          Los pines se pueden exhibir en tu perfil de GitHub <img src="/assets/images/github-icon.svg" alt="GitHub Icon" style={{ width: '56px', height: '56px', margin: '0px 30px', verticalAlign: 'middle', filter: 'brightness(0) invert(1)' }} /> (se actualiza automáticamente cada vez que ganas un nuevo pin).
                        </p>
                        <p className="text-white" style={{ fontSize: '16px', lineHeight: '1.6', opacity: '0.9' }}>
                          Para ver tus pines adquiridos, visitá <a href="/mi-cuenta?tab=badges" className="text-decoration-none" style={{ color: '#D0FF71', fontWeight: 'bold' }}>Mi Cuenta</a>.
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
                      <style jsx global>{`
                        .sc-aXZVg {
                          background-color: transparent !important;
                        }
                      `}</style>
                      {/* Grid de medallas con HoloCard */}
                      <div className="row" style={{ paddingTop: '130px', paddingBottom: '300px', gap: '40px' }}>
                        {pins.map((pin, index) => (
                          <div
                            key={pin.id}
                            className="col-12 col-md-3 d-flex flex-column align-items-center mb-6"
                          >
                            <HoloCard 
                              url={pin.imageUrl} 
                              height={300}
                              showSparkles={false}
                            />
                            <div className="text-center mt-3" style={{ maxWidth: '200px' }}>
                              <p style={{ 
                                fontSize: '14px',
                                lineHeight: '1.4',
                                color: '#FFFFFF',
                                margin: '0',
                                fontWeight: '500'
                              }}>
                                {pin.description || 'Contactá a los administradores de la comunidad para más información.'}
                              </p>
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
