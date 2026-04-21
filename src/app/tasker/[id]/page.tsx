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
      <TaskerProfileView
        tasker={{
          id: tasker.id,
          firstName: tasker.firstName,
          lastName: tasker.lastName,
          city: tasker.city,
          estado: tasker.estado ?? null,
          colonia: tasker.colonia ?? null,
          phone: tasker.phone ?? null,
          taskerProfile: tasker.taskerProfile
            ? {
                bio: tasker.taskerProfile.bio,
                services: tasker.taskerProfile.services,
                hourlyRates: tasker.taskerProfile.hourlyRates,
                averageRating: tasker.taskerProfile.averageRating,
                totalReviews: tasker.taskerProfile.totalReviews,
                completedJobs: tasker.taskerProfile.completedJobs,
                verificationStatus: tasker.taskerProfile.verificationStatus,
                whatsapp: tasker.taskerProfile.whatsapp ?? null,
              }
            : null,
        }}
        categories={SERVICE_CATEGORIES}
      />
    </div>
  );
}
