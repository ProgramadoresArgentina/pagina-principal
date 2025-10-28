import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding pins...');

  // Crear pins iniciales
  const pins = [
    {
      name: 'Invitación al Club',
      description: 'Haz que un amigo se sume al Club',
      imageUrl: '/assets/images/pins/pin-joda-mate.png',
      category: 'contribución',
      isActive: true,
    },
  ];

  for (const pinData of pins) {
    const pin = await prisma.pin.upsert({
      where: { name: pinData.name },
      update: {},
      create: pinData,
    });
    console.log(`✅ Pin creado/actualizado: ${pin.name}`);
  }

  console.log('✨ Seeding completado!');
}

main()
  .catch((e) => {
    console.error('❌ Error al hacer seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

