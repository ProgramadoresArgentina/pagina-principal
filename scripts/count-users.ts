/**
 * Script para contar usuarios en la base de datos
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function countUsers() {
  console.log('🔍 Contando usuarios en la base de datos...\n');

  const total = await prisma.user.count();
  console.log(`📊 Total de usuarios: ${total}\n`);

  if (total > 0) {
    const users = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        role: true,
      },
    });

    console.log('👥 Últimos 5 usuarios:');
    users.forEach((user) => {
      console.log(`   - ${user.name || user.email} (@${user.username || 'sin username'}) - Rol: ${user.role.name}`);
    });
  } else {
    console.log('⚠️  No hay usuarios en la base de datos');
  }
}

countUsers()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

