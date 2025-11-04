import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Webhook MercadoPago recibido:', JSON.stringify(body, null, 2))

    const { type, data } = body

    // Verificar que sea un evento de suscripción o pago
    if (!type || !data) {
      console.log('Webhook sin tipo o datos válidos')
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    // Manejar diferentes tipos de eventos
    switch (type) {
      case 'subscription_created':
      case 'subscription_updated':
      case 'subscription_resumed':
        await handleSubscriptionActive(data.id)
        break

      case 'subscription_cancelled':
      case 'subscription_paused':
        await handleSubscriptionInactive(data.id)
        break

      case 'payment.created':
      case 'payment.updated':
        await handlePaymentEvent(data.id)
        break

      default:
        console.log(`Evento no manejado: ${type}`)
        return NextResponse.json({ message: 'Evento no manejado' }, { status: 200 })
    }

    return NextResponse.json({ message: 'Webhook procesado correctamente' }, { status: 200 })

  } catch (error) {
    console.error('Error procesando webhook de MercadoPago:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Función para manejar suscripciones activas
async function handleSubscriptionActive(subscriptionId: string) {
  try {
    console.log(`Activando suscripción: ${subscriptionId}`)
    
    // Obtener detalles de la suscripción desde MercadoPago
    const subscription = await getSubscriptionDetails(subscriptionId)
    
    if (!subscription) {
      console.error(`No se pudo obtener detalles de la suscripción: ${subscriptionId}`)
      return
    }

    // Buscar usuario por email del payer
    const payerEmail = subscription.payer?.email
    if (!payerEmail) {
      console.error(`No se encontró email del payer en la suscripción: ${subscriptionId}`)
      return
    }

    // Actualizar usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { email: payerEmail },
    })
    
    const updatedUser = await prisma.user.update({
      where: { email: payerEmail },
      data: { 
        isSubscribed: true,
        subscribedAt: user?.subscribedAt || new Date(), // Solo establecer si no existe
        updatedAt: new Date()
      }
    })

    console.log(`Usuario ${payerEmail} marcado como suscrito`)
    
    // Procesar referido si existe
    await processReferido(updatedUser.id)

  } catch (error) {
    console.error(`Error activando suscripción ${subscriptionId}:`, error)
  }
}

// Función para manejar suscripciones inactivas
async function handleSubscriptionInactive(subscriptionId: string) {
  try {
    console.log(`Desactivando suscripción: ${subscriptionId}`)
    
    // Obtener detalles de la suscripción
    const subscription = await getSubscriptionDetails(subscriptionId)
    
    if (!subscription) {
      console.error(`No se pudo obtener detalles de la suscripción: ${subscriptionId}`)
      return
    }

    const payerEmail = subscription.payer?.email
    if (!payerEmail) {
      console.error(`No se encontró email del payer en la suscripción: ${subscriptionId}`)
      return
    }

    // Actualizar usuario en la base de datos
    const updatedUser = await prisma.user.update({
      where: { email: payerEmail },
      data: { 
        isSubscribed: false,
        subscribedAt: null, // Limpiar fecha cuando se desactiva
        updatedAt: new Date()
      }
    })

    console.log(`Usuario ${payerEmail} marcado como no suscrito`)

  } catch (error) {
    console.error(`Error desactivando suscripción ${subscriptionId}:`, error)
  }
}

// Función para manejar eventos de pago
async function handlePaymentEvent(paymentId: string) {
  try {
    console.log(`Procesando evento de pago: ${paymentId}`)
    
    // Obtener detalles del pago
    const payment = await getPaymentDetails(paymentId)
    
    if (!payment) {
      console.error(`No se pudo obtener detalles del pago: ${paymentId}`)
      return
    }

    // Si el pago está aprobado y es de una suscripción
    if (payment.status === 'approved' && payment.subscription_id) {
      await handleSubscriptionActive(payment.subscription_id)
    }

  } catch (error) {
    console.error(`Error procesando pago ${paymentId}:`, error)
  }
}

// Función para obtener detalles de suscripción desde MercadoPago
async function getSubscriptionDetails(subscriptionId: string) {
  try {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
    if (!accessToken) {
      console.error('MERCADOPAGO_ACCESS_TOKEN no configurado')
      return null
    }

    const response = await fetch(`https://api.mercadopago.com/preapproval/${subscriptionId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error(`Error obteniendo suscripción ${subscriptionId}: ${response.statusText}`)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error(`Error en getSubscriptionDetails:`, error)
    return null
  }
}

// Función para obtener detalles de pago desde MercadoPago
async function getPaymentDetails(paymentId: string) {
  try {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
    if (!accessToken) {
      console.error('MERCADOPAGO_ACCESS_TOKEN no configurado')
      return null
    }

    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      console.error(`Error obteniendo pago ${paymentId}: ${response.statusText}`)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error(`Error en getPaymentDetails:`, error)
    return null
  }
}

// Función para procesar referido
async function processReferido(userId: string) {
  try {
    // TODO: Implementar lógica de referidos después de generar Prisma
    console.log(`Procesando referido para usuario ${userId}`)
    
    // Por ahora solo logueamos, la funcionalidad completa se implementará
    // después de ejecutar `npx prisma generate` y `npx prisma db push`
    
  } catch (error) {
    console.error(`Error procesando referido para usuario ${userId}:`, error)
  }
}