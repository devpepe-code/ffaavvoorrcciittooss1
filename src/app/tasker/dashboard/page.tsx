import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BOOKING_STATUS } from '@/types';
import { DollarSign, Calendar, Briefcase } from 'lucide-react';

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
    take: 5,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">
        Hola, {session.user?.name?.split(' ')[0] || 'Tasker'}
      </h1>
      <p className="mt-2 text-slate-600">
        Gestiona tus trabajos y ganancias.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-sm text-slate-600">Balance disponible</p>
                <p className="text-2xl font-bold">
                  ${taskerProfile?.availableBalance ?? 0} MXN
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Briefcase className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-sm text-slate-600">Trabajos completados</p>
                <p className="text-2xl font-bold">{taskerProfile?.completedJobs ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              <div>
                <p className="text-sm text-slate-600">Calificación</p>
                <p className="text-2xl font-bold">
                  {taskerProfile?.averageRating?.toFixed(1) ?? '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-sm text-slate-600">Pendientes</p>
                <p className="text-2xl font-bold">
                  {bookings.filter((b) => !['COMPLETED', 'CANCELLED'].includes(b.status)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <h2 className="font-semibold">Trabajos recientes</h2>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-slate-600">No tienes trabajos aún.</p>
          ) : (
            <ul className="space-y-4">
              {bookings.map((b) => (
                <li key={b.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">{b.title}</p>
                    <p className="text-sm text-slate-500">
                      {b.client.firstName} {b.client.lastName} •{' '}
                      {new Date(b.scheduledDate).toLocaleDateString('es')}
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
                    <span className="font-semibold">${b.estimatedTotal} MXN</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
