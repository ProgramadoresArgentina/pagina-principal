import { Suspense } from 'react'
import LoginPageContent from '@/app/components/LoginPageContent'

function LoginPageFallback() {
  return (
    <>
      <div className="tp-login-area pt-180 pb-140 p-relative z-index-1 fix">
        <div className="container container-1230">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-8">
              <div className="tp-login-wrapper">
                <div className="tp-login-top text-center mb-20">
                  <h3 className="tp-login-title">Cargando...</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent />
    </Suspense>
  )
}
