import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Crear permisos
  const permissions = await Promise.all([
    prisma.permission.upsert({
      where: { resource_action: { resource: 'users', action: 'create' } },
      update: {},
      create: {
        name: 'Crear Usuarios',
        resource: 'users',
        action: 'create',
        description: 'Permite crear nuevos usuarios',
      },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'users', action: 'read' } },
      update: {},
      create: {
        name: 'Leer Usuarios',
        resource: 'users',
        action: 'read',
        description: 'Permite leer información de usuarios',
      },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'users', action: 'update' } },
      update: {},
      create: {
        name: 'Actualizar Usuarios',
        resource: 'users',
        action: 'update',
        description: 'Permite actualizar usuarios',
      },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'users', action: 'delete' } },
      update: {},
      create: {
        name: 'Eliminar Usuarios',
        resource: 'users',
        action: 'delete',
        description: 'Permite eliminar usuarios',
      },
    }),
    // Permisos de chat
    prisma.permission.upsert({
      where: { resource_action: { resource: 'chat', action: 'moderate' } },
      update: {},
      create: {
        name: 'Moderar Chat',
        resource: 'chat',
        action: 'moderate',
        description: 'Permite moderar el chat global',
      },
    }),
    prisma.permission.upsert({
      where: { resource_action: { resource: 'chat', action: 'delete' } },
      update: {},
      create: {
        name: 'Eliminar Mensajes',
        resource: 'chat',
        action: 'delete',
        description: 'Permite eliminar mensajes del chat',
      },
    }),
  ])

  console.log('✅ Permisos creados:', permissions.length)

  // Crear roles
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: 'Usuario' },
      update: {},
      create: {
        name: 'Usuario',
        description: 'Usuario básico de la plataforma',
      },
    }),
    prisma.role.upsert({
      where: { name: 'Miembro del Club' },
      update: {},
      create: {
        name: 'Miembro del Club',
        description: 'Usuario suscrito al club con beneficios adicionales',
      },
    }),
    prisma.role.upsert({
      where: { name: 'Moderador' },
      update: {},
      create: {
        name: 'Moderador',
        description: 'Moderador con permisos para gestionar contenido',
      },
    }),
    prisma.role.upsert({
      where: { name: 'Administrador' },
      update: {},
      create: {
        name: 'Administrador',
        description: 'Administrador con todos los permisos',
      },
    }),
  ])

  console.log('✅ Roles creados:', roles.length)

  // Asignar permisos a roles
  const rolePermissions = [
    // Usuario básico
    { roleName: 'Usuario', permissions: [] },
    // Miembro del Club
    { roleName: 'Miembro del Club', permissions: [] },
    // Moderador
    { roleName: 'Moderador', permissions: ['chat:moderate', 'chat:delete'] },
    // Administrador
    { roleName: 'Administrador', permissions: ['users:create', 'users:read', 'users:update', 'users:delete', 'chat:moderate', 'chat:delete'] },
  ]

  for (const rolePermission of rolePermissions) {
    const role = roles.find(r => r.name === rolePermission.roleName)
    if (!role) continue

    for (const permissionKey of rolePermission.permissions) {
      const [resource, action] = permissionKey.split(':')
      const permission = permissions.find(p => p.resource === resource && p.action === action)
      
      if (permission) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId: permission.id,
            },
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: permission.id,
          },
        })
      }
    }
  }

  console.log('✅ Permisos asignados a roles')


  // Crear usuarios
  const bcrypt = require('bcryptjs')
  const hashedPassword = await bcrypt.hash('admin123', 12)

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@programadoresargentina.com' },
      update: {},
      create: {
        email: 'admin@programadoresargentina.com',
        password: hashedPassword,
        name: 'Administrador',
        username: 'admin',
        bio: 'Administrador de Programadores Argentina',
        avatar: '/assets/images/perfiles/admin.jpg',
        roleId: roles.find(r => r.name === 'Administrador')!.id,
        isSubscribed: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'moderador@programadoresargentina.com' },
      update: {},
      create: {
        email: 'moderador@programadoresargentina.com',
        password: hashedPassword,
        name: 'Moderador',
        username: 'moderador',
        bio: 'Moderador de Programadores Argentina',
        avatar: '/assets/images/perfiles/moderador.jpg',
        roleId: roles.find(r => r.name === 'Moderador')!.id,
        isSubscribed: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'juan@programadoresargentina.com' },
      update: {},
      create: {
        email: 'juan@programadoresargentina.com',
        password: hashedPassword,
        name: 'Juan Semastrangelo',
        username: 'juansemastrangelo',
        bio: 'Desarrollador Full Stack y fundador de Programadores Argentina',
        avatar: '/assets/images/perfiles/juansemastrangelo.jpg',
        website: 'https://juansemastrangelo.com',
        location: 'Buenos Aires, Argentina',
        roleId: roles.find(r => r.name === 'Administrador')!.id,
        isSubscribed: true,
      },
    }),
  ])

  console.log('✅ Usuarios creados:', users.length)

  // Crear chat global
  const globalChat = await prisma.chat.upsert({
    where: { name: 'Chat Global' },
    update: {},
    create: {
      name: 'Chat Global',
      isActive: true,
    },
  })

  console.log('✅ Chat global creado:', globalChat.name)

  console.log('🎉 Seed completado exitosamente!')
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
