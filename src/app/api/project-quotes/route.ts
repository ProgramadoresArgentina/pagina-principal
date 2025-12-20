import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  calculateProjectQuoteUsd,
  formatUsdRange,
  getProjectQuoteSummary,
  type ProjectQuoteAnswers,
} from '@/lib/projectQuote';

export const dynamic = 'force-dynamic';

function isValidEmail(email: string): boolean {
  // Validación simple (suficiente para UI + DB)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email ?? '').trim();
    const answers = (body?.answers ?? {}) as ProjectQuoteAnswers;

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
    }

    // Recalcular SIEMPRE en servidor
    const estimate = calculateProjectQuoteUsd(answers);

    const quote = await prisma.projectQuote.create({
      data: {
        email,
        answers,
        estimateMinUsd: estimate.minUsd,
        estimateMaxUsd: estimate.maxUsd,
        responded: false,
        respondedAt: null,
        adminNote: null,
      },
      select: {
        id: true,
        estimateMinUsd: true,
        estimateMaxUsd: true,
        createdAt: true,
      },
    });

    // Enviar webhook a n8n (no bloquea la respuesta si falla)
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (webhookUrl) {
      // Generar mensaje formateado para WhatsApp
      const summary = getProjectQuoteSummary(answers);
      const message = `📋 *Nueva Cotización de Proyecto*

📧 *Email:* ${email}
💰 *Estimado:* ${formatUsdRange(estimate)}
📅 *Fecha:* ${new Date(quote.createdAt).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}

📝 *Resumen:*
${summary.map((s) => `• ${s}`).join('\n')}

🔗 *ID:* ${quote.id}`;

      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          email,
          answers,
          estimateMinUsd: estimate.minUsd,
          estimateMaxUsd: estimate.maxUsd,
          quoteId: quote.id,
          createdAt: quote.createdAt,
          summary,
        }),
      }).catch((err) => {
        console.error('Error enviando webhook a n8n:', err);
      });
    }

    return NextResponse.json({
      ok: true,
      quote,
    });
  } catch (error) {
    console.error('Error creando project quote:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

