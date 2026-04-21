'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, CheckCircle, Briefcase } from 'lucide-react';

type Tasker = {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  taskerProfile: {
    bio: string | null;
    services: string;
    hourlyRates: string;
    averageRating: number;
    totalReviews: number;
    completedJobs: number;
    verificationStatus: string;
  } | null;
};

type Cat = { value: string; label: string; icon: string };

export function TaskerProfileView({
  tasker,
  categories,
}: {
  tasker: Tasker;
  categories: readonly Cat[];
}) {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const services = (() => {
    try {
      return JSON.parse(tasker.taskerProfile?.services || '[]') as string[];
    } catch {
      return [];
    }
  })();

  const getLabel = (v: string) => categories.find((c) => c.value === v)?.label || v;
  const getIcon = (v: string) => categories.find((c) => c.value === v)?.icon || '🔧';

  function handleSolicitar() {
    if (!selectedService) {
      setError('Selecciona un servicio de la lista antes de continuar');
      return;
    }
    router.push(`/reserva/nueva?taskerId=${tasker.id}&servicio=${selectedService}`);
  }

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <Card className="rounded-2xl border-0 shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div
              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full text-3xl font-bold text-white"
              style={{ backgroundColor: '#FF6B35' }}
            >
              {tasker.firstName[0]}
              {tasker.lastName[0]}
            </div>
            <div className="flex-1">
              <h1
                className="text-2xl font-bold"
                style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}
              >
                {tasker.firstName} {tasker.lastName}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-[#FF6B35] text-[#FF6B35]" />
                  <span className="font-semibold" style={{ color: '#1A1A2E' }}>
                    {tasker.taskerProfile?.averageRating.toFixed(1) || '-'}
                  </span>
                  <span style={{ color: '#6B7280' }}>
                    ({tasker.taskerProfile?.totalReviews || 0} reseñas)
                  </span>
                </div>
                <div className="flex items-center gap-1" style={{ color: '#6B7280' }}>
                  <MapPin className="h-4 w-4" />
                  {tasker.city}
                </div>
                <div className="flex items-center gap-1" style={{ color: '#6B7280' }}>
                  <Briefcase className="h-4 w-4" />
                  {tasker.taskerProfile?.completedJobs || 0} trabajos
                </div>
              </div>
              {tasker.taskerProfile?.verificationStatus === 'APPROVED' && (
                <Badge
                  className="mt-3 rounded-full px-3 py-1"
                  style={{ backgroundColor: '#F0FFF4', color: '#22C55E', border: 'none' }}
                >
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Identidad Verificada
                </Badge>
              )}
              {tasker.taskerProfile?.bio && (
                <p className="mt-4 text-sm leading-relaxed" style={{ color: '#6B7280' }}>
                  {tasker.taskerProfile.bio}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services */}
      <Card className="rounded-2xl border-0 shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
        <CardHeader>
          <h2 className="text-lg font-semibold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
            Servicios disponibles
          </h2>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            Selecciona el servicio que necesitas y luego haz clic en &quot;Solicitar Servicio&quot;
          </p>
        </CardHeader>
        <CardContent>
          {services.length === 0 ? (
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Este tasker aún no ha configurado sus servicios.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {services.map((svc) => {
                const selected = selectedService === svc;
                return (
                  <button
                    key={svc}
                    type="button"
                    onClick={() => {
                      setSelectedService(selected ? null : svc);
                      setError(null);
                    }}
                    className="flex items-center gap-3 rounded-xl border p-4 text-left transition-all duration-150"
                    style={{
                      backgroundColor: selected ? '#FFF0EB' : '#FAFAF9',
                      borderColor: selected ? '#FF6B35' : 'rgba(0,0,0,0.08)',
                    }}
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl"
                      style={{ backgroundColor: selected ? '#FFE66D' : '#F3F4F6' }}
                    >
                      {getIcon(svc)}
                    </span>
                    <span
                      className="font-medium"
                      style={{ color: selected ? '#FF6B35' : '#1A1A2E' }}
                    >
                      {getLabel(svc)}
                    </span>
                    {selected && (
                      <span className="ml-auto text-sm font-semibold" style={{ color: '#FF6B35' }}>
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {error && (
        <div
          className="rounded-xl p-3 text-sm"
          style={{ backgroundColor: '#FEF2F2', color: '#EF4444' }}
        >
          {error}
        </div>
      )}

      {/* CTA */}
      <div className="flex gap-3">
        <Button className="flex-1 rounded-xl" size="lg" onClick={handleSolicitar}>
          Solicitar Servicio
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="rounded-xl"
          onClick={() => router.push(`/reserva/nueva?taskerId=${tasker.id}`)}
        >
          Ver detalles
        </Button>
      </div>
    </div>
  );
}
