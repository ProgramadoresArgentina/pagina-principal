import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/users/list
 * Lista todos los usuarios (solo admins)
 */
export async function GET(req: NextRequest) {
  try {
    console.log('[Admin] Iniciando petición a /api/admin/users/list');
    
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[Admin] Token no proporcionado');
      return NextResponse.json(
        { error: 'Token no proporcionado' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      console.log('[Admin] Token inválido');
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 401 }
      );
    }

    console.log('[Admin] Usuario autenticado:', decoded.userId);

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
      console.log('[Admin] Usuario no encontrado en BD');
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    console.log('[Admin] Usuario cargado:', authUser.username, 'Rol:', authUser.role.name);

    // Verificar si es admin o tiene permiso users:read
    const isAdmin = authUser.role.name === 'admin';
    const hasUsersRead = authUser.role.permissions.some(
      (rp) => rp.permission.resource === 'users' && rp.permission.action === 'read'
    );
    
    console.log('[Admin] Es admin:', isAdmin, 'Tiene users:read:', hasUsersRead);
    
    if (!isAdmin && !hasUsersRead) {
      console.log('[Admin] Sin permisos para listar usuarios');
      return NextResponse.json(
        { error: 'No tienes permisos para listar usuarios' },
        { status: 403 }
      );
    }

    // Obtener parámetros de paginación
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Construir filtro de búsqueda
    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { username: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {};

    // Obtener usuarios
    console.log('[Admin] Consultando usuarios con filtros:', { where, skip, limit });
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          role: true,
          pins: {
            include: {
              pin: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    console.log('[Admin] Usuarios encontrados:', users.length, 'Total:', total);

    return NextResponse.json({
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        isSubscribed: user.isSubscribed,
        isActive: user.isActive,
        role: user.role.name,
        pinsCount: user.pins.length,
        createdAt: user.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[Admin] Error al listar usuarios:', error);
    console.error('[Admin] Stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { error: 'Error al listar usuarios', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

