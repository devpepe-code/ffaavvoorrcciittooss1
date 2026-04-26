import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({ where: { id: params.id } });
  return { title: `${user?.firstName || 'Usuario'} — Favorcitos` };
}

export default async function ClienteProfilePage({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      reviewsReceived: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });

  if (!user || user.role !== 'CLIENTE') {
    notFound();
  }

  const avgRating =
    user.reviewsReceived.length > 0
      ? (
          user.reviewsReceived.reduce((sum, r) => sum + r.overallRating, 0) /
          user.reviewsReceived.length
        ).toFixed(1)
      : '-';

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      {/* Profile Card */}
      <Card className="rounded-2xl border-0 shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
        <CardContent className="p-8">
          <div className="text-center">
            <div
              className="mx-auto flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold text-white"
              style={{ backgroundColor: '#F97316' }}
            >
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <h1 className="mt-4 text-2xl font-bold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
              {user.firstName} {user.lastName}
            </h1>
            <p className="mt-1 flex items-center justify-center gap-2 text-sm" style={{ color: '#6B7280' }}>
              <MapPin className="h-4 w-4" />
              {user.city}, {user.estado}
            </p>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl p-4" style={{ backgroundColor: '#FFF7ED' }}>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  Calificación promedio
                </p>
                <p className="mt-2 text-2xl font-bold" style={{ color: '#1A1A2E' }}>
                  <Star className="inline h-5 w-5 fill-[#F97316] text-[#F97316] mr-1" />
                  {avgRating}
                </p>
              </div>
              <div className="rounded-xl p-4" style={{ backgroundColor: '#E8FAF9' }}>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  Reseñas
                </p>
                <p className="mt-2 text-2xl font-bold" style={{ color: '#1A1A2E' }}>
                  {user.reviewsReceived.length}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm" style={{ color: '#9CA3AF' }}>
              Miembro desde {new Date(user.createdAt!).toLocaleDateString('es-MX', { year: 'numeric', month: 'long' })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Reviews */}
      {user.reviewsReceived.length > 0 && (
        <Card className="mt-6 rounded-2xl border-0 shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
          <CardHeader>
            <h2 className="font-bold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
              Reseñas de taskers
            </h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.reviewsReceived.map((r) => (
                <div key={r.id} className="rounded-xl p-4" style={{ backgroundColor: '#FAFAF9' }}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-sm" style={{ color: '#1A1A2E' }}>
                        {'⭐'.repeat(Math.floor(r.overallRating))}
                      </p>
                      {r.comment && (
                        <p className="mt-2 text-sm" style={{ color: '#6B7280' }}>
                          "{r.comment}"
                        </p>
                      )}
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

      <div className="mt-8 text-center">
        <Link href="/">
          <Button variant="outline" className="rounded-xl">
            ← Volver
          </Button>
        </Link>
      </div>
    </div>
  );
}
