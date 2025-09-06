'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface ChatModerationProps {
  onClose: () => void
  onBanUser: (userId: string, reason: string, duration: number) => void
  onBanIp: (ip: string, reason: string, duration: number) => void
}

export default function ChatModeration({ onClose, onBanUser, onBanIp }: ChatModerationProps) {
  const [activeTab, setActiveTab] = useState<'user' | 'ip'>('user')
  const [userId, setUserId] = useState('')
  const [ip, setIp] = useState('')
  const [reason, setReason] = useState('')
  const [duration, setDuration] = useState(60) // minutos
  const [isPermanent, setIsPermanent] = useState(false)
  const { token } = useAuth()

  const handleBanUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId.trim()) {
      alert('Debes ingresar un ID de usuario')
      return
    }

    try {
      const response = await fetch('/api/chat/moderate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'ban_user',
          userId: userId.trim(),
          reason: reason.trim() || 'Sin razón especificada',
          duration: isPermanent ? null : duration
        })
      })

      const data = await response.json()
      if (data.success) {
        alert('Usuario baneado correctamente')
        onBanUser(userId, reason, duration)
        onClose()
      } else {
        alert(data.error || 'Error al banear usuario')
      }
    } catch (error) {
      console.error('Error banning user:', error)
      alert('Error al banear usuario')
    }
  }

  const handleBanIp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ip.trim()) {
      alert('Debes ingresar una IP')
      return
    }

    try {
      const response = await fetch('/api/chat/moderate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'ban_ip',
          ip: ip.trim(),
          reason: reason.trim() || 'Sin razón especificada',
          duration: isPermanent ? null : duration
        })
      })

      const data = await response.json()
      if (data.success) {
        alert('IP baneada correctamente')
        onBanIp(ip, reason, duration)
        onClose()
      } else {
        alert(data.error || 'Error al banear IP')
      }
    } catch (error) {
      console.error('Error banning IP:', error)
      alert('Error al banear IP')
    }
  }

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Moderación del Chat</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          
          <div className="modal-body">
            <ul className="nav nav-tabs mb-3">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'user' ? 'active' : ''}`}
                  onClick={() => setActiveTab('user')}
                >
                  Banear Usuario
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'ip' ? 'active' : ''}`}
                  onClick={() => setActiveTab('ip')}
                >
                  Banear IP
                </button>
              </li>
            </ul>

            {activeTab === 'user' && (
              <form onSubmit={handleBanUser}>
                <div className="mb-3">
                  <label className="form-label">ID del Usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Ingresa el ID del usuario a banear"
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Razón del Ban</label>
                  <textarea
                    className="form-control"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Razón del ban (opcional)"
                    rows={3}
                  />
                </div>

                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="permanent"
                      checked={isPermanent}
                      onChange={(e) => setIsPermanent(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="permanent">
                      Ban permanente
                    </label>
                  </div>
                </div>

                {!isPermanent && (
                  <div className="mb-3">
                    <label className="form-label">Duración (minutos)</label>
                    <select
                      className="form-select"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                    >
                      <option value={15}>15 minutos</option>
                      <option value={60}>1 hora</option>
                      <option value={240}>4 horas</option>
                      <option value={1440}>1 día</option>
                      <option value={10080}>1 semana</option>
                    </select>
                  </div>
                )}

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-danger">
                    <i className="fas fa-ban me-1"></i>
                    Banear Usuario
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Cancelar
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'ip' && (
              <form onSubmit={handleBanIp}>
                <div className="mb-3">
                  <label className="form-label">Dirección IP</label>
                  <input
                    type="text"
                    className="form-control"
                    value={ip}
                    onChange={(e) => setIp(e.target.value)}
                    placeholder="Ej: 192.168.1.1"
                    required
                  />
                  <div className="form-text">
                    Esta IP será baneada del chat global
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Razón del Ban</label>
                  <textarea
                    className="form-control"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Razón del ban (opcional)"
                    rows={3}
                  />
                </div>

                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="permanentIp"
                      checked={isPermanent}
                      onChange={(e) => setIsPermanent(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="permanentIp">
                      Ban permanente
                    </label>
                  </div>
                </div>

                {!isPermanent && (
                  <div className="mb-3">
                    <label className="form-label">Duración (minutos)</label>
                    <select
                      className="form-select"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                    >
                      <option value={15}>15 minutos</option>
                      <option value={60}>1 hora</option>
                      <option value={240}>4 horas</option>
                      <option value={1440}>1 día</option>
                      <option value={10080}>1 semana</option>
                    </select>
                  </div>
                )}

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-danger">
                    <i className="fas fa-ban me-1"></i>
                    Banear IP
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}