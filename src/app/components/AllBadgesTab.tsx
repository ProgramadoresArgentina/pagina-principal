'use client'

import React, { useEffect, useState } from 'react'

// Estilos para el scrollbar personalizado
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #2d2e32;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #D0FF71;
    border-radius: 4px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #a8d65a;
  }
`

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

  // Agregar estilos al documento
  useEffect(() => {
    const styleElement = document.createElement('style')
    styleElement.textContent = scrollbarStyles
    document.head.appendChild(styleElement)
    
    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

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
    <div 
      className="custom-scrollbar"
      style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        maxHeight: 'calc(100vh - 200px)',
        overflowY: 'auto',
        padding: '20px',
        scrollbarWidth: 'thin',
        scrollbarColor: '#D0FF71 #2d2e32'
      }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        width: '100%',
        maxWidth: '1200px',
        justifyItems: 'center'
      }}>
      {allPins.map((pin) => {
        const userHasPin = userPins.some(userPin => userPin.pin.id === pin.id)
        
        return (
          <div 
            key={pin.id}
            style={{
              background: '#2d2e32',
              border: userHasPin ? '1px solid #D0FF71' : '1px solid #3a3b3f',
              padding: '20px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              borderRadius: '8px',
              position: 'relative',
              height: 'fit-content',
              minHeight: '200px',
              maxWidth: '250px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {userHasPin && (
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: '#D0FF71',
                color: '#1a1b1e',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '10px',
                fontWeight: '600',
                zIndex: 1
              }}>
                ADQUIRIDO
              </div>
            )}
            
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 15px',
              overflow: 'hidden',
              border: userHasPin ? '2px solid #D0FF71' : '2px solid #3a3b3f',
              borderRadius: '6px',
              flexShrink: 0
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
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h6 style={{ 
                color: userHasPin ? '#D0FF71' : '#ffffff', 
                fontSize: '14px', 
                fontWeight: '600',
                marginBottom: '8px',
                lineHeight: '1.3'
              }}>
                {pin.name}
              </h6>
              
              <div style={{ flex: 1 }}>
                <p style={{ 
                  color: '#a0a0a0', 
                  fontSize: '12px',
                  marginBottom: '8px',
                  lineHeight: '1.4',
                }}>
                  {pin.description || 'Pin de la comunidad de Programadores Argentina'}
                </p>
                {/* Mostrar cómo conseguirlo si menciona Club o Bienvenido pero no explica cómo */}
                {(pin.name.toLowerCase().includes('club') || 
                  pin.description?.toLowerCase().includes('club') ||
                  pin.description?.toLowerCase().includes('bienvenido')) && 
                  !pin.description?.toLowerCase().includes('cómo') && 
                  !pin.description?.toLowerCase().includes('como') && 
                  !pin.description?.toLowerCase().includes('conseguir') && 
                  !pin.description?.toLowerCase().includes('obtener') &&
                  !pin.description?.toLowerCase().includes('suscríbete') &&
                  !pin.description?.toLowerCase().includes('suscribete') &&
                  !pin.description?.toLowerCase().includes('referido') && (
                  <p style={{ 
                    color: '#D0FF71', 
                    fontSize: '11px',
                    marginBottom: '0',
                    lineHeight: '1.4',
                    fontWeight: '500'
                  }}>
                    💡 Cómo conseguirlo: Suscríbete al Club en <a href="/club" style={{ color: '#D0FF71', textDecoration: 'underline' }}>programadoresargentina.com/club</a>
                  </p>
                )}
                {/* Mostrar cómo conseguir el pin de invitación */}
                {(pin.name.toLowerCase().includes('invitación') || pin.name.toLowerCase().includes('invitacion')) && 
                  !pin.description?.toLowerCase().includes('cómo') && 
                  !pin.description?.toLowerCase().includes('como') && 
                  !pin.description?.toLowerCase().includes('referido') && (
                  <p style={{ 
                    color: '#D0FF71', 
                    fontSize: '11px',
                    marginBottom: '0',
                    lineHeight: '1.4',
                    fontWeight: '500'
                  }}>
                    💡 Cómo conseguirlo: Comparte tu enlace de referido desde Mi Cuenta → Referidos
                  </p>
                )}
              </div>
            </div>
            
          </div>
        )
      })}
      </div>
    </div>
  )
}

