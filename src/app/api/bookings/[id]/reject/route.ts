import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
  });
  if (!booking) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  if (booking.taskerId !== (session.user as { id: string }).id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }
  if (booking.status !== 'PENDING') {
    return NextResponse.json({ error: 'Reserva ya procesada' }, { status: 400 });
  }

  await prisma.booking.update({
    where: { id: params.id },
    data: { status: 'CANCELLED', cancellationReason: 'Rechazado por el tasker' },
  });

  return NextResponse.redirect(new URL('/tasker/dashboard', req.url));
}
