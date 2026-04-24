import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Users, Briefcase, Calendar } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  if ((session.user as { role?: string })?.role !== 'ADMIN') redirect('/cliente/dashboard');

  const [usersCount, taskersCount, bookingsCount] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'TASKER' } }),
    prisma.booking.count({ where: { status: 'COMPLETED' } }),
  ]);

  const stats = [
    { icon: <Users className="h-8 w-8" style={{ color: '#FF6B35' }} />, label: 'Usuarios totales', value: usersCount, bg: '#FFF0EB' },
    { icon: <Briefcase className="h-8 w-8" style={{ color: '#2EC4B6' }} />, label: 'Taskers', value: taskersCount, bg: '#E8FAF9' },
    { icon: <Calendar className="h-8 w-8" style={{ color: '#FF6B35' }} />, label: 'Trabajos completados', value: bookingsCount, bg: '#FFF0EB' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
        Panel de Administración
      </h1>
      <p className="mt-2" style={{ color: '#6B7280' }}>Resumen de la plataforma</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="rounded-2xl border-0 shadow-sm" style={{ backgroundColor: s.bg }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                {s.icon}
                <div>
                  <p className="text-sm" style={{ color: '#6B7280' }}>{s.label}</p>
                  <p className="text-2xl font-bold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
                    {s.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 rounded-2xl border-0 shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
        <CardHeader>
          <h2 className="font-semibold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
            Acciones rápidas
          </h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {[
              { href: '/admin/usuarios', label: 'Gestionar usuarios' },
              { href: '/admin/taskers', label: 'Gestionar taskers' },
              { href: '/admin/reservas', label: 'Ver reservas' },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="rounded-xl border px-4 py-2 text-sm font-medium transition-colors hover:border-[#FF6B35] hover:text-[#FF6B35]"
                style={{ borderColor: 'rgba(0,0,0,0.1)', color: '#6B7280' }}
              >
                {a.label}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
