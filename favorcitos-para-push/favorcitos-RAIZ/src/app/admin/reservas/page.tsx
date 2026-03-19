import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BOOKING_STATUS } from '@/types';

export default async function AdminReservasPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  if ((session.user as { role?: string })?.role !== 'ADMIN') redirect('/cliente/dashboard');

  const bookings = await prisma.booking.findMany({
    include: { client: true, tasker: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Reservas</h1>
      <p className="mt-2 text-slate-600">Todas las reservas de la plataforma</p>

      <Card className="mt-8">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-4 py-3 text-left text-sm font-medium">Título</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Cliente</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Tasker</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <Link href={`/reserva/${b.id}`} className="font-medium text-amber-600 hover:underline">
                        {b.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {b.client.firstName} {b.client.lastName}
                    </td>
                    <td className="px-4 py-3">
                      {b.tasker.firstName} {b.tasker.lastName}
                    </td>
                    <td className="px-4 py-3">
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
                    </td>
                    <td className="px-4 py-3">${b.estimatedTotal} MXN</td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {new Date(b.scheduledDate).toLocaleDateString('es')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
