'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/app/components/Header'
import MobileHeader from '@/app/components/MobileHeader'
import Footer from '@/app/components/Footer'

interface Pin {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
  category: string | null;
}

interface UserBadge {
  id: string;
  earnedAt: string;
  reason: string | null;
  pin: Pin;
}

interface UserInfo {
  id: string;
  name: string | null;
  username: string | null;
  email: string;
}

export default function UserBadgesDetailPage({ params }: { params: { id: string } }) {
  const { isAuthenticated, isLoading, token } = useAuth()
  const router = useRouter()

  const [user, setUser] = useState<UserInfo | null>(null)
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [availablePins, setAvailablePins] = useState<Pin[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedPin, setSelectedPin] = useState<string>('')
  const [reason, setReason] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/ingresar?redirect=/admin/badges')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (token) {
      loadData()
    }
  }, [token, params.id])

  const loadData = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/users/${params.id}/badges`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        if (res.status === 403) {
          alert('No tienes permisos')
          router.push('/admin/badges')
          return
        }
        throw new Error('Error al cargar datos')
      }

      const data = await res.json()
      setUser(data.user)
      setBadges(data.badges)
      setAvailablePins(data.availablePins)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBadge = async () => {
    if (!selectedPin) {
      setError('Selecciona un badge')
      return
    }

    try {
      setAdding(true)
      setError(null)
      setSuccess(null)

      const res = await fetch(`/api/admin/users/${params.id}/badges`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pinId: selectedPin,
          reason: reason || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Error al asignar badge')
        return
      }

      setSuccess('✅ Badge asignado correctamente')
      setShowAddModal(false)
      setSelectedPin('')
      setReason('')
      
      // Recargar datos
      await loadData()
    } catch (error) {
      setError('Error de red')
    } finally {
      setAdding(false)
    }
  }

  const handleRemoveBadge = async (userPinId: string, pinName: string) => {
    if (!confirm(`¿Seguro que quieres quitar el badge "${pinName}"?`)) {
      return
    }

    try {
      setError(null)
      setSuccess(null)

      const res = await fetch(
        `/api/admin/users/${params.id}/badges?userPinId=${userPinId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Error al eliminar badge')
        return
      }

      setSuccess('✅ Badge eliminado correctamente')
      await loadData()
    } catch (error) {
      setError('Error de red')
    }
  }

  // Filtrar pins disponibles que el usuario no tiene
  const userPinIds = badges.map(b => b.pin.id)
  const pinsToAdd = availablePins.filter(p => !userPinIds.includes(p.id))

  if (isLoading || loading || !user) {
    return (
      <>
        <Header />
        <MobileHeader />
        <main style={{ background: '#0a0b0d', minHeight: '100vh', paddingTop: '120px' }}>
          <div className="container">
            <p style={{ color: '#a0a0a0', textAlign: 'center' }}>Cargando...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <MobileHeader />
      <main style={{ background: '#0a0b0d', minHeight: '100vh' }}>
        <section className="pt-120 pb-140">
          <div className="container container-1230">
            <div className="row justify-content-center">
              <div className="col-xl-10">
                {/* Header */}
                <div className="mb-40">
                  <button
                    onClick={() => router.back()}
                    style={{
                      background: 'transparent',
                      border: '1px solid #3a3b3f',
                      color: '#a0a0a0',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      marginBottom: '20px',
                    }}
                  >
                    ← Volver
                  </button>
                  <h2 style={{ color: '#D0FF71', marginBottom: '10px' }}>
                    Badges de {user.name || user.email}
                  </h2>
                  {user.username && (
                    <p style={{ color: '#a0a0a0', fontSize: '14px' }}>
                      @{user.username}
                    </p>
                  )}
                </div>

                {/* Alerts */}
                {error && (
                  <div style={{
                    background: 'rgba(220, 53, 69, 0.1)',
                    border: '1px solid rgba(220, 53, 69, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: '#dc3545',
                    marginBottom: '20px',
                  }}>
                    {error}
                  </div>
                )}
                {success && (
                  <div style={{
                    background: 'rgba(40, 167, 69, 0.1)',
                    border: '1px solid rgba(40, 167, 69, 0.3)',
                    borderRadius: '8px',
                    padding: '12px',
                    color: '#28a745',
                    marginBottom: '20px',
                  }}>
                    {success}
                  </div>
                )}

                {/* Add Badge Button */}
                <div className="mb-30">
                  <button
                    onClick={() => {
                      setShowAddModal(true)
                      setError(null)
                      setSuccess(null)
                    }}
                    disabled={pinsToAdd.length === 0}
                    style={{
                      background: pinsToAdd.length === 0 
                        ? '#3a3b3f' 
                        : 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)',
                      color: pinsToAdd.length === 0 ? '#666' : '#1a1b1e',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: pinsToAdd.length === 0 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    ➕ Agregar Badge
                  </button>
                  {pinsToAdd.length === 0 && (
                    <p style={{ color: '#a0a0a0', fontSize: '12px', marginTop: '8px', marginBottom: '0' }}>
                      El usuario ya tiene todos los badges disponibles
                    </p>
                  )}
                </div>

                {/* Badges List */}
                <div style={{
                  background: '#1a1b1e',
                  border: '1px solid #3a3b3f',
                  borderRadius: '12px',
                  padding: '24px',
                }}>
                  <h5 style={{ color: '#ffffff', marginBottom: '20px' }}>
                    Badges Actuales ({badges.length})
                  </h5>

                  {badges.length === 0 ? (
                    <p style={{ color: '#a0a0a0', textAlign: 'center', padding: '40px 0' }}>
                      El usuario no tiene badges aún
                    </p>
                  ) : (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                      gap: '20px',
                    }}>
                      {badges.map((badge) => (
                        <div
                          key={badge.id}
                          style={{
                            background: '#2d2e32',
                            border: '2px solid #3a3b3f',
                            borderRadius: '12px',
                            padding: '16px',
                            position: 'relative',
                          }}
                        >
                          <div style={{
                            width: '100%',
                            aspectRatio: '1',
                            marginBottom: '12px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: '3px solid #D0FF71',
                          }}>
                            <img
                              src={badge.pin.imageUrl}
                              alt={badge.pin.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          </div>
                          <h6 style={{
                            color: '#ffffff',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginBottom: '6px',
                            textAlign: 'center',
                          }}>
                            {badge.pin.name}
                          </h6>
                          {badge.pin.description && (
                            <p style={{
                              color: '#a0a0a0',
                              fontSize: '12px',
                              marginBottom: '8px',
                              textAlign: 'center',
                              lineHeight: '1.4',
                            }}>
                              {badge.pin.description}
                            </p>
                          )}
                          <p style={{
                            color: '#666',
                            fontSize: '11px',
                            marginBottom: '12px',
                            textAlign: 'center',
                          }}>
                            {new Date(badge.earnedAt).toLocaleDateString('es-AR')}
                          </p>
                          {badge.reason && (
                            <p style={{
                              color: '#a0a0a0',
                              fontSize: '11px',
                              marginBottom: '12px',
                              textAlign: 'center',
                              fontStyle: 'italic',
                              background: '#1a1b1e',
                              padding: '8px',
                              borderRadius: '6px',
                            }}>
                              "{badge.reason}"
                            </p>
                          )}
                          <button
                            onClick={() => handleRemoveBadge(badge.id, badge.pin.name)}
                            style={{
                              width: '100%',
                              background: 'rgba(220, 53, 69, 0.1)',
                              color: '#dc3545',
                              border: '1px solid rgba(220, 53, 69, 0.3)',
                              borderRadius: '6px',
                              padding: '8px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            🗑️ Quitar
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Add Badge Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={() => !adding && setShowAddModal(false)}
        >
          <div
            style={{
              background: '#1a1b1e',
              border: '2px solid #D0FF71',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 style={{ color: '#D0FF71', marginBottom: '20px' }}>
              ➕ Agregar Badge
            </h4>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#ffffff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                Seleccionar Badge
              </label>
              <select
                value={selectedPin}
                onChange={(e) => setSelectedPin(e.target.value)}
                disabled={adding}
                style={{
                  width: '100%',
                  background: '#2d2e32',
                  border: '1px solid #3a3b3f',
                  color: '#ffffff',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              >
                <option value="">-- Selecciona un badge --</option>
                {pinsToAdd.map((pin) => (
                  <option key={pin.id} value={pin.id}>
                    {pin.name}
                    {pin.category && ` (${pin.category})`}
                  </option>
                ))}
              </select>
            </div>

            {selectedPin && (
              <div style={{ marginBottom: '20px' }}>
                {(() => {
                  const pin = pinsToAdd.find(p => p.id === selectedPin)
                  if (!pin) return null
                  return (
                    <div style={{
                      background: '#2d2e32',
                      border: '1px solid #3a3b3f',
                      borderRadius: '8px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    }}>
                      <img
                        src={pin.imageUrl}
                        alt={pin.name}
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid #D0FF71',
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h6 style={{ color: '#ffffff', marginBottom: '4px', fontSize: '14px' }}>
                          {pin.name}
                        </h6>
                        {pin.description && (
                          <p style={{ color: '#a0a0a0', marginBottom: '0', fontSize: '12px' }}>
                            {pin.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#ffffff', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                Razón (opcional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={adding}
                placeholder="Ej: Participó en Hacktoberfest 2024"
                rows={3}
                style={{
                  width: '100%',
                  background: '#2d2e32',
                  border: '1px solid #3a3b3f',
                  color: '#ffffff',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAddModal(false)}
                disabled={adding}
                style={{
                  background: '#3a3b3f',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: adding ? 'not-allowed' : 'pointer',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleAddBadge}
                disabled={adding || !selectedPin}
                style={{
                  background: adding || !selectedPin
                    ? '#6c757d'
                    : 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)',
                  color: '#1a1b1e',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: adding || !selectedPin ? 'not-allowed' : 'pointer',
                }}
              >
                {adding ? '⏳ Agregando...' : '✅ Agregar Badge'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

