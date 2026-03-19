import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BOOKING_STATUS } from '@/types';

export default async function MisReservasPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const bookings = await prisma.booking.findMany({
    where: { clientId: (session.user as { id: string }).id },
    include: { tasker: true },
    orderBy: { scheduledDate: 'desc' },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Mis Reservas</h1>
      <p className="mt-2 text-slate-600">Historial de todos tus servicios contratados.</p>

      <div className="mt-8 space-y-4">
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-600">No tienes reservas aún.</p>
              <Link href="/buscar" className="mt-4 inline-block">
                <Button>Buscar servicios</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          bookings.map((b) => (
            <Card key={b.id}>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold">{b.title}</h3>
                    <p className="text-sm text-slate-600">
                      {b.tasker.firstName} {b.tasker.lastName} • {b.serviceCategory}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {new Date(b.scheduledDate).toLocaleString('es')} • ${b.estimatedTotal} MXN
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        b.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : b.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }
                    >
                      {(BOOKING_STATUS as Record<string, string>)[b.status] || b.status}
                    </Badge>
                    {!['COMPLETED', 'CANCELLED'].includes(b.status) && (
                      <Link href={`/reserva/${b.id}`}>
                        <Button variant="outline" size="sm">
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
