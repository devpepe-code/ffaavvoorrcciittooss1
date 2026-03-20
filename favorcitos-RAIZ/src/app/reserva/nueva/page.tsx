'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SERVICE_CATEGORIES } from '@/types';

function NuevaReservaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const taskerId = searchParams.get('taskerId');
  const [tasker, setTasker] = useState<{
    id: string;
    firstName: string;
    lastName: string;
    taskerProfile: { hourlyRates: string; services: string } | null;
  } | null>(null);
  const [form, setForm] = useState({
    serviceCategory: '',
    title: '',
    description: '',
    address: '',
    scheduledDate: '',
    scheduledTime: '',
    estimatedHours: 2,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!taskerId) return;
    fetch(`/api/taskers/${taskerId}`)
      .then((r) => r.json())
      .then((d) => setTasker(d))
      .catch(() => setTasker(null));
  }, [taskerId]);

  const rates = tasker?.taskerProfile?.hourlyRates
    ? (() => {
        try {
          return JSON.parse(tasker.taskerProfile!.hourlyRates) as Record<string, number>;
        } catch {
          return {};
        }
      })()
    : {};
  const hourlyRate = form.serviceCategory ? rates[form.serviceCategory] || 0 : 0;
  const estimatedTotal = hourlyRate * form.estimatedHours;
  const platformFee = estimatedTotal * 0.12;
  const trustFee = estimatedTotal * 0.05;
  const total = estimatedTotal + platformFee + trustFee;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!taskerId) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskerId,
          ...form,
          scheduledDate: new Date(`${form.scheduledDate}T${form.scheduledTime}`).toISOString(),
          hourlyRate,
          estimatedTotal,
          platformFee,
          trustSupportFee: trustFee,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al crear reserva');
        setLoading(false);
        return;
      }
      router.push(`/reserva/${data.booking.id}`);
      router.refresh();
    } catch {
      setError('Error al crear reserva');
    }
    setLoading(false);
  }

  if (!taskerId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-slate-600">Selecciona un tasker para reservar.</p>
        <Link href="/buscar" className="mt-4 inline-block">
          <Button>Buscar taskers</Button>
        </Link>
      </div>
    );
  }

  if (!tasker) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p className="text-slate-600">Cargando tasker...</p>
      </div>
    );
  }

  const services = (() => {
    try {
      return JSON.parse(tasker.taskerProfile?.services || '[]') as string[];
    } catch {
      return [];
    }
  })();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Nueva reserva</h1>
      <p className="mt-2 text-slate-600">
        Con {tasker.firstName} {tasker.lastName}
      </p>

      <Card className="mt-8">
        <CardHeader>
          <h2 className="font-semibold">Detalles del servicio</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
            )}
            <div>
              <label className="mb-1 block text-sm font-medium">Tipo de servicio</label>
              <select
                className="h-10 w-full rounded-lg border border-slate-200 px-3"
                value={form.serviceCategory}
                onChange={(e) => setForm((f) => ({ ...f, serviceCategory: e.target.value }))}
                required
              >
                <option value="">Selecciona</option>
                {services.map((svc) => {
                  const cat = SERVICE_CATEGORIES.find((c) => c.value === svc);
                  return (
                    <option key={svc} value={svc}>
                      {cat?.label || svc} - ${rates[svc] || 0}/h
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Título</label>
              <Input
                placeholder="Ej: Reparar fuga en el baño"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Descripción</label>
              <textarea
                className="min-h-[100px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="Describe el trabajo a realizar..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Dirección</label>
              <Input
                placeholder="Dirección donde se realizará el servicio"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Fecha</label>
                <Input
                  type="date"
                  value={form.scheduledDate}
                  onChange={(e) => setForm((f) => ({ ...f, scheduledDate: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Hora</label>
                <Input
                  type="time"
                  value={form.scheduledTime}
                  onChange={(e) => setForm((f) => ({ ...f, scheduledTime: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Horas estimadas</label>
              <Input
                type="number"
                min={1}
                step={0.5}
                value={form.estimatedHours}
                onChange={(e) =>
                  setForm((f) => ({ ...f, estimatedHours: parseFloat(e.target.value) || 1 }))
                }
              />
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Resumen de costos</p>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Servicio ({form.estimatedHours}h × ${hourlyRate})</span>
                  <span>${estimatedTotal} MXN</span>
                </div>
                <div className="flex justify-between">
                  <span>Comisión plataforma (12%)</span>
                  <span>${platformFee.toFixed(2)} MXN</span>
                </div>
                <div className="flex justify-between">
                  <span>Tarifa de confianza (5%)</span>
                  <span>${trustFee.toFixed(2)} MXN</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)} MXN</span>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creando reserva...' : 'Confirmar reserva'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NuevaReservaPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl px-4 py-12 text-center">Cargando...</div>}>
      <NuevaReservaContent />
    </Suspense>
  );
}
