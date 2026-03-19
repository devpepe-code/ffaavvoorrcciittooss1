import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@favorcitos.com' },
    update: {},
    create: {
      email: 'admin@favorcitos.com',
      firstName: 'Admin',
      lastName: 'Sistema',
      passwordHash: hashedPassword,
      country: 'México',
      city: 'Ciudad de México',
      role: 'ADMIN',
    },
  });

  const cliente = await prisma.user.upsert({
    where: { email: 'cliente@test.com' },
    update: {},
    create: {
      email: 'cliente@test.com',
      firstName: 'María',
      lastName: 'García',
      passwordHash: hashedPassword,
      country: 'México',
      city: 'Ciudad de México',
      role: 'CLIENTE',
    },
  });

  const tasker = await prisma.user.upsert({
    where: { email: 'tasker@test.com' },
    update: {},
    create: {
      email: 'tasker@test.com',
      firstName: 'Carlos',
      lastName: 'Rodríguez',
      passwordHash: hashedPassword,
      country: 'México',
      city: 'Ciudad de México',
      role: 'TASKER',
    },
  });

  await prisma.taskerProfile.upsert({
    where: { userId: tasker.id },
    update: {},
    create: {
      userId: tasker.id,
      bio: 'Plomero certificado con 10 años de experiencia. Especializado en instalaciones y reparaciones.',
      services: '["PLOMERIA","ELECTRICIDAD","HANDYMAN_GENERAL"]',
      hourlyRates: '{"PLOMERIA":250,"ELECTRICIDAD":200,"HANDYMAN_GENERAL":180}',
      verificationStatus: 'APPROVED',
      averageRating: 4.8,
      totalReviews: 24,
      completedJobs: 45,
      coverageRadius: 15,
    },
  });

  const tasker2 = await prisma.user.upsert({
    where: { email: 'tasker2@test.com' },
    update: {},
    create: {
      email: 'tasker2@test.com',
      firstName: 'Ana',
      lastName: 'Martínez',
      passwordHash: hashedPassword,
      country: 'México',
      city: 'Ciudad de México',
      role: 'TASKER',
    },
  });

  await prisma.taskerProfile.upsert({
    where: { userId: tasker2.id },
    update: {},
    create: {
      userId: tasker2.id,
      bio: 'Experta en limpieza del hogar. Servicios de limpieza profunda y mantenimiento.',
      services: '["LIMPIEZA_HOGAR"]',
      hourlyRates: '{"LIMPIEZA_HOGAR":150}',
      verificationStatus: 'APPROVED',
      averageRating: 4.9,
      totalReviews: 67,
      completedJobs: 120,
      coverageRadius: 20,
    },
  });

  console.log('Seed completado:', { admin: admin.email, cliente: cliente.email, tasker: tasker.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
