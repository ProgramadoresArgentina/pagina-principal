import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
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
    const hasQuotesRead = authUser.role.permissions.some(
      (rp) => rp.permission.resource === 'project_quotes' && rp.permission.action === 'read'
    );

    if (!isAdmin && !hasQuotesRead) {
      return NextResponse.json({ error: 'No tienes permisos' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const responded = searchParams.get('responded'); // "true" | "false" | null
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '30'));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (responded === 'true') where.responded = true;
    if (responded === 'false') where.responded = false;

    const [quotes, total] = await Promise.all([
      prisma.projectQuote.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
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
      }),
      prisma.projectQuote.count({ where }),
    ]);

    return NextResponse.json({
      quotes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error listando project quotes:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

