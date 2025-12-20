'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function UserDropdown() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isAdmin = user?.role?.name === 'Administrador'

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNavigation = (path: string) => {
    setIsOpen(false)
    router.push(path)
  }

  const handleLogout = async () => {
    setIsOpen(false)
    await logout()
    router.push('/')
  }

  if (!user) return null

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="tp-btn-black btn-green-light-bg"
      >
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
          <span className="tp-btn-black-text" style={{ whiteSpace: 'nowrap' }}>Mi Cuenta</span>
          <span className="tp-btn-black-circle">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </span>
        </span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          background: '#1a1b1e',
          border: '2px solid #D0FF71',
          borderRadius: '8px',
          minWidth: '200px',
          zIndex: 1000,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden'
        }}>
          <button
            onClick={() => handleNavigation('/mi-cuenta')}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              padding: '12px 16px',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#2d2e32'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <span>Mi Cuenta</span>
          </button>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderTop: '1px solid #3a3b3f',
              color: '#dc3545',
              padding: '12px 16px',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#2d2e32'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <span>Cerrar sesión</span>
          </button>

          {isAdmin && (
            <>
              <div style={{
                borderTop: '1px solid #3a3b3f',
                marginTop: '4px',
                paddingTop: '4px'
              }}>
                <button
                  onClick={() => handleNavigation('/admin/users')}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: '#D0FF71',
                    padding: '12px 16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'background 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#2d2e32'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span>Usuarios</span>
                </button>
                <button
                  onClick={() => handleNavigation('/admin/badges')}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderTop: '1px solid #3a3b3f',
                    color: '#D0FF71',
                    padding: '12px 16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'background 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#2d2e32'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span>Badges</span>
                </button>
                <button
                  onClick={() => handleNavigation('/admin/cotizaciones')}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    borderTop: '1px solid #3a3b3f',
                    color: '#D0FF71',
                    padding: '12px 16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'background 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#2d2e32'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span>Cotizaciones</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
