/**
 * Script de ejemplo para asignar badges a usuarios
 * 
 * Uso:
 * 1. Configurá las variables de entorno (DATABASE_URL)
 * 2. Modificá los arrays de userIds y pinName según necesites
 * 3. Ejecutá: npx tsx scripts/assign-badge-example.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function assignBadge() {
  // CONFIGURACIÓN - Modificá estos valores
  const pinName = 'Hacktoberfest 2024'; // Nombre del pin a asignar
  const reason = 'Participó en Hacktoberfest 2024'; // Razón (opcional)
  
  // Podés usar emails o IDs de usuarios
  const userEmails = [
    'usuario1@example.com',
    'usuario2@example.com',
    // Agregá más emails aquí
  ];

  console.log('🚀 Iniciando asignación de badges...\n');

  // Buscar el pin
  const pin = await prisma.pin.findUnique({
    where: { name: pinName },
  });

  if (!pin) {
    console.error(`❌ Pin "${pinName}" no encontrado`);
    process.exit(1);
  }

  console.log(`📌 Pin a asignar: ${pin.name}`);
  console.log(`📝 Descripción: ${pin.description}\n`);

  let assigned = 0;
  let skipped = 0;
  let errors = 0;

  for (const email of userEmails) {
    try {
      // Buscar usuario por email
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          pins: {
            where: { pinId: pin.id },
          },
        },
      });

      if (!user) {
        console.log(`⚠️  Usuario ${email} no encontrado`);
        errors++;
        continue;
      }

      // Verificar si ya tiene el pin
      if (user.pins.length > 0) {
        console.log(`⏭️  ${user.name || email} ya tiene este badge`);
        skipped++;
        continue;
      }

      // Asignar el pin
      await prisma.userPin.create({
        data: {
          userId: user.id,
          pinId: pin.id,
          reason,
        },
      });

      console.log(`✅ Badge asignado a ${user.name || email}`);
      assigned++;
    } catch (error) {
      console.error(`❌ Error al asignar badge a ${email}:`, error);
      errors++;
    }
  }

  console.log('\n📊 Resumen:');
  console.log(`   ✅ Asignados: ${assigned}`);
  console.log(`   ⏭️  Omitidos (ya tenían el badge): ${skipped}`);
  console.log(`   ❌ Errores: ${errors}`);
  console.log(`   📧 Total procesados: ${userEmails.length}\n`);

  console.log('✨ Proceso completado!');
}

// Ejemplo alternativo: Asignar por username
async function assignBadgeByUsername() {
  const pinName = 'Contributor';
  const reason = 'Contribuyó al proyecto';
  const usernames = ['juansemastrangelo', 'usuario2'];

  const pin = await prisma.pin.findUnique({
    where: { name: pinName },
  });

  if (!pin) {
    console.error(`❌ Pin "${pinName}" no encontrado`);
    return;
  }

  for (const username of usernames) {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      console.log(`⚠️  Usuario @${username} no encontrado`);
      continue;
    }

    try {
      await prisma.userPin.create({
        data: {
          userId: user.id,
          pinId: pin.id,
          reason,
        },
      });
      console.log(`✅ Badge asignado a @${username}`);
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log(`⏭️  @${username} ya tiene este badge`);
      } else {
        console.error(`❌ Error:`, error);
      }
    }
  }
}

// Ejecutar
assignBadge()
  .catch((e) => {
    console.error('❌ Error fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

