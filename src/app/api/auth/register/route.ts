import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  firstName: z.string().min(2, 'Nombre demasiado corto'),
  lastName: z.string().min(2, 'Apellido demasiado corto'),
  country: z.string().default('México'),
  estado: z.string().optional(),
  city: z.string().min(2, 'Selecciona una ciudad'),
  colonia: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(['CLIENTE', 'TASKER']).default('CLIENTE'),
  bio: z.string().optional(),
  services: z.array(z.string()).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      return NextResponse.json({ error: 'Este email ya está registrado' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        country: data.country,
        estado: data.estado,
        city: data.city,
        colonia: data.colonia,
        phone: data.phone,
        passwordHash,
        role: data.role,
      },
    });

    if (data.role === 'TASKER') {
      await prisma.taskerProfile.create({
        data: {
          userId: user.id,
          bio: data.bio || null,
          services: JSON.stringify(data.services || []),
          hourlyRates: JSON.stringify({}),
          verificationStatus: 'PENDING',
          estado: data.estado,
        },
      });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: e.issues[0]?.message || 'Datos inválidos' },
        { status: 400 }
      );
    }
    console.error(e);
    return NextResponse.json({ error: 'Error al registrar' }, { status: 500 });
  }
}
