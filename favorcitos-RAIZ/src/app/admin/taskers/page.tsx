import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function AdminTaskersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');
  if ((session.user as { role?: string })?.role !== 'ADMIN') redirect('/cliente/dashboard');

  const taskers = await prisma.user.findMany({
    where: { role: 'TASKER' },
    include: { taskerProfile: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Taskers</h1>
      <p className="mt-2 text-slate-600">Gestión de proveedores de servicios</p>

      <Card className="mt-8">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="px-4 py-3 text-left text-sm font-medium">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Rating</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Trabajos</th>
                </tr>
              </thead>
              <tbody>
                {taskers.map((u) => (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          u.taskerProfile?.verificationStatus === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : u.taskerProfile?.verificationStatus === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-800'
                        }
                      >
                        {u.taskerProfile?.verificationStatus || 'N/A'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {u.taskerProfile?.averageRating?.toFixed(1) || '-'}
                    </td>
                    <td className="px-4 py-3">{u.taskerProfile?.completedJobs ?? 0}</td>
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
