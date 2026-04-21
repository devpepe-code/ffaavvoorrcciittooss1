import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BOOKING_STATUS } from '@/types';
import { Calendar, Briefcase, Star, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

export default async function TaskerDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

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

  const pending = bookings.filter((b) => !['COMPLETED', 'CANCELLED'].includes(b.status));

  const stats = [
    {
      icon: <Briefcase className="h-8 w-8" style={{ color: '#FF6B35' }} />,
      label: 'Trabajos completados',
      value: taskerProfile?.completedJobs ?? 0,
      bg: '#FFF0EB',
    },
    {
      icon: <Star className="h-8 w-8" style={{ color: '#FF6B35' }} />,
      label: 'Calificación promedio',
      value: taskerProfile?.averageRating?.toFixed(1) ?? '-',
      bg: '#FFFBE6',
    },
    {
      icon: <Calendar className="h-8 w-8" style={{ color: '#2EC4B6' }} />,
      label: 'Solicitudes pendientes',
      value: pending.length,
      bg: '#E8FAF9',
    },
  ];

  const statusStyle = (status: string) => {
    if (status === 'COMPLETED') return { bg: '#F0FFF4', text: '#22C55E' };
    if (status === 'CANCELLED') return { bg: '#FEF2F2', text: '#EF4444' };
    return { bg: '#FFF0EB', text: '#FF6B35' };
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}
          >
            Hola, {session.user?.name?.split(' ')[0] || 'Tasker'} 👋
          </h1>
          <p className="mt-1" style={{ color: '#6B7280' }}>
            Gestiona tus solicitudes de servicio.
          </p>
        </div>
        {taskerProfile && (
          <Link href={`/tasker/${userId}`}>
            <Button variant="outline" className="rounded-xl">
              <LinkIcon className="mr-2 h-4 w-4" />
              Ver mi perfil público
            </Button>
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card
            key={s.label}
            className="rounded-2xl border-0 shadow-sm"
            style={{ backgroundColor: s.bg }}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                {s.icon}
                <div>
                  <p className="text-sm" style={{ color: '#6B7280' }}>
                    {s.label}
                  </p>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}
                  >
                    {s.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {taskerProfile?.verificationStatus === 'PENDING' && (
        <div
          className="mt-6 rounded-2xl p-4 text-sm"
          style={{ backgroundColor: '#FFFBE6', border: '1px solid #FFE9A0' }}
        >
          <p className="font-medium" style={{ color: '#D97706' }}>
            ⏳ Verificación pendiente
          </p>
          <p className="mt-1" style={{ color: '#92400E' }}>
            Tu perfil está siendo verificado. Recibirás una notificación cuando esté aprobado.
          </p>
        </div>
      )}

      {/* Recent bookings */}
      <Card className="mt-8 rounded-2xl border-0 shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
        <CardHeader>
          <h2 className="font-semibold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
            Solicitudes recientes
          </h2>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm" style={{ color: '#6B7280' }}>
                Aún no tienes solicitudes. Completa tu perfil para aparecer en las búsquedas.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {bookings.map((b) => {
                const s = statusStyle(b.status);
                return (
                  <li
                    key={b.id}
                    className="flex items-center justify-between rounded-xl p-4"
                    style={{ backgroundColor: '#FAFAF9', border: '1px solid rgba(0,0,0,0.05)' }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium" style={{ color: '#1A1A2E' }}>
                        {b.title}
                      </p>
                      <p className="mt-0.5 text-sm" style={{ color: '#6B7280' }}>
                        {b.client.firstName} {b.client.lastName} ·{' '}
                        {new Date(b.scheduledDate).toLocaleDateString('es', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="ml-4 flex items-center gap-3">
                      <Badge
                        className="shrink-0 rounded-full px-3 py-1 text-xs"
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
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
