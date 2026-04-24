import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BOOKING_STATUS, SERVICE_CATEGORIES } from '@/types';
import { Calendar, Plus } from 'lucide-react';

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

  const featuredCategories = SERVICE_CATEGORIES.slice(0, 6);

  const statusStyle = (status: string) => {
    if (status === 'COMPLETED') return { backgroundColor: '#F0FFF4', color: '#22C55E' };
    if (status === 'CANCELLED') return { backgroundColor: '#FEF2F2', color: '#EF4444' };
    return { backgroundColor: '#FFF0EB', color: '#FF6B35' };
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}
          >
            Hola, {session.user?.name?.split(' ')[0] || 'Usuario'} 👋
          </h1>
          <p className="mt-1" style={{ color: '#6B7280' }}>
            Gestiona tus reservas y encuentra servicios para tu hogar.
          </p>
        </div>
        <Link href="/buscar">
          <Button className="rounded-xl">
            <Plus className="mr-2 h-4 w-4" />
            Buscar servicios
          </Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border-0 shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
          <CardHeader>
            <h2
              className="flex items-center gap-2 font-semibold"
              style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}
            >
              <Calendar className="h-5 w-5" style={{ color: '#FF6B35' }} />
              Mis reservas recientes
            </h2>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="py-4 text-center">
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  Aún no tienes reservas.
                </p>
                <Link href="/buscar">
                  <Button size="sm" className="mt-3 rounded-xl">
                    Buscar taskers
                  </Button>
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {bookings.map((b) => (
                  <li
                    key={b.id}
                    className="flex items-center justify-between rounded-xl p-3"
                    style={{ backgroundColor: '#FAFAF9', border: '1px solid rgba(0,0,0,0.05)' }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium" style={{ color: '#1A1A2E' }}>
                        {b.title}
                      </p>
                      <p className="text-xs" style={{ color: '#6B7280' }}>
                        {b.tasker.firstName} · {new Date(b.scheduledDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <Badge
                      className="ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs"
                      style={{ ...statusStyle(b.status), border: 'none' }}
                    >
                      {(BOOKING_STATUS as Record<string, string>)[b.status] || b.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
            <Link
              href="/cliente/mis-reservas"
              className="mt-4 block text-center text-sm font-medium"
              style={{ color: '#FF6B35' }}
            >
              Ver todas →
            </Link>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-sm lg:col-span-2" style={{ backgroundColor: '#FFFFFF' }}>
          <CardHeader>
            <h2
              className="font-semibold"
              style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}
            >
              Servicios populares
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {featuredCategories.map((cat) => (
                <Link
                  key={cat.value}
                  href={`/buscar?categoria=${cat.value}`}
                  className="flex items-center gap-3 rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm"
                  style={{ borderColor: 'rgba(0,0,0,0.08)', backgroundColor: '#FAFAF9' }}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-sm font-medium" style={{ color: '#1A1A2E' }}>
                    {cat.label}
                  </span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
