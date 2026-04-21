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
      estado: 'Ciudad de México',
      city: 'Cuauhtémoc',
      colonia: 'Centro Histórico',
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
      estado: 'Ciudad de México',
      city: 'Benito Juárez',
      colonia: 'Del Valle',
      role: 'CLIENTE',
    },
  });

  // Tasker 1: Plomero en CDMX
  const tasker = await prisma.user.upsert({
    where: { email: 'tasker@test.com' },
    update: {},
    create: {
      email: 'tasker@test.com',
      firstName: 'Carlos',
      lastName: 'Rodríguez',
      passwordHash: hashedPassword,
      country: 'México',
      estado: 'Ciudad de México',
      city: 'Iztapalapa',
      colonia: 'Jardín Balbuena',
      phone: '+525512345678',
      role: 'TASKER',
    },
  });

  await prisma.taskerProfile.upsert({
    where: { userId: tasker.id },
    update: {},
    create: {
      userId: tasker.id,
      bio: 'Plomero certificado con 10 años de experiencia en CDMX. Especializado en instalaciones, reparaciones de emergencia y fugas. Atención rápida en Iztapalapa, Iztacalco y Venustiano Carranza.',
      services: '["PLOMERIA","ELECTRICIDAD","MANITAS_GENERAL"]',
      hourlyRates: '{}',
      verificationStatus: 'APPROVED',
      averageRating: 4.8,
      totalReviews: 24,
      completedJobs: 45,
      coverageRadius: 15,
      estado: 'Ciudad de México',
      colonia: 'Jardín Balbuena',
      lat: 19.4286,
      lng: -99.0875,
      serviceRadiusKm: 15,
      whatsapp: '+525512345678',
    },
  });

  // Tasker 2: Limpieza en CDMX
  const tasker2 = await prisma.user.upsert({
    where: { email: 'tasker2@test.com' },
    update: {},
    create: {
      email: 'tasker2@test.com',
      firstName: 'Ana',
      lastName: 'Martínez',
      passwordHash: hashedPassword,
      country: 'México',
      estado: 'Ciudad de México',
      city: 'Coyoacán',
      colonia: 'El Carmen',
      phone: '+525598765432',
      role: 'TASKER',
    },
  });

  await prisma.taskerProfile.upsert({
    where: { userId: tasker2.id },
    update: {},
    create: {
      userId: tasker2.id,
      bio: 'Especialista en limpieza del hogar en Coyoacán y zonas cercanas. Ofrezco limpieza profunda, mantenimiento regular y servicio de control de plagas. Más de 120 trabajos completados con 4.9 estrellas.',
      services: '["LIMPIEZA_HOGAR","CONTROL_PLAGAS"]',
      hourlyRates: '{}',
      verificationStatus: 'APPROVED',
      averageRating: 4.9,
      totalReviews: 67,
      completedJobs: 120,
      coverageRadius: 20,
      estado: 'Ciudad de México',
      colonia: 'El Carmen',
      lat: 19.3466,
      lng: -99.1617,
      serviceRadiusKm: 20,
      whatsapp: '+525598765432',
    },
  });

  // Tasker 3: Pintura e impermeabilización en Estado de México
  const tasker3 = await prisma.user.upsert({
    where: { email: 'tasker3@test.com' },
    update: {},
    create: {
      email: 'tasker3@test.com',
      firstName: 'Roberto',
      lastName: 'Sánchez',
      passwordHash: hashedPassword,
      country: 'México',
      estado: 'Estado de México',
      city: 'Ecatepec',
      colonia: 'Ciudad Azteca',
      phone: '+525511112222',
      role: 'TASKER',
    },
  });

  await prisma.taskerProfile.upsert({
    where: { userId: tasker3.id },
    update: {},
    create: {
      userId: tasker3.id,
      bio: 'Pintor e impermeabilizador con 8 años de experiencia. Trabajo en Ecatepec, Tlalnepantla, Naucalpan y CDMX norte. Materiales de primera calidad incluidos.',
      services: '["PINTURA","IMPERMEABILIZACION","MANITAS_GENERAL"]',
      hourlyRates: '{}',
      verificationStatus: 'APPROVED',
      averageRating: 4.7,
      totalReviews: 38,
      completedJobs: 75,
      coverageRadius: 25,
      estado: 'Estado de México',
      colonia: 'Ciudad Azteca',
      lat: 19.6011,
      lng: -99.0314,
      serviceRadiusKm: 25,
      whatsapp: '+525511112222',
    },
  });

  console.log('Seed completado:', {
    admin: admin.email,
    cliente: cliente.email,
    tasker: tasker.email,
    tasker2: tasker2.email,
    tasker3: tasker3.email,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
