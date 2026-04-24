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

  const statusStyle = (status: string) => {
    if (status === 'COMPLETED') return { backgroundColor: '#F0FFF4', color: '#22C55E' };
    if (status === 'CANCELLED') return { backgroundColor: '#FEF2F2', color: '#EF4444' };
    return { backgroundColor: '#FFF0EB', color: '#FF6B35' };
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
        Reservas
      </h1>
      <p className="mt-2" style={{ color: '#6B7280' }}>Todas las reservas de la plataforma</p>

      <Card className="mt-8 rounded-2xl border-0 shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: 'rgba(0,0,0,0.06)', backgroundColor: '#FAFAF9' }}>
                  {['Título', 'Cliente', 'Tasker', 'Estado', 'Fecha'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b last:border-0" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                    <td className="px-4 py-3">
                      <Link href={`/reserva/${b.id}`} className="font-medium hover:underline" style={{ color: '#FF6B35' }}>
                        {b.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#1A1A2E' }}>
                      {b.client.firstName} {b.client.lastName}
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#1A1A2E' }}>
                      {b.tasker.firstName} {b.tasker.lastName}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className="rounded-full px-2 py-0.5 text-xs"
                        style={{ ...statusStyle(b.status), border: 'none' }}
                      >
                        {(BOOKING_STATUS as Record<string, string>)[b.status] || b.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#6B7280' }}>
                      {new Date(b.scheduledDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-sm" style={{ color: '#9CA3AF' }}>
                      No hay reservas aún.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
