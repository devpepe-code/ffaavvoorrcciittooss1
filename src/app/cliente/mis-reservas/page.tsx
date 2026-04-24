import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BOOKING_STATUS } from '@/types';
import { MapPin, Calendar } from 'lucide-react';

export default async function MisReservasPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const bookings = await prisma.booking.findMany({
    where: { clientId: (session.user as { id: string }).id },
    include: { tasker: true },
    orderBy: { scheduledDate: 'desc' },
  });

  const statusStyle = (status: string) => {
    if (status === 'COMPLETED') return { backgroundColor: '#F0FFF4', color: '#22C55E' };
    if (status === 'CANCELLED') return { backgroundColor: '#FEF2F2', color: '#EF4444' };
    return { backgroundColor: '#FFF0EB', color: '#FF6B35' };
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
        Mis Reservas
      </h1>
      <p className="mt-2" style={{ color: '#6B7280' }}>Historial de todos tus servicios contratados.</p>

      <div className="mt-8 space-y-4">
        {bookings.length === 0 ? (
          <Card className="rounded-2xl border-0 shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
            <CardContent className="py-12 text-center">
              <p className="text-sm" style={{ color: '#6B7280' }}>No tienes reservas aún.</p>
              <Link href="/buscar" className="mt-4 inline-block">
                <Button className="rounded-xl">Buscar servicios</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          bookings.map((b) => (
            <Card key={b.id} className="rounded-2xl border-0 shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold" style={{ color: '#1A1A2E' }}>{b.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm" style={{ color: '#6B7280' }}>
                      <span>{b.tasker.firstName} {b.tasker.lastName}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(b.scheduledDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {b.serviceCategory}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge
                      className="rounded-full px-3 py-1 text-xs"
                      style={{ ...statusStyle(b.status), border: 'none' }}
                    >
                      {(BOOKING_STATUS as Record<string, string>)[b.status] || b.status}
                    </Badge>
                    {!['COMPLETED', 'CANCELLED'].includes(b.status) && (
                      <Link href={`/reserva/${b.id}`}>
                        <Button variant="outline" size="sm" className="rounded-xl">
                          Ver detalles
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
