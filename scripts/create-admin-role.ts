/**
 * Script para crear el rol de admin con todos los permisos
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createAdminRole() {
  console.log('🔧 Creando rol de admin...');

  // Verificar si ya existe
  const existingAdmin = await prisma.role.findUnique({
    where: { name: 'admin' },
  });

  if (existingAdmin) {
    console.log('✓ El rol de admin ya existe');
    return;
  }

  // Crear rol de admin
  const adminRole = await prisma.role.create({
    data: {
      name: 'admin',
      description: 'Administrador con acceso completo al sistema',
    },
  });

  console.log('✅ Rol de admin creado');

  // Obtener todos los permisos
  const allPermissions = await prisma.permission.findMany();

  console.log(`📋 Asignando ${allPermissions.length} permisos al rol admin...`);

  // Asignar todos los permisos al admin
  for (const permission of allPermissions) {
    await prisma.rolePermission.create({
      data: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  console.log('✅ Todos los permisos asignados al admin');
  console.log('\n🎉 Rol de admin creado exitosamente!');
}

createAdminRole()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

