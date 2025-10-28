'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { LISTMONK_CONFIG } from '@/lib/listmonk'

interface NewsletterPopupProps {
  onClose: () => void
}

export default function NewsletterPopup({ onClose }: NewsletterPopupProps) {
  const { isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('name', name)
      formData.append('l', LISTMONK_CONFIG.NEWSLETTER_LIST_ID)

      const response = await fetch(LISTMONK_CONFIG.SUBSCRIPTION_URL, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setIsSuccess(true)
        // Guardar en localStorage que el usuario se suscribió
        localStorage.setItem('newsletter_subscribed', 'true')
        localStorage.setItem('user_email', email)
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        setError('Error al suscribirse. Intenta nuevamente.')
      }
    } catch (err) {
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    // Guardar en localStorage que el usuario cerró el popup
    localStorage.setItem('newsletter_popup_closed', 'true')
    onClose()
  }

  if (isSuccess) {
    return (
      <div className="newsletter-popup-overlay">
        <div className="newsletter-popup">
          <div className="newsletter-popup-content">
            <div className="newsletter-success">
              <div className="newsletter-success-icon">✓</div>
              <h3>¡Gracias por suscribirte!</h3>
              <p>Te mantendremos al tanto de las últimas novedades de la comunidad.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="newsletter-popup-overlay">
      <div className="newsletter-popup">
        <button className="newsletter-popup-close" onClick={handleClose}>
          ×
        </button>
        <div className="newsletter-popup-content">
          <div className="newsletter-header">
            <h3 style={{ letterSpacing: '1.5px', fontWeight: '400' }}>¡Únete a nuestra comunidad!</h3>
            <p>Recibe las últimas novedades, eventos y contenido de la Comunidad de Programadores Argentina</p>
          </div>
          
          <form onSubmit={handleSubmit} className="newsletter-form">
            <div className="newsletter-form-group">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu correo electrónico"
                required
                className="newsletter-input"
              />
            </div>
            
            <div className="newsletter-form-group">
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre (opcional)"
                className="newsletter-input"
              />
            </div>


            {error && <div className="newsletter-error">{error}</div>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="newsletter-submit-btn"
            >
              {isSubmitting ? 'Suscribiendo...' : 'Suscribirse'}
            </button>
          </form>
        </div>
      </div>
      
      <style jsx>{`
        .newsletter-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .newsletter-popup {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          max-width: 480px;
          width: 100%;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }

        .newsletter-popup::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #D0FF71, #4CAF50, #2196F3);
        }

        .newsletter-popup-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          color: #999;
          font-size: 24px;
          cursor: pointer;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }

        .newsletter-popup-close:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .newsletter-popup-content {
          padding: 32px;
        }

        .newsletter-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .newsletter-header h3 {
          color: #fff;
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 8px 0;
          font-family: 'ClashDisplay-Medium', sans-serif;
        }

        .newsletter-header p {
          color: #ccc;
          font-size: 14px;
          line-height: 1.5;
          margin: 0;
        }

        .newsletter-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .newsletter-form-group {
          display: flex;
          flex-direction: column;
        }

        .newsletter-input {
          padding: 12px 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .newsletter-input::placeholder {
          color: #999;
        }

        .newsletter-input:focus {
          outline: none;
          border-color: #D0FF71;
          background: rgba(255, 255, 255, 0.08);
        }

        .newsletter-checkbox-group {
          margin: 8px 0;
        }

        .newsletter-checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          cursor: pointer;
          color: #ccc;
          font-size: 13px;
          line-height: 1.4;
        }

        .newsletter-checkbox {
          margin: 0;
          accent-color: #D0FF71;
        }

        .newsletter-checkbox-text {
          flex: 1;
        }

        .newsletter-error {
          color: #ff6b6b;
          font-size: 13px;
          text-align: center;
          padding: 8px;
          background: rgba(255, 107, 107, 0.1);
          border-radius: 6px;
          border: 1px solid rgba(255, 107, 107, 0.2);
        }

        .newsletter-submit-btn {
          background: linear-gradient(135deg, #D0FF71 0%, #4CAF50 100%);
          color: #000;
          border: none;
          padding: 14px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 8px;
        }

        .newsletter-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(208, 255, 113, 0.3);
        }

        .newsletter-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .newsletter-success {
          text-align: center;
          padding: 20px 0;
        }

        .newsletter-success-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #4CAF50, #D0FF71);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #000;
          font-weight: bold;
          margin: 0 auto 16px;
        }

        .newsletter-success h3 {
          color: #fff;
          font-size: 20px;
          margin: 0 0 8px 0;
        }

        .newsletter-success p {
          color: #ccc;
          font-size: 14px;
          margin: 0;
        }

        @media (max-width: 480px) {
          .newsletter-popup {
            margin: 0;
            border-radius: 12px;
          }
          
          .newsletter-popup-content {
            padding: 24px;
          }
          
          .newsletter-header h3 {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  )
}
