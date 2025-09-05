import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUser, hasPermission, hasRole } from './auth'

export interface AuthenticatedRequest extends NextRequest {
  user?: any
}

// Middleware para verificar autenticación
export function requireAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const authHeader = req.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const user = await getAuthenticatedUser(token)

    if (!user) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      )
    }

    // Agregar usuario al request
    const authenticatedReq = req as AuthenticatedRequest
    authenticatedReq.user = user

    return handler(authenticatedReq)
  }
}

// Middleware para verificar permisos específicos
export function requirePermission(resource: string, action: string) {
  return function(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return requireAuth(async (req: AuthenticatedRequest) => {
      if (!hasPermission(req.user, resource, action)) {
        return NextResponse.json(
          { error: 'No tienes permisos para realizar esta acción' },
          { status: 403 }
        )
      }

      return handler(req)
    })
  }
}

// Middleware para verificar roles específicos
export function requireRole(roleName: string) {
  return function(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
    return requireAuth(async (req: AuthenticatedRequest) => {
      if (!hasRole(req.user, roleName)) {
        return NextResponse.json(
          { error: 'No tienes el rol necesario para realizar esta acción' },
          { status: 403 }
        )
      }

      return handler(req)
    })
  }
}

// Middleware para verificar si es administrador
export function requireAdmin(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return requireRole('Administrador')(handler)
}

// Middleware para verificar si es moderador o admin
export function requireModerator(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return requireAuth(async (req: AuthenticatedRequest) => {
    if (!hasRole(req.user, 'Moderador') && !hasRole(req.user, 'Administrador')) {
      return NextResponse.json(
        { error: 'Se requieren permisos de moderador o administrador' },
        { status: 403 }
      )
    }

    return handler(req)
  })
}

// Middleware para verificar si es miembro del club
export function requireClubMember(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return requireAuth(async (req: AuthenticatedRequest) => {
    if (!req.user.isSubscribed && !hasRole(req.user, 'Moderador') && !hasRole(req.user, 'Administrador')) {
      return NextResponse.json(
        { error: 'Se requiere ser miembro del club para acceder a este contenido' },
        { status: 403 }
      )
    }

    return handler(req)
  })
}
