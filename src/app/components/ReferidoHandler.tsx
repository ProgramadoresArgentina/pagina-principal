'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function ReferidoHandler() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const refId = searchParams?.get('ref')
    
    if (refId) {
      // Guardar el referidor en localStorage para usarlo después de la suscripción
      localStorage.setItem('referidor_id', refId)
      console.log(`Referidor capturado: ${refId}`)
    }
  }, [searchParams])

  return null // Este componente no renderiza nada
}
