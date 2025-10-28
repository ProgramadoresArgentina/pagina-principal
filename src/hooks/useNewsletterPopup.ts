'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export function useNewsletterPopup() {
  const { isAuthenticated } = useAuth()
  const [showPopup, setShowPopup] = useState(false)
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true)

  useEffect(() => {
    const checkAndShowPopup = async () => {
      // No mostrar si el usuario está autenticado
      if (isAuthenticated) {
        setIsCheckingSubscription(false)
        return
      }

      // Verificar si el popup ya fue cerrado o el usuario ya se suscribió
      const popupClosed = localStorage.getItem('newsletter_popup_closed')
      const userSubscribed = localStorage.getItem('newsletter_subscribed')
      
      if (popupClosed === 'true' || userSubscribed === 'true') {
        // setIsCheckingSubscription(false)
        return
      }

      // Verificar si el usuario ya está suscrito en Listmonk
      const isSubscribed = await checkSubscriptionStatus()
      if (isSubscribed) {
        localStorage.setItem('newsletter_subscribed', 'true')
        setIsCheckingSubscription(false)
        return
      }

      const timer = setTimeout(() => {
        setShowPopup(true)
        setIsCheckingSubscription(false)
      }, 2 * 60 * 1000) // 2 minutos

      // Cleanup del timer si el componente se desmonta
      return () => clearTimeout(timer)
    }

    checkAndShowPopup()
  }, [isAuthenticated])

  const checkSubscriptionStatus = async (): Promise<boolean> => {
    try {
      // Intentar obtener el email del localStorage si existe
      const savedEmail = localStorage.getItem('user_email')
      if (!savedEmail) {
        return false
      }

      // Verificar suscripción usando la API de Listmonk
      const response = await fetch('/api/newsletter/check-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: savedEmail }),
      })

      if (response.ok) {
        const data = await response.json()
        return data.isSubscribed || false
      }
    } catch (error) {
      console.error('Error checking subscription status:', error)
    }
    
    return false
  }

  const closePopup = () => {
    setShowPopup(false)
  }

  return {
    showPopup,
    isCheckingSubscription,
    closePopup,
  }
}
