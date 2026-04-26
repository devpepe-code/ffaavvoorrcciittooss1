import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BOOKING_STATUS } from '@/types';
import { TrendingUp, DollarSign, Clock, Star, MapPin } from 'lucide-react';
import Link from 'next/link';

export default async function TaskerDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/auth');

  const userId = (session.user as { id: string }).id;
  const taskerProfile = await prisma.taskerProfile.findUnique({
    where: { userId },
  });
  const bookings = await prisma.booking.findMany({
    where: { taskerId: userId },
    include: { client: true },
    orderBy: { scheduledDate: 'desc' },
    take: 10,
  });
  const reviews = await prisma.review.findMany({
    where: { reviewedId: userId },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const stats = [
    {
      icon: <DollarSign className="h-6 w-6" style={{ color: '#F97316' }} />,
      label: 'Ganancias este mes',
      value: `$${(taskerProfile?.totalEarnings || 0).toLocaleString()}`,
      trend: '+12% vs mes anterior',
      bg: '#FFF7ED',
    },
    {
      icon: <Clock className="h-6 w-6" style={{ color: '#2EC4B6' }} />,
      label: 'Pendiente de pago',
      value: `$${(taskerProfile?.pendingBalance || 0).toLocaleString()}`,
      trend: 'Se transfiere el 15 de mes',
      bg: '#E8FAF9',
    },
    {
      icon: <TrendingUp className="h-6 w-6" style={{ color: '#F97316' }} />,
      label: 'Total ganado',
      value: `$${(taskerProfile?.totalEarnings || 0).toLocaleString()}`,
      trend: 'Desde que te registraste',
      bg: '#FFFBE6',
    },
  ];

  const statusStyle = (status: string) => {
    if (status === 'COMPLETED') return { bg: '#F0FFF4', text: '#22C55E' };
    if (status === 'CANCELLED') return { bg: '#FEF2F2', text: '#EF4444' };
    if (status === 'CONFIRMED') return { bg: '#FFF7ED', text: '#F97316' };
    return { bg: '#F3F4F6', text: '#6B7280' };
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
          Hola, {session.user?.name?.split(' ')[0] || 'Tasker'} 👋
        </h1>
        <p className="mt-2" style={{ color: '#6B7280' }}>
          Panel de control — Gestiona tus ganancias y reservas
        </p>
      </div>

      {/* Earnings - Featured */}
      <Card className="mb-8 rounded-2xl border-0 shadow-sm lg:col-span-full" style={{ backgroundColor: '#FFFFFF' }}>
        <CardHeader>
          <h2 className="text-xl font-bold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
            💰 Ganancias
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl p-4" style={{ backgroundColor: s.bg }}>
                <div className="flex items-center gap-3">
                  {s.icon}
                  <div>
                    <p className="text-sm" style={{ color: '#6B7280' }}>
                      {s.label}
                    </p>
                    <p className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>
                      {s.value}
                    </p>
                    <p className="text-xs" style={{ color: '#9CA3AF' }}>
                      {s.trend}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Mis Reservas */}
        <Card className="rounded-2xl border-0 shadow-sm lg:col-span-2" style={{ backgroundColor: '#FFFFFF' }}>
          <CardHeader>
            <h2 className="font-bold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
              📅 Mis Reservas
            </h2>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-sm text-center py-8" style={{ color: '#6B7280' }}>
                No tienes reservas aún. Completa tu perfil para aparecer en las búsquedas.
              </p>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => {
                  const s = statusStyle(b.status);
                  return (
                    <div
                      key={b.id}
                      className="flex items-center justify-between rounded-xl p-4"
                      style={{ backgroundColor: '#FAFAF9', border: '1px solid rgba(0,0,0,0.05)' }}
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-sm" style={{ color: '#1A1A2E' }}>
                          {b.title}
                        </p>
                        <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                          {b.client.firstName} · {new Date(b.scheduledDate).toLocaleDateString('es')}
                        </p>
                      </div>
                      <div className="ml-2 flex items-center gap-2">
                        <Badge
                          className="shrink-0 rounded-full px-2 py-0.5 text-xs"
                          style={{ backgroundColor: s.bg, color: s.text, border: 'none' }}
                        >
                          {(BOOKING_STATUS as Record<string, string>)[b.status] || b.status}
                        </Badge>
                        <Link href={`/reserva/${b.id}`}>
                          <Button size="sm" variant="ghost" className="rounded-xl text-xs">
                            Ver →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Section */}
        <Card className="rounded-2xl border-0 shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
          <CardHeader>
            <h2 className="font-bold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
              👤 Mi Perfil
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs" style={{ color: '#9CA3AF' }}>
                Ubicación
              </p>
              <p className="text-sm font-medium mt-1" style={{ color: '#1A1A2E' }}>
                <MapPin className="inline h-4 w-4 mr-1" />
                {taskerProfile?.colonia || 'No especificada'}
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: '#9CA3AF' }}>
                Calificación promedio
              </p>
              <p className="text-sm font-medium mt-1" style={{ color: '#1A1A2E' }}>
                <Star className="inline h-4 w-4 mr-1 fill-[#F97316]" />
                {taskerProfile?.averageRating?.toFixed(1) || '-'} ({taskerProfile?.totalReviews || 0} reseñas)
              </p>
            </div>
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="rounded" defaultChecked={true} />
                <span className="text-sm" style={{ color: '#1A1A2E' }}>
                  Disponible para Favorcito YA
                </span>
              </label>
              <p className="text-xs mt-1" style={{ color: '#6B7280' }}>
                Cuando está activo, los clientes pueden contactarte al instante
              </p>
            </div>
            <Button className="w-full rounded-xl mt-4" style={{ backgroundColor: '#F97316', color: '#FFFFFF' }}>
              Editar Perfil
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <Card className="mt-6 rounded-2xl border-0 shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
          <CardHeader>
            <h2 className="font-bold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
              ⭐ Reseñas Recientes
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl p-4"
                  style={{ backgroundColor: '#FAFAF9', border: '1px solid rgba(0,0,0,0.05)' }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: '#1A1A2E' }}>
                        {r.overallRating} ⭐
                      </p>
                      <p className="text-sm mt-1" style={{ color: '#6B7280' }}>
                        {r.comment}
                      </p>
                    </div>
                    <p className="text-xs" style={{ color: '#9CA3AF' }}>
                      {new Date(r.createdAt).toLocaleDateString('es')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
