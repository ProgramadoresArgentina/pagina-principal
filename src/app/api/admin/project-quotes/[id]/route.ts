import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded?.userId) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const authUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    if (!authUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const isAdmin = authUser.role.name === 'Administrador';
    const hasQuotesUpdate = authUser.role.permissions.some(
      (rp) => rp.permission.resource === 'project_quotes' && rp.permission.action === 'update'
    );

    if (!isAdmin && !hasQuotesUpdate) {
      return NextResponse.json({ error: 'No tienes permisos' }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await req.json();

    const data: any = {};
    if (typeof body?.responded === 'boolean') {
      data.responded = body.responded;
      data.respondedAt = body.responded ? new Date() : null;
    }
    if (typeof body?.adminNote === 'string') {
      data.adminNote = body.adminNote.trim() || null;
    }

    const updated = await prisma.projectQuote.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        answers: true,
        estimateMinUsd: true,
        estimateMaxUsd: true,
        responded: true,
        respondedAt: true,
        adminNote: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ ok: true, quote: updated });
  } catch (error) {
    console.error('Error actualizando project quote:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

