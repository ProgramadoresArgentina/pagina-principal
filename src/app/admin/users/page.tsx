'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/app/components/Navigation'
import MobileHeader from '@/app/components/MobileHeader'
import Footer from '@/app/components/Footer'

// Estilos para los placeholders
const placeholderStyles = `
  .admin-search-input::placeholder {
    color: #a0a0a0 !important;
    opacity: 1;
  }
  .admin-search-input::-webkit-input-placeholder {
    color: #a0a0a0 !important;
  }
  .admin-search-input::-moz-placeholder {
    color: #a0a0a0 !important;
    opacity: 1;
  }
  .admin-search-input:-ms-input-placeholder {
    color: #a0a0a0 !important;
  }
`

interface User {
  id: string;
  name: string | null;
  username: string | null;
  email: string;
  avatar: string | null;
  isSubscribed: boolean;
  subscribedAt: string | null;
  isActive: boolean;
  role: string;
  pinsCount: number;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const { isAuthenticated, isLoading, token } = useAuth()
  const router = useRouter()

  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isSubscribedFilter, setIsSubscribedFilter] = useState<string>('')
  const [updatingUsers, setUpdatingUsers] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/ingresar?redirect=/admin/users')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (token) {
      loadUsers()
    }
  }, [token, pagination.page, searchTerm, isSubscribedFilter])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })
      if (searchTerm) {
        params.append('search', searchTerm)
      }
      if (isSubscribedFilter !== '') {
        params.append('isSubscribed', isSubscribedFilter)
      }

      const res = await fetch(`/api/admin/users/list?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        if (res.status === 403) {
          console.error('Sin permisos de administrador')
          router.push('/')
          return
        }
        const errorData = await res.json()
        console.error('Error response:', errorData)
        throw new Error('Error al cargar usuarios')
      }

      const data = await res.json()
      console.log('Usuarios cargados:', data)
      setUsers(data.users)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchTerm(search)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleToggleSubscription = async (userId: string, currentStatus: boolean) => {
    if (updatingUsers.has(userId)) return

    try {
      setUpdatingUsers(prev => new Set(prev).add(userId))
      
      const res = await fetch('/api/admin/update-subscription', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          isSubscribed: !currentStatus,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error('Error al actualizar suscripción:', errorData)
        alert('Error al actualizar suscripción: ' + (errorData.error || 'Error desconocido'))
        return
      }

      // Actualizar el estado local
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, isSubscribed: !currentStatus } : user
        )
      )
    } catch (error) {
      console.error('Error al actualizar suscripción:', error)
      alert('Error al actualizar suscripción')
    } finally {
      setUpdatingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  const handleResetPassword = async (userId: string) => {
    if (updatingUsers.has(userId)) return

    if (!confirm('¿Estás seguro de resetear la contraseña a "programadoresargentina"? El usuario deberá cambiarla después.')) {
      return
    }

    try {
      setUpdatingUsers(prev => new Set(prev).add(userId))
      
      const res = await fetch('/api/admin/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error('Error al resetear contraseña:', errorData)
        alert('Error al resetear contraseña: ' + (errorData.error || 'Error desconocido'))
        return
      }

      const data = await res.json()
      alert(`✅ Contraseña reseteada exitosamente. Nueva contraseña: ${data.defaultPassword}`)
    } catch (error) {
      console.error('Error al resetear contraseña:', error)
      alert('Error al resetear contraseña')
    } finally {
      setUpdatingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  const handleFilterChange = (value: string) => {
    setIsSubscribedFilter(value)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const getTimeAgo = (dateString: string): string => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'menos de un minuto'
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} ${hours === 1 ? 'hora' : 'horas'}`
    }
    if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} ${days === 1 ? 'día' : 'días'}`
    }
    if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000)
      return `${months} ${months === 1 ? 'mes' : 'meses'}`
    }
    const years = Math.floor(diffInSeconds / 31536000)
    return `${years} ${years === 1 ? 'año' : 'años'}`
  }

  if (isLoading || loading) {
    return (
      <>
        <Navigation />
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
      <style dangerouslySetInnerHTML={{ __html: placeholderStyles }} />
      <Navigation />
      <main style={{ background: '#0a0b0d', minHeight: '100vh' }}>
        <section className="pt-120 pb-140">
          <div className="container container-1230">
            <div className="row justify-content-center">
              <div className="col-xl-12">
                {/* Header */}
                <div className="mb-40">
                  <h2 style={{ color: '#D0FF71', marginBottom: '10px' }}>
                    Administración de Usuarios
                  </h2>
                  <p style={{ color: '#a0a0a0', fontSize: '14px' }}>
                    Gestiona los usuarios y sus suscripciones del club
                  </p>
                </div>

                {/* Search and Filters */}
                <div className="mb-30">
                  <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                    <input
                      type="text"
                      placeholder="Buscar por nombre, usuario o email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{
                        flex: 1,
                        background: '#1a1b1e',
                        border: '1px solid #3a3b3f',
                        color: '#ffffff',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                      }}
                      className="admin-search-input"
                    />
                    <button
                      type="submit"
                      style={{
                        background: 'linear-gradient(135deg, #D0FF71 0%, #a8d65a 100%)',
                        color: '#1a1b1e',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 24px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      🔍 Buscar
                    </button>
                  </form>
                  
                  {/* Filter by subscription */}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label style={{ color: '#a0a0a0', fontSize: '14px', marginRight: '10px' }}>
                      Filtrar por suscripción:
                    </label>
                    <select
                      value={isSubscribedFilter}
                      onChange={(e) => handleFilterChange(e.target.value)}
                      style={{
                        background: '#1a1b1e',
                        border: '1px solid #3a3b3f',
                        color: '#ffffff',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        cursor: 'pointer',
                        minWidth: '200px',
                      }}
                    >
                      <option value="">Todos</option>
                      <option value="true">Con suscripción</option>
                      <option value="false">Sin suscripción</option>
                    </select>
                  </div>
                </div>

                {/* Stats */}
                <div className="mb-30" style={{
                  background: '#1a1b1e',
                  border: '1px solid #3a3b3f',
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  gap: '30px',
                  flexWrap: 'wrap',
                }}>
                  <p style={{ color: '#a0a0a0', marginBottom: '0', fontSize: '14px' }}>
                    Total de usuarios: <strong style={{ color: '#D0FF71' }}>{pagination.total}</strong>
                  </p>
                  <p style={{ color: '#a0a0a0', marginBottom: '0', fontSize: '14px' }}>
                    Con suscripción: <strong style={{ color: '#4CAF50' }}>{users.filter(u => u.isSubscribed).length}</strong>
                  </p>
                  <p style={{ color: '#a0a0a0', marginBottom: '0', fontSize: '14px' }}>
                    Sin suscripción: <strong style={{ color: '#FFA500' }}>{users.filter(u => !u.isSubscribed).length}</strong>
                  </p>
                </div>

                {/* Users Table */}
                <div style={{
                  background: '#1a1b1e',
                  border: '1px solid #3a3b3f',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#2d2e32', borderBottom: '1px solid #3a3b3f' }}>
                          <th style={{ padding: '16px', textAlign: 'left', color: '#D0FF71', fontSize: '13px', fontWeight: '600' }}>
                            Usuario
                          </th>
                          <th style={{ padding: '16px', textAlign: 'left', color: '#D0FF71', fontSize: '13px', fontWeight: '600' }}>
                            Email
                          </th>
                          <th style={{ padding: '16px', textAlign: 'center', color: '#D0FF71', fontSize: '13px', fontWeight: '600' }}>
                            Rol
                          </th>
                          <th style={{ padding: '16px', textAlign: 'center', color: '#D0FF71', fontSize: '13px', fontWeight: '600' }}>
                            Suscripción
                          </th>
                          <th style={{ padding: '16px', textAlign: 'center', color: '#D0FF71', fontSize: '13px', fontWeight: '600' }}>
                            Fecha Suscripción
                          </th>
                          <th style={{ padding: '16px', textAlign: 'center', color: '#D0FF71', fontSize: '13px', fontWeight: '600' }}>
                            Suscripto
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr
                            key={user.id}
                            style={{
                              borderBottom: '1px solid #3a3b3f',
                              transition: 'background 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#2d2e32'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <td style={{ padding: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {user.avatar ? (
                                  <img
                                    src={user.avatar}
                                    alt={user.name || 'Avatar'}
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      borderRadius: '50%',
                                      objectFit: 'cover',
                                    }}
                                  />
                                ) : (
                                  <div
                                    style={{
                                      width: '40px',
                                      height: '40px',
                                      borderRadius: '50%',
                                      background: '#3a3b3f',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: '#D0FF71',
                                      fontWeight: '600',
                                    }}
                                  >
                                    {(user.name || user.email).charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div>
                                  <p style={{ color: '#ffffff', marginBottom: '2px', fontSize: '14px', fontWeight: '500' }}>
                                    {user.name || 'Sin nombre'}
                                  </p>
                                  {user.username && (
                                    <p style={{ color: '#a0a0a0', marginBottom: '0', fontSize: '12px' }}>
                                      @{user.username}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '16px' }}>
                              <p style={{ color: '#a0a0a0', marginBottom: '0', fontSize: '13px' }}>
                                {user.email}
                              </p>
                            </td>
                            <td style={{ padding: '16px', textAlign: 'center' }}>
                              <span
                                style={{
                                  background: user.role === 'Administrador' ? 'rgba(208, 255, 113, 0.1)' : '#2d2e32',
                                  color: user.role === 'Administrador' ? '#D0FF71' : '#a0a0a0',
                                  padding: '4px 12px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                }}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td style={{ padding: '16px', textAlign: 'center' }}>
                              <span
                                style={{
                                  background: user.isSubscribed ? 'rgba(76, 175, 80, 0.1)' : 'rgba(255, 165, 0, 0.1)',
                                  color: user.isSubscribed ? '#4CAF50' : '#FFA500',
                                  padding: '4px 12px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                }}
                              >
                                {user.isSubscribed ? '✓ Club' : 'Free'}
                              </span>
                            </td>
                            <td style={{ padding: '16px', textAlign: 'center' }}>
                              {user.subscribedAt ? (
                                <div>
                                  <p style={{ color: '#a0a0a0', marginBottom: '2px', fontSize: '12px' }}>
                                    {new Date(user.subscribedAt).toLocaleDateString('es-AR', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </p>
                                  <p style={{ color: '#666', marginBottom: '0', fontSize: '11px' }}>
                                    Hace {getTimeAgo(user.subscribedAt)}
                                  </p>
                                </div>
                              ) : (
                                <span style={{ color: '#666', fontSize: '12px' }}>—</span>
                              )}
                            </td>
                            <td style={{ padding: '16px', textAlign: 'center' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                                <label
                                  style={{
                                    position: 'relative',
                                    display: 'inline-block',
                                    width: '50px',
                                    height: '26px',
                                    cursor: updatingUsers.has(user.id) ? 'not-allowed' : 'pointer',
                                    opacity: updatingUsers.has(user.id) ? 0.6 : 1,
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={user.isSubscribed}
                                    onChange={() => handleToggleSubscription(user.id, user.isSubscribed)}
                                    disabled={updatingUsers.has(user.id)}
                                    style={{
                                      opacity: 0,
                                      width: 0,
                                      height: 0,
                                    }}
                                  />
                                  <span
                                    style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      right: 0,
                                      bottom: 0,
                                      backgroundColor: user.isSubscribed ? '#4CAF50' : '#3a3b3f',
                                      borderRadius: '26px',
                                      transition: 'background-color 0.3s',
                                    }}
                                  >
                                    <span
                                      style={{
                                        position: 'absolute',
                                        content: '""',
                                        height: '20px',
                                        width: '20px',
                                        left: '3px',
                                        bottom: '3px',
                                        backgroundColor: '#ffffff',
                                        borderRadius: '50%',
                                        transition: 'transform 0.3s',
                                        transform: user.isSubscribed ? 'translateX(24px)' : 'translateX(0)',
                                      }}
                                    />
                                  </span>
                                </label>
                                <button
                                  onClick={() => handleResetPassword(user.id)}
                                  disabled={updatingUsers.has(user.id)}
                                  style={{
                                    background: '#c2185b',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '6px 12px',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    cursor: updatingUsers.has(user.id) ? 'not-allowed' : 'pointer',
                                    opacity: updatingUsers.has(user.id) ? 0.6 : 1,
                                    whiteSpace: 'nowrap',
                                  }}
                                  title="Resetear contraseña a 'programadoresargentina'"
                                >
                                  🔑 Resetear Pass
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div style={{
                      padding: '20px',
                      borderTop: '1px solid #3a3b3f',
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '8px',
                    }}>
                      <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        style={{
                          background: pagination.page === 1 ? '#2d2e32' : '#3a3b3f',
                          color: pagination.page === 1 ? '#666' : '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 16px',
                          fontSize: '13px',
                          cursor: pagination.page === 1 ? 'not-allowed' : 'pointer',
                        }}
                      >
                        ← Anterior
                      </button>
                      <span style={{
                        color: '#a0a0a0',
                        padding: '8px 16px',
                        fontSize: '13px',
                      }}>
                        Página {pagination.page} de {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        style={{
                          background: pagination.page === pagination.totalPages ? '#2d2e32' : '#3a3b3f',
                          color: pagination.page === pagination.totalPages ? '#666' : '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 16px',
                          fontSize: '13px',
                          cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer',
                        }}
                      >
                        Siguiente →
                      </button>
                    </div>
                  )}
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

