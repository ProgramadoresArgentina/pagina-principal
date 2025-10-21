/**
 * Script para verificar permisos del admin
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyPermissions() {
  console.log('🔍 Verificando permisos del admin...\n');

  // Buscar rol admin
  const adminRole = await prisma.role.findUnique({
    where: { name: 'admin' },
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });

  if (!adminRole) {
    console.error('❌ Rol admin no encontrado');
    return;
  }

  console.log('✅ Rol admin encontrado');
  console.log(`   Permisos asignados: ${adminRole.permissions.length}\n`);

  if (adminRole.permissions.length === 0) {
    console.log('⚠️  El admin no tiene permisos asignados. Asignando...');
    
    const allPermissions = await prisma.permission.findMany();
    console.log(`   Total de permisos disponibles: ${allPermissions.length}`);

    for (const permission of allPermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      });
    }

    console.log('✅ Permisos asignados al admin\n');
  }

  // Listar permisos
  console.log('📋 Permisos del admin:');
  const updatedAdminRole = await prisma.role.findUnique({
    where: { name: 'admin' },
    include: {
      permissions: {
        include: {
          permission: true,
        },
      },
    },
  });

  updatedAdminRole?.permissions.forEach((rp) => {
    console.log(`   ✓ ${rp.permission.resource}:${rp.permission.action}`);
  });

  // Verificar usuario juansemastrangelo
  console.log('\n👤 Verificando usuario juansemastrangelo...');
  const user = await prisma.user.findUnique({
    where: { username: 'juansemastrangelo' },
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

  if (!user) {
    console.error('❌ Usuario juansemastrangelo no encontrado');
    return;
  }

  console.log(`✅ Usuario: ${user.name}`);
  console.log(`   Rol: ${user.role.name}`);
  console.log(`   Permisos: ${user.role.permissions.length}`);

  const hasUsersRead = user.role.permissions.some(
    (rp) => rp.permission.resource === 'users' && rp.permission.action === 'read'
  );

  if (hasUsersRead) {
    console.log('   ✅ Tiene permiso users:read');
  } else {
    console.log('   ❌ NO tiene permiso users:read');
  }

  console.log('\n✨ Verificación completada!');
}

verifyPermissions()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

