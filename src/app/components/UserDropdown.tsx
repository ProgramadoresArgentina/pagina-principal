'use client'

import React from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function UserDropdown() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  if (!user) return null

  return (
    <button 
      onClick={handleLogout}
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
        <span className="tp-btn-black-text">
          Cerrar sesión
        </span>
        <span className="tp-btn-black-circle">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 9L9 1M9 1H1M9 1V9" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </span>
      </span>
    </button>
  )
}
