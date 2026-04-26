import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BOOKING_STATUS, SERVICE_CATEGORIES } from '@/types';
import { Calendar, Plus, Zap } from 'lucide-react';

export default async function ClienteDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth');

  const userId = (session.user as { id: string }).id;
  const bookings = await prisma.booking.findMany({
    where: { clientId: userId },
    include: { tasker: true },
    orderBy: { scheduledDate: 'desc' },
    take: 10,
  });

  const featuredCategories = SERVICE_CATEGORIES.filter((c) => c.value !== 'OTRO').slice(0, 6);

  const statusStyle = (status: string) => {
    if (status === 'COMPLETED') return { backgroundColor: '#F0FFF4', color: '#22C55E' };
    if (status === 'CANCELLED') return { backgroundColor: '#FEF2F2', color: '#EF4444' };
    return { backgroundColor: '#FFF7ED', color: '#F97316' };
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
            Hola, {session.user?.name?.split(' ')[0] || 'Usuario'} 👋
          </h1>
          <p className="mt-2" style={{ color: '#6B7280' }}>
            Gestiona tus reservas y encuentra servicios para tu hogar
          </p>
        </div>
        <Link href="/buscar-servicios">
          <Button className="rounded-xl" style={{ backgroundColor: '#F97316', color: '#FFFFFF' }}>
            <Plus className="mr-2 h-4 w-4" />
            Buscar servicios
          </Button>
        </Link>
      </div>

      {/* Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Mis Reservas */}
        <Card className="rounded-2xl border-0 shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
          <CardHeader>
            <h2 className="flex items-center gap-2 font-bold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
              <Calendar className="h-5 w-5" style={{ color: '#F97316' }} />
              Mis Reservas
            </h2>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  Aún no tienes reservas.
                </p>
                <Link href="/buscar-servicios">
                  <Button size="sm" className="mt-4 rounded-xl" style={{ backgroundColor: '#F97316' }}>
                    Buscar taskers
                  </Button>
                </Link>
              </div>
            ) : (
              <ul className="space-y-3">
                {bookings.slice(0, 5).map((b) => (
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
            {bookings.length > 5 && (
              <Link
                href="/cliente/mis-reservas"
                className="mt-4 block text-center text-sm font-medium"
                style={{ color: '#F97316' }}
              >
                Ver todas →
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Favorcito YA */}
        <Card className="rounded-2xl border-0 shadow-sm lg:col-span-2" style={{ backgroundColor: 'linear-gradient(135deg, #FFF7ED 0%, #FFF0EB 100%)', border: '1px solid #FED7AA' }}>
          <CardHeader>
            <h2 className="flex items-center gap-2 font-bold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
              <Zap className="h-5 w-5" style={{ color: '#F97316' }} />
              ¿Necesitas ayuda ahora mismo?
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Conecta al instante con taskers disponibles cerca de ti. Sin esperas, sin comisiones.
            </p>
            <Link href="/favorcito-ya">
              <Button
                className="mt-4 rounded-xl font-bold"
                style={{ backgroundColor: '#F97316', color: '#FFFFFF' }}
              >
                Buscar Favorcito YA! →
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Popular Services */}
      <Card className="mt-6 rounded-2xl border-0 shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
        <CardHeader>
          <h2 className="font-bold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
            Servicios Populares
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {featuredCategories.map((cat) => (
              <Link
                key={cat.value}
                href={`/buscar-servicios?categoria=${cat.value}`}
                className="flex flex-col items-center rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-sm"
                style={{ borderColor: 'rgba(0,0,0,0.08)', backgroundColor: '#FAFAF9' }}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="mt-2 text-center text-xs font-medium" style={{ color: '#1A1A2E' }}>
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
