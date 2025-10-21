'use client'

import React, { useEffect, useState } from 'react'

interface UserPin {
  id: string;
  earnedAt: string;
  pin: {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string;
    category: string | null;
  };
}

interface AllBadgesTabProps {
  token: string | null;
  userPins: UserPin[];
}

export default function AllBadgesTab({ token, userPins }: AllBadgesTabProps) {
  const [allPins, setAllPins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAllPins = async () => {
      try {
        const res = await fetch('/api/pins', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (res.ok) {
          const data = await res.json()
          setAllPins(data.pins || [])
        }
      } catch (error) {
        console.error('Error al cargar todos los pins:', error)
      } finally {
        setLoading(false)
      }
    }
    loadAllPins()
  }, [token])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#a0a0a0' }}>Cargando badges disponibles...</p>
      </div>
    )
  }

  return (
    <div style={{ 
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
      gap: '16px'
    }}>
      {allPins.map((pin) => {
        const userHasPin = userPins.some(userPin => userPin.pin.id === pin.id)
        
        return (
          <div 
            key={pin.id}
            style={{
              background: '#2d2e32',
              border: userHasPin ? '1px solid #D0FF71' : '1px solid #3a3b3f',
              padding: '16px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              borderRadius: '6px',
              position: 'relative'
            }}
          >
            {userHasPin && (
              <div style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                background: '#D0FF71',
                color: '#1a1b1e',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '9px',
                fontWeight: '500'
              }}>
                ADQUIRIDO
              </div>
            )}
            
            <div style={{
              width: '60px',
              height: '60px',
              margin: '0 auto 10px',
              overflow: 'hidden',
              border: userHasPin ? '2px solid #D0FF71' : '2px solid #3a3b3f',
              borderRadius: '4px'
            }}>
              <img 
                src={pin.imageUrl} 
                alt={pin.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
            
            <h6 style={{ 
              color: userHasPin ? '#D0FF71' : '#ffffff', 
              fontSize: '13px', 
              fontWeight: '500',
              marginBottom: '6px',
              lineHeight: '1.3'
            }}>
              {pin.name}
            </h6>
            
            <p style={{ 
              color: '#a0a0a0', 
              fontSize: '11px',
              marginBottom: '8px',
              lineHeight: '1.4'
            }}>
              {pin.description}
            </p>
            
          </div>
        )
      })}
    </div>
  )
}

