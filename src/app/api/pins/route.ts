import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/pins
 * Obtiene todos los pins disponibles
 */
export async function GET(req: NextRequest) {
  try {
    const pins = await prisma.pin.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json({ pins });
  } catch (error) {
    console.error('Error al obtener pins:', error);
    return NextResponse.json(
      { error: 'Error al obtener pins' },
      { status: 500 }
    );
  }
}
