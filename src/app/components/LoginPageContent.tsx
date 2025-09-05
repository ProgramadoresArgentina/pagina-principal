'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LoginForm from '@/app/components/LoginForm'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'

export default function LoginPageContent() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, router, redirectTo])

  return (
    <>
      <Header />

      {/* Main Content */}
      <main>
        <section className="tp-login-area pt-180 pb-140 p-relative z-index-1 fix">
          <div className="container container-1230">
            <div className="row justify-content-center">
              <div className="col-xl-6 col-lg-8">
                <div className="tp-login-wrapper">
                  <div className="tp-login-top text-center mb-20">
                    <h3 className="tp-login-title">Ingresar a Programadores Argentina</h3>
                    <p className="mt-20">¿No tienes cuenta? <span><a href="/club">Suscribete al Club</a></span></p>
                  </div>
                  
                  <div className="tp-login-option">
                    <LoginForm redirectTo={redirectTo} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
