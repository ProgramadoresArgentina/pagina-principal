import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateProjectQuoteUsd, type ProjectQuoteAnswers } from '@/lib/projectQuote';

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

    return NextResponse.json({
      ok: true,
      quote,
    });
  } catch (error) {
    console.error('Error creando project quote:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

