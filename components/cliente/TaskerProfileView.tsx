'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, CheckCircle } from 'lucide-react';

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

export function TaskerProfileView({ tasker, categories }: { tasker: Tasker; categories: readonly Cat[] }) {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const services = (() => {
    try {
      return JSON.parse(tasker.taskerProfile?.services || '[]') as string[];
    } catch {
      return [];
    }
  })();
  const rates = (() => {
    try {
      return JSON.parse(tasker.taskerProfile?.hourlyRates || '{}') as Record<string, number>;
    } catch {
      return {};
    }
  })();
  const getLabel = (v: string) => categories.find((c) => c.value === v)?.label || v;

  async function handleReservarAhora() {
    if (!selectedService) {
      setError('Selecciona un servicio de la lista antes de reservar');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const userRes = await fetch('/api/users/me');
      if (!userRes.ok) {
        router.push('/login');
        return;
      }
      const user = await userRes.json();
      const hourlyRate = rates[selectedService] || 0;
      const estimatedHours = 2;
      const estimatedTotal = hourlyRate * estimatedHours;
      const platformFee = estimatedTotal * 0.12;
      const trustFee = estimatedTotal * 0.05;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskerId: tasker.id,
          serviceCategory: selectedService,
          title: `Reserva - ${getLabel(selectedService)}`,
          description: 'Reserva automática',
          address: user.address || user.city || 'Dirección pendiente de confirmar',
          scheduledDate: tomorrow.toISOString(),
          hourlyRate,
          estimatedTotal,
          platformFee,
          trustSupportFee: trustFee,
          estimatedHours,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al crear la reserva');
        setLoading(false);
        return;
      }
      router.push(`/reserva/${data.booking.id}`);
      router.refresh();
    } catch {
      setError('Error al crear la reserva');
    }
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-amber-100 text-3xl font-bold text-amber-600">
              {tasker.firstName[0]}
              {tasker.lastName[0]}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">
                {tasker.firstName} {tasker.lastName}
              </h1>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">
                    {tasker.taskerProfile?.averageRating.toFixed(1) || '-'}
                  </span>
                  <span className="text-slate-600">
                    ({tasker.taskerProfile?.totalReviews || 0} reseñas)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-slate-600">
                  <MapPin className="h-4 w-4" />
                  {tasker.city}
                </div>
              </div>
              {tasker.taskerProfile?.verificationStatus === 'APPROVED' && (
                <Badge className="mt-2 bg-green-100 text-green-800">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Verificado
                </Badge>
              )}
              {tasker.taskerProfile?.bio && (
                <p className="mt-4 text-slate-600">{tasker.taskerProfile.bio}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Servicios y precios</h2>
          <p className="text-sm text-slate-500">
            Haz clic en un servicio para seleccionarlo y luego en &quot;Reservar ahora&quot;
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {services.map((svc) => (
              <div
                key={svc}
                className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 transition hover:border-amber-300 ${
                  selectedService === svc ? 'border-amber-500 bg-amber-50' : ''
                }`}
                onClick={() => {
                  setSelectedService(selectedService === svc ? null : svc);
                  setError(null);
                }}
              >
                <span>{getLabel(svc)}</span>
                <span className="font-semibold text-amber-600">
                  ${rates[svc] || 0} MXN/hora
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <div className="flex gap-4">
        <Button
          className="flex-1"
          size="lg"
          onClick={handleReservarAhora}
          disabled={loading}
        >
          {loading ? 'Creando reserva...' : 'Reservar ahora'}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push(`/reserva/nueva?taskerId=${tasker.id}`)}
        >
          Solicitar cotización
        </Button>
      </div>
    </div>
  );
}
