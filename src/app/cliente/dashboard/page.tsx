import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BOOKING_STATUS } from '@/types';
import { Wrench, Calendar, Plus } from 'lucide-react';

export default async function ClienteDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const userId = (session.user as { id: string }).id;
  const bookings = await prisma.booking.findMany({
    where: { clientId: userId },
    include: { tasker: true },
    orderBy: { scheduledDate: 'desc' },
    take: 5,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Hola, {session.user?.name?.split(' ')[0] || 'Usuario'}
          </h1>
          <p className="mt-1 text-slate-600">
            Gestiona tus reservas y encuentra servicios para tu hogar.
          </p>
        </div>
        <Link href="/buscar">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Buscar servicios
          </Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <h2 className="flex items-center gap-2 font-semibold">
              <Calendar className="h-5 w-5" />
              Mis reservas recientes
            </h2>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-slate-600">Aún no tienes reservas.</p>
            ) : (
              <ul className="space-y-4">
                {bookings.map((b) => (
                  <li key={b.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                    <div>
                      <p className="font-medium">
                        {b.title} - {b.tasker.firstName} {b.tasker.lastName}
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(b.scheduledDate).toLocaleDateString('es')}
                      </p>
                    </div>
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
                  </li>
                ))}
              </ul>
            )}
            <Link href="/cliente/mis-reservas" className="mt-4 block text-sm text-amber-600 hover:underline">
              Ver todas →
            </Link>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="flex items-center gap-2 font-semibold">
              <Wrench className="h-5 w-5" />
              Servicios populares
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {['LIMPIEZA_HOGAR', 'PLOMERIA', 'ELECTRICIDAD', 'MUDANZA', 'PINTURA', 'HANDYMAN_GENERAL'].map(
                (svc) => (
                  <Link
                    key={svc}
                    href={`/buscar?categoria=${svc}`}
                    className="rounded-lg border p-4 transition hover:border-amber-300 hover:bg-amber-50/50"
                  >
                    <span className="font-medium text-slate-800">
                      {(svc === 'LIMPIEZA_HOGAR' && 'Limpieza') ||
                        (svc === 'HANDYMAN_GENERAL' && 'Handyman') ||
                        svc}
                    </span>
                  </Link>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
