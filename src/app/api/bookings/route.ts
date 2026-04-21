import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const schema = z.object({
  taskerId: z.string(),
  serviceCategory: z.string(),
  title: z.string().min(2),
  description: z.string().min(2),
  address: z.string().min(2),
  scheduledDate: z.string(),
  estimatedHours: z.number(),
  hourlyRate: z.number().default(0),
  estimatedTotal: z.number().default(0),
  platformFee: z.number().default(0),
  trustSupportFee: z.number().default(0),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const data = schema.parse(body);

    const tasker = await prisma.user.findUnique({
      where: { id: data.taskerId, role: 'TASKER' },
    });
    if (!tasker) {
      return NextResponse.json({ error: 'Tasker no encontrado' }, { status: 404 });
    }

    const booking = await prisma.booking.create({
      data: {
        clientId: (session.user as { id: string }).id,
        taskerId: data.taskerId,
        serviceCategory: data.serviceCategory,
        title: data.title,
        description: data.description,
        address: data.address,
        scheduledDate: new Date(data.scheduledDate),
        estimatedHours: data.estimatedHours,
        hourlyRate: 0,
        estimatedTotal: 0,
        platformFee: 0,
        trustSupportFee: 0,
        status: 'PENDING',
        paymentStatus: 'PENDING',
      },
    });

    return NextResponse.json({ booking });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues }, { status: 400 });
    }
    console.error(e);
    return NextResponse.json({ error: 'Error al crear reserva' }, { status: 500 });
  }
}
