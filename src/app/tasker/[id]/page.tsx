import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { TaskerProfileView } from '@/components/cliente/TaskerProfileView';
import { SERVICE_CATEGORIES } from '@/types';

export default async function TaskerProfilePage({ params }: { params: { id: string } }) {
  const tasker = await prisma.user.findUnique({
    where: { id: params.id, role: 'TASKER' },
    include: { taskerProfile: true },
  });
  if (!tasker) notFound();
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <TaskerProfileView tasker={tasker} categories={SERVICE_CATEGORIES} />
    </div>
  );
}
