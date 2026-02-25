import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email'

// Verificar firma HMAC de MercadoPago
// Docs: https://www.mercadopago.com.ar/developers/es/docs/your-integrations/notifications/webhooks
function verifyMPSignature(request: NextRequest, rawBody: string): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET
  if (!secret) return true // sin secret configurado, saltar verificación

  const xSignature = request.headers.get('x-signature')
  const xRequestId = request.headers.get('x-request-id')

  if (!xSignature) return false

  // x-signature tiene formato: ts=timestamp,v1=hash
  const parts = Object.fromEntries(xSignature.split(',').map(p => p.split('=')))
  const ts = parts['ts']
  const v1 = parts['v1']
  if (!ts || !v1) return false

  // La cadena a firmar es: id:[data.id];request-id:[x-request-id];ts:[ts];
  let dataId = ''
  try {
    const parsed = JSON.parse(rawBody)
    dataId = parsed?.data?.id ?? ''
  } catch { return false }

  const manifest = `id:${dataId};request-id:${xRequestId ?? ''};ts:${ts};`
  const expected = createHmac('sha256', secret).update(manifest).digest('hex')

  return expected === v1
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()

    // Verificar firma
    if (!verifyMPSignature(request, rawBody)) {
      console.warn('Webhook con firma inválida — rechazado')
      return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
    }

    const body = JSON.parse(rawBody)
    console.log('Webhook MercadoPago recibido:', JSON.stringify(body, null, 2))

    // MP envía: { type, action, data: { id } }
    // type puede ser: "subscription_preapproval" | "payment"
    // action puede ser: "created" | "updated" | "cancelled" | "paused" | "resumed"
    const { type, action, data } = body

    if (!type || !data?.id) {
      console.log('Webhook sin tipo o datos válidos')
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    if (type === 'subscription_preapproval') {
      const inactiveActions = ['cancelled', 'paused']
      if (inactiveActions.includes(action)) {
        await handleSubscriptionInactive(data.id)
      } else {
        // created, updated, resumed → activar
        await handleSubscriptionActive(data.id)
      }
    } else if (type === 'payment') {
      await handlePaymentEvent(data.id)
    } else {
      console.log(`Evento no manejado: ${type} / ${action}`)
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

async function handleSubscriptionActive(subscriptionId: string) {
  try {
    console.log(`Activando suscripción: ${subscriptionId}`)

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

    // Fecha de expiración: next_payment_date de MP o fallback +30 días
    let expiresAt: Date
    if (subscription.next_payment_date) {
      expiresAt = new Date(subscription.next_payment_date)
    } else {
      expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30)
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: payerEmail },
    })

    const wasAlreadySubscribed = existingUser?.isSubscribed ?? false

    const updatedUser = await prisma.user.update({
      where: { email: payerEmail },
      data: {
        isSubscribed: true,
        subscribedAt: existingUser?.subscribedAt || new Date(),
        subscriptionExpiresAt: expiresAt,
        updatedAt: new Date(),
      },
    })

    console.log(`Usuario ${payerEmail} suscrito, expira: ${expiresAt.toISOString()}`)

    // Mail de bienvenida solo en la primera suscripción
    if (!wasAlreadySubscribed) {
      try {
        await sendWelcomeEmail(payerEmail, updatedUser.name || '')
        console.log(`Mail de bienvenida enviado a ${payerEmail}`)
      } catch (emailError) {
        console.error(`Error enviando mail de bienvenida a ${payerEmail}:`, emailError)
      }
    }

    await processReferido(updatedUser.id)

  } catch (error) {
    console.error(`Error activando suscripción ${subscriptionId}:`, error)
  }
}

async function handleSubscriptionInactive(subscriptionId: string) {
  try {
    console.log(`Desactivando suscripción: ${subscriptionId}`)

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

    await prisma.user.update({
      where: { email: payerEmail },
      data: {
        isSubscribed: false,
        subscriptionExpiresAt: null,
        updatedAt: new Date(),
      },
    })

    console.log(`Usuario ${payerEmail} marcado como no suscrito`)

  } catch (error) {
    console.error(`Error desactivando suscripción ${subscriptionId}:`, error)
  }
}

async function handlePaymentEvent(paymentId: string) {
  try {
    console.log(`Procesando evento de pago: ${paymentId}`)

    const payment = await getPaymentDetails(paymentId)

    if (!payment) {
      console.error(`No se pudo obtener detalles del pago: ${paymentId}`)
      return
    }

    if (payment.status === 'approved' && payment.subscription_id) {
      await handleSubscriptionActive(payment.subscription_id)
    }

  } catch (error) {
    console.error(`Error procesando pago ${paymentId}:`, error)
  }
}

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
        'Content-Type': 'application/json',
      },
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
        'Content-Type': 'application/json',
      },
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

async function processReferido(userId: string) {
  try {
    console.log(`Procesando referido para usuario ${userId}`)
  } catch (error) {
    console.error(`Error procesando referido para usuario ${userId}:`, error)
  }
}
