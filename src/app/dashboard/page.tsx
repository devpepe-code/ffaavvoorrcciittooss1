import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardGatePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const role = (session.user as { role?: string }).role;
  if (role === 'ADMIN') redirect('/admin/dashboard');
  if (role === 'TASKER') redirect('/tasker/dashboard');
  redirect('/cliente/dashboard');
}
