'use client'

import Link from 'next/link'

export default function CreatePostButton() {
  return (
    <div className="text-center mt-4">
      <Link 
        href="/foro/nuevo"
        className="btn"
        style={{
          background: 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)',
          color: '#1a1b1e',
          border: 'none',
          borderRadius: '25px',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: '600',
          textDecoration: 'none',
          display: 'inline-block',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(208, 255, 113, 0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        ✏️ Crear Nuevo Hilo
      </Link>
    </div>
  )
}
