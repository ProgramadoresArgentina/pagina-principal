import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/admin/pins/create
 * Crea un nuevo pin (solo admins)
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
    if (authUser.role.name !== 'Administrador') {
      return NextResponse.json(
        { error: 'No tienes permisos para crear pins' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, description, imageUrl, category, isActive } = body;

    if (!name || !imageUrl) {
      return NextResponse.json(
        { error: 'name y imageUrl son requeridos' },
        { status: 400 }
      );
    }

    // Crear el pin
    const pin = await prisma.pin.create({
      data: {
        name,
        description: description || null,
        imageUrl,
        category: category || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({
      message: 'Pin creado correctamente',
      pin,
    });
  } catch (error: any) {
    console.error('Error al crear pin:', error);
    
    // Manejar error de nombre duplicado
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Ya existe un pin con ese nombre' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error al crear pin' },
      { status: 500 }
    );
  }
}

