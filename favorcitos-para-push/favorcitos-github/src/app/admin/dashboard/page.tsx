import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Users, Briefcase, DollarSign, Calendar } from 'lucide-react';

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  if ((session.user as { role?: string })?.role !== 'ADMIN') redirect('/cliente/dashboard');

  const [usersCount, taskersCount, bookingsCount, totalRevenue] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'TASKER' } }),
    prisma.booking.count({ where: { status: 'COMPLETED' } }),
    prisma.booking.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { platformFee: true, trustSupportFee: true },
    }),
  ]);

  const revenue = (totalRevenue._sum.platformFee ?? 0) + (totalRevenue._sum.trustSupportFee ?? 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Panel de Administración</h1>
      <p className="mt-2 text-slate-600">Resumen de la plataforma</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-sm text-slate-600">Usuarios totales</p>
                <p className="text-2xl font-bold">{usersCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Briefcase className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-sm text-slate-600">Taskers</p>
                <p className="text-2xl font-bold">{taskersCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-sm text-slate-600">Trabajos completados</p>
                <p className="text-2xl font-bold">{bookingsCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-sm text-slate-600">Ingresos (comisiones)</p>
                <p className="text-2xl font-bold">${revenue.toFixed(2)} MXN</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <h2 className="font-semibold">Acciones rápidas</h2>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <a
              href="/admin/usuarios"
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Gestionar usuarios
            </a>
            <a
              href="/admin/taskers"
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Gestionar taskers
            </a>
            <a
              href="/admin/reservas"
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Ver reservas
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
