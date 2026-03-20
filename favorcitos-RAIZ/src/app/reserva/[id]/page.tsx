import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BOOKING_STATUS } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function ReservaDetallePage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { client: true, tasker: true },
  });

  if (!booking) notFound();

  const userId = (session.user as { id: string }).id;
  const isClient = booking.clientId === userId;
  const isTasker = booking.taskerId === userId;
  if (!isClient && !isTasker) notFound();

  const otherUser = isClient ? booking.tasker : booking.client;

  const scheduledDate = new Date(booking.scheduledDate);
  const twoHoursBefore = new Date(scheduledDate.getTime() - 2 * 60 * 60 * 1000);
  const canCancel =
    isClient &&
    !['COMPLETED', 'CANCELLED'].includes(booking.status) &&
    new Date() < twoHoursBefore;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{booking.title}</h1>
        <Badge
          className={
            booking.status === 'COMPLETED'
              ? 'bg-green-100 text-green-800'
              : booking.status === 'CANCELLED'
              ? 'bg-red-100 text-red-800'
              : 'bg-amber-100 text-amber-800'
          }
        >
          {(BOOKING_STATUS as Record<string, string>)[booking.status] || booking.status}
        </Badge>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500">Servicio</p>
              <p className="font-medium">{booking.serviceCategory}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Descripción</p>
              <p className="text-slate-700">{booking.description}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Dirección</p>
              <p>{booking.address}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Fecha y hora</p>
              <p>{new Date(booking.scheduledDate).toLocaleString('es')}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">
                {isClient ? 'Tasker asignado' : 'Cliente'}
              </p>
              <p className="font-medium">
                {otherUser.firstName} {otherUser.lastName}
              </p>
              <p className="text-sm text-slate-600">{otherUser.email}</p>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-slate-500">Resumen de pago</p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Servicio ({booking.estimatedHours}h)</span>
                  <span>${booking.estimatedTotal} MXN</span>
                </div>
                <div className="flex justify-between">
                  <span>Comisión</span>
                  <span>${booking.platformFee + booking.trustSupportFee} MXN</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${booking.estimatedTotal + booking.platformFee + booking.trustSupportFee} MXN</span>
                </div>
              </div>
            </div>
          </div>

          {!['COMPLETED', 'CANCELLED'].includes(booking.status) && isTasker && (
            <div className="mt-6 flex gap-2">
              <form action={`/api/bookings/${booking.id}/accept`} method="POST">
                <Button type="submit">Aceptar reserva</Button>
              </form>
              <form action={`/api/bookings/${booking.id}/reject`} method="POST">
                <Button type="submit" variant="destructive">
                  Rechazar
                </Button>
              </form>
            </div>
          )}

          {isClient &&
            !['COMPLETED', 'CANCELLED'].includes(booking.status) &&
            !canCancel &&
            new Date() >= twoHoursBefore && (
              <p className="mt-6 text-sm text-slate-500">
                No se puede cancelar menos de 2 horas antes del inicio del servicio.
              </p>
            )}
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-between items-center">
        <Link href={isClient ? '/cliente/mis-reservas' : '/tasker/dashboard'}>
          <Button variant="outline">← Volver</Button>
        </Link>
        {canCancel && (
          <form action={`/api/bookings/${booking.id}/cancel`} method="POST">
            <Button type="submit" variant="destructive">
              Cancelar reserva
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
