import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/admin/pins/assign
 * Asigna un pin a un usuario (solo admins)
 */
export async function POST(req: NextRequest) {
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
    if (authUser.role.name !== 'admin') {
      return NextResponse.json(
        { error: 'No tienes permisos para asignar pins' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { userId, pinId, reason } = body;

    if (!userId || !pinId) {
      return NextResponse.json(
        { error: 'userId y pinId son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que el pin existe
    const pin = await prisma.pin.findUnique({
      where: { id: pinId },
    });

    if (!pin) {
      return NextResponse.json(
        { error: 'Pin no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si el usuario ya tiene este pin
    const existingUserPin = await prisma.userPin.findUnique({
      where: {
        userId_pinId: {
          userId,
          pinId,
        },
      },
    });

    if (existingUserPin) {
      return NextResponse.json(
        { error: 'El usuario ya tiene este pin' },
        { status: 400 }
      );
    }

    // Asignar el pin al usuario
    const userPin = await prisma.userPin.create({
      data: {
        userId,
        pinId,
        grantedBy: decoded.userId,
        reason: reason || null,
      },
      include: {
        pin: true,
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Pin asignado correctamente',
      userPin,
    });
  } catch (error) {
    console.error('Error al asignar pin:', error);
    return NextResponse.json(
      { error: 'Error al asignar pin' },
      { status: 500 }
    );
  }
}

