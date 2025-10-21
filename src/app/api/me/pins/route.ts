import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/me/pins
 * Obtiene todos los pins del usuario autenticado
 */
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token no proporcionado' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    // Obtener pins del usuario con información completa
    const userPins = await prisma.userPin.findMany({
      where: {
        userId: decoded.userId,
      },
      include: {
        pin: true,
      },
      orderBy: {
        earnedAt: 'desc',
      },
    });

    return NextResponse.json({
      pins: userPins.map(up => ({
        id: up.id,
        earnedAt: up.earnedAt,
        reason: up.reason,
        pin: {
          id: up.pin.id,
          name: up.pin.name,
          description: up.pin.description,
          imageUrl: up.pin.imageUrl,
          category: up.pin.category,
        },
      })),
    });
  } catch (error) {
    console.error('Error al obtener pins:', error);
    return NextResponse.json(
      { error: 'Error al obtener pins' },
      { status: 500 }
    );
  }
}

