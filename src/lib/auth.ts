import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export interface AuthUser {
  id: string
  email: string
  name: string | null
  username: string | null
  role: {
    id: string
    name: string
    permissions: {
      permission: {
        name: string
        resource: string
        action: string
      }
    }[]
  }
  isSubscribed: boolean
}

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

// Hash de contraseña
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verificar contraseña
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generar JWT
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

// Verificar JWT
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

// Obtener usuario autenticado
export async function getAuthenticatedUser(token: string): Promise<AuthUser | null> {
  const payload = verifyToken(token)
  if (!payload) return null

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
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
  })

  if (!user || !user.isActive) return null

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    username: user.username,
    role: {
      id: user.role.id,
      name: user.role.name,
      permissions: user.role.permissions,
    },
    isSubscribed: user.isSubscribed,
  }
}

// Verificar si el usuario tiene un permiso específico
export function hasPermission(user: AuthUser, resource: string, action: string): boolean {
  return user.role.permissions.some(
    (rp) => rp.permission.resource === resource && rp.permission.action === action
  )
}

// Verificar si el usuario tiene un rol específico
export function hasRole(user: AuthUser, roleName: string): boolean {
  return user.role.name === roleName
}

// Verificar si el usuario es administrador
export function isAdmin(user: AuthUser): boolean {
  return hasRole(user, 'Administrador')
}

// Verificar si el usuario es moderador
export function isModerator(user: AuthUser): boolean {
  return hasRole(user, 'Moderador') || isAdmin(user)
}

// Verificar si el usuario es miembro del club
export function isClubMember(user: AuthUser): boolean {
  return hasRole(user, 'Miembro del Club') || isModerator(user)
}
