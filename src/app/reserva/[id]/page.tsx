import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BOOKING_STATUS } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, User } from 'lucide-react';

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

  const statusColors: Record<string, { bg: string; text: string }> = {
    COMPLETED: { bg: '#F0FFF4', text: '#22C55E' },
    CANCELLED: { bg: '#FEF2F2', text: '#EF4444' },
  };
  const statusStyle = statusColors[booking.status] || { bg: '#FFF0EB', text: '#FF6B35' };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <h1
          className="text-2xl font-bold"
          style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}
        >
          {booking.title}
        </h1>
        <Badge
          className="shrink-0 rounded-full px-3 py-1 text-sm"
          style={{ backgroundColor: statusStyle.bg, color: statusStyle.text, border: 'none' }}
        >
          {(BOOKING_STATUS as Record<string, string>)[booking.status] || booking.status}
        </Badge>
      </div>

      <Card className="rounded-2xl border-0 shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
        <CardContent className="p-6">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
                Servicio
              </p>
              <p className="mt-1 font-medium" style={{ color: '#1A1A2E' }}>
                {booking.serviceCategory}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
                Descripción
              </p>
              <p className="mt-1 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                {booking.description}
              </p>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: '#FF6B35' }} />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
                  Dirección
                </p>
                <p className="mt-1 text-sm" style={{ color: '#1A1A2E' }}>
                  {booking.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0" style={{ color: '#FF6B35' }} />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
                  Fecha y hora
                </p>
                <p className="mt-1 text-sm" style={{ color: '#1A1A2E' }}>
                  {new Date(booking.scheduledDate).toLocaleString('es', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <User className="mt-0.5 h-4 w-4 shrink-0" style={{ color: '#FF6B35' }} />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
                  {isClient ? 'Tasker asignado' : 'Cliente'}
                </p>
                <p className="mt-1 font-medium" style={{ color: '#1A1A2E' }}>
                  {otherUser.firstName} {otherUser.lastName}
                </p>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  {otherUser.email}
                </p>
              </div>
            </div>

            <div
              className="rounded-xl p-4 text-sm"
              style={{ backgroundColor: '#E8FAF9' }}
            >
              <p className="font-medium" style={{ color: '#2EC4B6' }}>
                💬 Acuerda el precio directamente con el tasker
              </p>
              <p className="mt-1" style={{ color: '#6B7280' }}>
                Favorcitos es 100% gratuito — sin comisiones ni tarifas.
              </p>
            </div>
          </div>

          {!['COMPLETED', 'CANCELLED'].includes(booking.status) && isTasker && (
            <div className="mt-6 flex gap-3">
              <form action={`/api/bookings/${booking.id}/accept`} method="POST" className="flex-1">
                <Button type="submit" className="w-full rounded-xl">
                  Aceptar solicitud
                </Button>
              </form>
              <form action={`/api/bookings/${booking.id}/reject`} method="POST">
                <Button type="submit" variant="destructive" className="rounded-xl">
                  Rechazar
                </Button>
              </form>
            </div>
          )}

          {isClient &&
            !['COMPLETED', 'CANCELLED'].includes(booking.status) &&
            !canCancel &&
            new Date() >= twoHoursBefore && (
              <p className="mt-4 text-xs" style={{ color: '#9CA3AF' }}>
                No se puede cancelar menos de 2 horas antes del inicio del servicio.
              </p>
            )}
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center justify-between">
        <Link href={isClient ? '/cliente/mis-reservas' : '/tasker/dashboard'}>
          <Button variant="outline" className="rounded-xl">
            ← Volver
          </Button>
        </Link>
        {canCancel && (
          <form action={`/api/bookings/${booking.id}/cancel`} method="POST">
            <Button type="submit" variant="destructive" className="rounded-xl">
              Cancelar solicitud
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
