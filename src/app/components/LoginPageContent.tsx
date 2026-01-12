'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LoginForm from '@/app/components/LoginForm'
import Navigation from '@/app/components/Navigation'
import MobileHeader from '@/app/components/MobileHeader'
import Footer from '@/app/components/Footer'

export default function LoginPageContent() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams?.get('redirect') || '/'

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, router, redirectTo])

  return (
    <>
      <Navigation />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <div className="it-about-area it-about-ptb pt-200 pb-90 p-relative">
          <div className="it-about-shape-wrap">
            <img data-speed="1.1" className="it-about-shape-1 d-none d-xxl-block" src="/assets/img/home-11/about/about-shape-1.png" alt="" />
            <img data-speed=".9" className="it-about-shape-2" src="/assets/img/home-11/about/about-shape-2.png" alt="" />
          </div>
          
          <div className="container container-1230">
            <div className="row justify-content-center">
              <div className="col-xl-6 col-lg-8">
                <div className="tp-login-wrapper">
                  <div className="tp-login-top text-center mb-20">
                    <h3 className="tp-login-title">Ingresar a Programadores Argentina</h3>
                    <p className="mt-20">¿No tienes cuenta? <span><a href={`/registro?redirect=${encodeURIComponent(redirectTo)}`}>Regístrate aquí</a></span></p>
                  </div>
                  
                  <div className="tp-login-option">
                    <LoginForm redirectTo={redirectTo} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
