'use client'

import React, { useState, useEffect } from 'react'
import { AuthUser } from '@/contexts/AuthContext'

interface ReferidosTabProps {
  user: AuthUser | null
  token: string | null
}

interface ReferidoData {
  id: string
  referido: {
    id: string
    name: string | null
    email: string
    createdAt: string
    isSubscribed: boolean
  }
  createdAt: string
}

export default function ReferidosTab({ user, token }: ReferidosTabProps) {
  const [referidos, setReferidos] = useState<ReferidoData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Generar URL de referido
  const referralUrl = `${window.location.origin}/club?ref=${user?.id}`

  useEffect(() => {
    if (token) {
      fetchReferidos()
    }
  }, [token])

  const fetchReferidos = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/referidos', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setReferidos(data.referidos || [])
      } else {
        setError('Error al cargar referidos')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  return (
    <div>
      {/* Sección de URL de Referido */}
      <div className="card mb-4" style={{ background: '#1a1b1e', border: '1px solid #3a3b3f' }}>
        <div className="card-body p-4">
          <h5 className="card-title mb-4" style={{ color: '#D0FF71' }}>
            🤝 Invita a tus amigos
          </h5>
          <p style={{ color: '#ffffff', marginBottom: '20px' }}>
            Comparte tu enlace de referido y cuando alguien se suscriba al Club usando tu enlace, 
            ambos recibirán beneficios especiales.
          </p>
          
          <div className="mb-3">
            <label className="form-label" style={{ color: '#D0FF71', fontWeight: '600' }}>
              Tu enlace de referido:
            </label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={referralUrl}
                readOnly
                style={{
                  background: '#2a2b2e',
                  border: '1px solid #3a3b3f',
                  color: '#ffffff',
                  fontSize: '14px'
                }}
              />
              <button
                className="btn"
                onClick={copyToClipboard}
                style={{
                  background: copied ? '#4CAF50' : '#D0FF71',
                  color: '#000000',
                  border: 'none',
                  fontWeight: '600'
                }}
              >
                {copied ? '✓ Copiado' : 'Copiar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Referidos */}
      <div className="card mb-4" style={{ background: '#1a1b1e', border: '1px solid #3a3b3f' }}>
        <div className="card-body p-4">
          <h5 className="card-title mb-4" style={{ color: '#D0FF71' }}>
            👥 Tus referidos ({referidos.length})
          </h5>
          
          {isLoading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2" style={{ color: '#a0a0a0' }}>Cargando referidos...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : referidos.length === 0 ? (
            <div className="text-center py-4">
              <p style={{ color: '#a0a0a0' }}>
                Aún no tienes referidos. ¡Comparte tu enlace para empezar a invitar amigos!
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover">
                <thead>
                  <tr>
                    <th style={{ color: '#D0FF71' }}>Nombre</th>
                    <th style={{ color: '#D0FF71' }}>Email</th>
                    <th style={{ color: '#D0FF71' }}>Estado</th>
                    <th style={{ color: '#D0FF71' }}>Fecha de Referido</th>
                  </tr>
                </thead>
                <tbody>
                  {referidos.map((referido) => (
                    <tr key={referido.id}>
                      <td style={{ color: '#ffffff' }}>
                        {referido.referido.name || 'Sin nombre'}
                      </td>
                      <td style={{ color: '#ffffff' }}>
                        {referido.referido.email}
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: referido.referido.isSubscribed ? '#4CAF50' : '#ff9800',
                            color: '#ffffff',
                            fontSize: '12px'
                          }}
                        >
                          {referido.referido.isSubscribed ? 'Suscrito' : 'Pendiente'}
                        </span>
                      </td>
                      <td style={{ color: '#a0a0a0' }}>
                        {new Date(referido.createdAt).toLocaleDateString('es-AR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Información sobre beneficios */}
      <div className="card" style={{ background: '#1a1b1e', border: '1px solid #3a3b3f' }}>
        <div className="card-body p-4">
          <h5 className="card-title mb-3" style={{ color: '#D0FF71' }}>
            🎁 Beneficios por referir
          </h5>
          <ul style={{ color: '#ffffff', paddingLeft: '20px' }}>
            <li>Por cada amigo que se suscriba usando tu enlace, ambos recibirán un pin especial.</li>
            <li>1 mes gratis de suscripción al Club por cada referido que se suscriba.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
