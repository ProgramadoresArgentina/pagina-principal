'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import LoginForm from '@/app/components/LoginForm'
import RegisterForm from '@/app/components/RegisterForm'

const MP_CHECKOUT_URL =
  'https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808497f5faa7019800406b1d03db'

export default function ClubSubscribeButton() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const searchParams = useSearchParams()
  const success = searchParams.get('success')

  const [showModal, setShowModal] = useState(false)
  const [modalTab, setModalTab] = useState<'login' | 'register'>('login')

  // Close modal on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowModal(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [showModal])

  const goToMP = () => {
    window.location.href = MP_CHECKOUT_URL
  }

  const handleSubscribeClick = () => {
    if (!isAuthenticated) {
      setShowModal(true)
      return
    }
    goToMP()
  }

  if (isLoading) {
    return (
      <div style={{ height: '52px', display: 'flex', alignItems: 'center' }}>
        <span style={{ color: '#888', fontSize: '14px' }}>Cargando...</span>
      </div>
    )
  }

  return (
    <>
      {/* ── Success banner ── */}
      {success === 'true' && (
        <div style={{
          background: 'linear-gradient(135deg, #1a1b1e 0%, #2d2e32 100%)',
          border: '1px solid #D0FF71',
          borderRadius: '8px',
          padding: '24px 20px',
          marginBottom: '24px',
          width: '100%',
        }}>
          <div style={{ textAlign: 'center' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ color: '#D0FF71', marginBottom: '12px' }}>
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h4 style={{ color: '#D0FF71', fontSize: '20px', fontWeight: 600, margin: '0 0 10px' }}>
              ¡Suscripción Exitosa!
            </h4>
            <p style={{ color: '#ffffff', fontSize: '15px', lineHeight: 1.6, margin: '0 0 10px' }}>
              Te enviamos un mail de bienvenida con toda la información para acceder al Club.
            </p>
            <p style={{ color: '#D0FF71', fontSize: '14px', margin: 0 }}>
              ¿Consultas? Escribinos a{' '}
              <a href="mailto:programadoresargentina@gmail.com" style={{ color: '#D0FF71', textDecoration: 'underline' }}>
                programadoresargentina@gmail.com
              </a>
            </p>
          </div>
        </div>
      )}

      {/* ── Subscribe button ── */}
      {user?.isSubscribed ? (
        <span
          className="tp-btn-black-radius d-inline-flex align-items-center justify-content-between mr-15"
          style={{ opacity: 0.85, cursor: 'default', background: '#1a2e1a', border: '1px solid #D0FF71', padding: '14px 24px', borderRadius: '6px' }}
        >
          <span style={{ color: '#D0FF71', fontWeight: 600 }}>Ya sos miembro del Club ✓</span>
        </span>
      ) : (
        <button
          type="button"
          onClick={handleSubscribeClick}
          className="tp-btn-black-radius btn-blue-bg d-inline-flex align-items-center justify-content-between mr-15"
          style={{ border: 'none', cursor: 'pointer' }}
        >
          <span>
            <span className="text-1">Suscribirse por $4000 /mes</span>
            <span className="text-2">Suscribirme al Club</span>
          </span>
          <i>
            <span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 11L11 1M11 1H1M11 1V11" stroke="#21212D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 11L11 1M11 1H1M11 1V11" stroke="#21212D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </i>
        </button>
      )}

      {/* ── Auth Modal ── */}
      {showModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
            overflowY: 'auto',
          }}
        >
          <div style={{
            background: '#0d1117', border: '1px solid rgba(208,255,113,0.25)',
            borderRadius: '12px', width: '100%', maxWidth: '480px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            margin: 'auto',
          }}>
            {/* Modal header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>
              <p style={{ margin: 0, color: '#D0FF71', fontSize: '13px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                Para suscribirte necesitás una cuenta
              </p>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: '22px', lineHeight: 1, padding: '0 4px' }}
              >
                ×
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {(['login', 'register'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setModalTab(tab)}
                  style={{
                    flex: 1, padding: '14px', background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: '14px', fontWeight: 600,
                    color: modalTab === tab ? '#D0FF71' : '#666',
                    borderBottom: modalTab === tab ? '2px solid #D0FF71' : '2px solid transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab === 'login' ? 'Iniciar sesión' : 'Registrarse'}
                </button>
              ))}
            </div>

            {/* Form — usa los componentes existentes con sus estilos correctos */}
            <div style={{ padding: '24px' }}>
              {modalTab === 'login' ? (
                <LoginForm
                  onSuccess={() => {
                    setShowModal(false)
                    goToMP()
                  }}
                />
              ) : (
                <RegisterForm
                  onSuccess={() => {
                    setShowModal(false)
                    goToMP()
                  }}
                />
              )}

              <p style={{ margin: '16px 0 0', fontSize: '12px', color: '#555', textAlign: 'center' }}>
                Después de autenticarte serás redirigido al pago en MercadoPago.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
