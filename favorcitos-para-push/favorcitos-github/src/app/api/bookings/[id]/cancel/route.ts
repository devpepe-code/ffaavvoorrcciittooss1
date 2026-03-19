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
  if (booking.clientId !== (session.user as { id: string }).id) {
    return NextResponse.json({ error: 'Solo el cliente puede cancelar' }, { status: 403 });
  }
  if (['COMPLETED', 'CANCELLED'].includes(booking.status)) {
    return NextResponse.json({ error: 'Esta reserva no se puede cancelar' }, { status: 400 });
  }

  const scheduledDate = new Date(booking.scheduledDate);
  const twoHoursBefore = new Date(scheduledDate.getTime() - 2 * 60 * 60 * 1000);
  const now = new Date();

  if (now >= twoHoursBefore) {
    return NextResponse.json(
      { error: 'No se puede cancelar menos de 2 horas antes del inicio del servicio' },
      { status: 400 }
    );
  }

  await prisma.booking.update({
    where: { id: params.id },
    data: {
      status: 'CANCELLED',
      cancellationReason: 'Cancelado por el cliente',
      cancelledBy: (session.user as { id: string }).id,
    },
  });

  return NextResponse.redirect(new URL('/cliente/mis-reservas', req.url));
}
