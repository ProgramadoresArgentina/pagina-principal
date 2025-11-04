import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/pins/list
 * Lista todos los pins disponibles (solo admins)
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

    // Obtener usuario autenticado con rol
    const authUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true },
    });

    if (!authUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si es admin
    if (authUser.role.name !== 'Administrador') {
      return NextResponse.json(
        { error: 'No tienes permisos para listar pins' },
        { status: 403 }
      );
    }

    // Obtener todos los pins
    const pins = await prisma.pin.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            userPins: true,
          },
        },
      },
    });

    return NextResponse.json({
      pins: pins.map(pin => ({
        ...pin,
        usersCount: pin._count.userPins,
      })),
    });
  } catch (error) {
    console.error('Error al listar pins:', error);
    return NextResponse.json(
      { error: 'Error al listar pins' },
      { status: 500 }
    );
  }
}

