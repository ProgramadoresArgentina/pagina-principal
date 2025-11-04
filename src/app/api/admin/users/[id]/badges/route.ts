import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/users/[id]/badges
 * Obtiene todos los badges de un usuario específico (solo admins)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!authUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si es admin
    const isAdmin = authUser.role.name === 'Administrador';
    const hasUsersRead = authUser.role.permissions.some(
      (rp) => rp.permission.resource === 'users' && rp.permission.action === 'read'
    );

    if (!isAdmin && !hasUsersRead) {
      return NextResponse.json(
        { error: 'No tienes permisos' },
        { status: 403 }
      );
    }

    const userId = params.id;

    // Obtener usuario con sus badges
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        pins: {
          include: {
            pin: true,
          },
          orderBy: {
            earnedAt: 'desc',
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Obtener todos los pins disponibles
    const allPins = await prisma.pin.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
      badges: user.pins.map((up) => ({
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
      availablePins: allPins.map((pin) => ({
        id: pin.id,
        name: pin.name,
        description: pin.description,
        imageUrl: pin.imageUrl,
        category: pin.category,
      })),
    });
  } catch (error) {
    console.error('Error al obtener badges del usuario:', error);
    return NextResponse.json(
      { error: 'Error al obtener badges' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users/[id]/badges
 * Asigna un badge a un usuario (solo admins)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const authUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!authUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const isAdmin = authUser.role.name === 'admin';
    const hasUsersUpdate = authUser.role.permissions.some(
      (rp) => rp.permission.resource === 'users' && rp.permission.action === 'update'
    );

    if (!isAdmin && !hasUsersUpdate) {
      return NextResponse.json(
        { error: 'No tienes permisos' },
        { status: 403 }
      );
    }

    const userId = params.id;
    const body = await req.json();
    const { pinId, reason } = body;

    if (!pinId) {
      return NextResponse.json(
        { error: 'pinId es requerido' },
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

    // Verificar si ya tiene el badge
    const existing = await prisma.userPin.findUnique({
      where: {
        userId_pinId: {
          userId,
          pinId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'El usuario ya tiene este badge' },
        { status: 400 }
      );
    }

    // Asignar el badge
    const userPin = await prisma.userPin.create({
      data: {
        userId,
        pinId,
        grantedBy: decoded.userId,
        reason: reason || null,
      },
      include: {
        pin: true,
      },
    });

    return NextResponse.json({
      message: 'Badge asignado correctamente',
      userPin: {
        id: userPin.id,
        earnedAt: userPin.earnedAt,
        reason: userPin.reason,
        pin: {
          id: userPin.pin.id,
          name: userPin.pin.name,
          description: userPin.pin.description,
          imageUrl: userPin.pin.imageUrl,
        },
      },
    });
  } catch (error) {
    console.error('Error al asignar badge:', error);
    return NextResponse.json(
      { error: 'Error al asignar badge' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]/badges/[badgeId]
 * Quita un badge de un usuario (solo admins)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const authUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    if (!authUser) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    const isAdmin = authUser.role.name === 'admin';
    const hasUsersUpdate = authUser.role.permissions.some(
      (rp) => rp.permission.resource === 'users' && rp.permission.action === 'update'
    );

    if (!isAdmin && !hasUsersUpdate) {
      return NextResponse.json(
        { error: 'No tienes permisos' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userPinId = searchParams.get('userPinId');

    if (!userPinId) {
      return NextResponse.json(
        { error: 'userPinId es requerido' },
        { status: 400 }
      );
    }

    // Eliminar el badge
    await prisma.userPin.delete({
      where: { id: userPinId },
    });

    return NextResponse.json({
      message: 'Badge eliminado correctamente',
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Badge no encontrado' },
        { status: 404 }
      );
    }
    console.error('Error al eliminar badge:', error);
    return NextResponse.json(
      { error: 'Error al eliminar badge' },
      { status: 500 }
    );
  }
}

