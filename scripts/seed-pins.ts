import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding pins...');

  // Crear pins iniciales
  const pins = [
    {
      name: 'Hacktoberfest 2024',
      description: 'Participó en Hacktoberfest 2024',
      imageUrl: '/assets/images/pins/pin-hacktoberfest.webp',
      category: 'evento',
      isActive: true,
    },
    {
      name: 'Contributor',
      description: 'Contribuyó al proyecto de Programadores Argentina',
      imageUrl: '/assets/images/pins/pin-contributor.webp',
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

