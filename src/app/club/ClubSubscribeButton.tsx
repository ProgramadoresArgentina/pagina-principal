'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

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

  const modal = (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 999999,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* inner scroll wrapper */}
      <div
        onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
        style={{
          minHeight: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{
          background: '#111318',
          border: '1px solid rgba(208,255,113,0.2)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '460px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
        }}>
          {/* Modal header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '18px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div>
              <p style={{ margin: 0, color: '#D0FF71', fontSize: '15px', fontWeight: 700 }}>
                Accedé al Club
              </p>
              <p style={{ margin: '3px 0 0', color: '#888', fontSize: '12px' }}>
                Iniciá sesión o creá tu cuenta para continuar
              </p>
            </div>
            <button
              onClick={() => setShowModal(false)}
              style={{
                background: 'rgba(255,255,255,0.07)', border: 'none', cursor: 'pointer',
                color: '#bbb', fontSize: '20px', lineHeight: 1,
                width: '34px', height: '34px', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, marginLeft: '12px',
              }}
            >
              ×
            </button>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            margin: '16px 20px 0',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '10px', padding: '4px', gap: '4px',
          }}>
            {(['login', 'register'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setModalTab(tab)}
                style={{
                  flex: 1, padding: '9px 12px',
                  borderRadius: '7px', border: 'none',
                  cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                  background: modalTab === tab ? '#D0FF71' : 'transparent',
                  color: modalTab === tab ? '#111' : '#666',
                  transition: 'all 0.15s',
                }}
              >
                {tab === 'login' ? 'Iniciar sesión' : 'Registrarse'}
              </button>
            ))}
          </div>

          {/* Form */}
          <div style={{ padding: '20px' }}>
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

            <p style={{ margin: '14px 0 0', fontSize: '11px', color: '#444', textAlign: 'center' }}>
              Serás redirigido a MercadoPago para completar el pago.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

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
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(208,255,113,0.08)', border: '1px solid #D0FF71',
          padding: '12px 20px', borderRadius: '8px', cursor: 'default',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="#D0FF71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ color: '#D0FF71', fontWeight: 600, fontSize: '15px' }}>Ya sos miembro del Club</span>
        </span>
      ) : (
        <button
          type="button"
          onClick={handleSubscribeClick}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            background: '#D0FF71', color: '#111', border: 'none', borderRadius: '8px',
            padding: '14px 28px', fontSize: '15px', fontWeight: 700,
            cursor: 'pointer', transition: 'opacity 0.2s',
            width: '100%', maxWidth: '320px',
            boxShadow: '0 4px 20px rgba(208,255,113,0.25)',
          }}
          onMouseOver={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseOut={e => (e.currentTarget.style.opacity = '1')}
        >
          <span>Suscribirme — $4000/mes</span>
          <svg width="14" height="14" viewBox="0 0 12 12" fill="none">
            <path d="M1 11L11 1M11 1H1M11 1V11" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* ── Auth Modal — rendered via portal directly in document.body
           to escape GSAP ScrollSmoother's CSS transform context ── */}
      {showModal && mounted && createPortal(modal, document.body)}
    </>
  )
}
