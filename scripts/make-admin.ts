/**
 * Script para hacer admin a un usuario
 * 
 * Uso: npx tsx scripts/make-admin.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin() {
  const username = 'juansemastrangelo'; // Cambiar si es necesario

  console.log(`🔍 Buscando usuario: ${username}...`);

  // Buscar usuario
  const user = await prisma.user.findUnique({
    where: { username },
    include: { role: true },
  });

  if (!user) {
    console.error(`❌ Usuario ${username} no encontrado`);
    process.exit(1);
  }

  console.log(`✓ Usuario encontrado: ${user.name || user.email}`);
  console.log(`  Rol actual: ${user.role.name}`);

  // Buscar rol de admin
  const adminRole = await prisma.role.findUnique({
    where: { name: 'admin' },
  });

  if (!adminRole) {
    console.error('❌ Rol de admin no encontrado en la base de datos');
    process.exit(1);
  }

  if (user.roleId === adminRole.id) {
    console.log('✓ El usuario ya es admin');
    process.exit(0);
  }

  // Actualizar rol a admin
  await prisma.user.update({
    where: { id: user.id },
    data: { roleId: adminRole.id },
  });

  console.log(`✅ ${username} ahora es admin!`);
}

makeAdmin()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

