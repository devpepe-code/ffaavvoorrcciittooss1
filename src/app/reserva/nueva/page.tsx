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
  const servicioParam = searchParams.get('servicio') || '';

  const [tasker, setTasker] = useState<{
    id: string;
    firstName: string;
    lastName: string;
    taskerProfile: { services: string } | null;
  } | null>(null);

  const [form, setForm] = useState({
    serviceCategory: servicioParam,
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
          hourlyRate: 0,
          estimatedTotal: 0,
          platformFee: 0,
          trustSupportFee: 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al crear la solicitud');
        setLoading(false);
        return;
      }
      router.push(`/reserva/${data.booking.id}`);
      router.refresh();
    } catch {
      setError('Error al crear la solicitud');
    }
    setLoading(false);
  }

  if (!taskerId) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p style={{ color: '#6B7280' }}>Selecciona un tasker para solicitar el servicio.</p>
        <Link href="/buscar" className="mt-4 inline-block">
          <Button>Buscar taskers</Button>
        </Link>
      </div>
    );
  }

  if (!tasker) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <p style={{ color: '#6B7280' }}>Cargando tasker...</p>
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
      <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
        Solicitar Servicio
      </h1>
      <p className="mt-2" style={{ color: '#6B7280' }}>
        Con {tasker.firstName} {tasker.lastName}
      </p>

      <Card className="mt-6 rounded-2xl border-0 shadow-sm" style={{ backgroundColor: '#FFFFFF' }}>
        <CardHeader>
          <h2 className="font-semibold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
            Detalles de la solicitud
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-xl p-3 text-sm" style={{ backgroundColor: '#FEF2F2', color: '#EF4444' }}>
                {error}
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>
                Tipo de servicio
              </label>
              <select
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                value={form.serviceCategory}
                onChange={(e) => setForm((f) => ({ ...f, serviceCategory: e.target.value }))}
                required
                aria-label="Tipo de servicio"
              >
                <option value="">Selecciona un servicio</option>
                {services.map((svc) => {
                  const cat = SERVICE_CATEGORIES.find((c) => c.value === svc);
                  return (
                    <option key={svc} value={svc}>
                      {cat?.icon} {cat?.label || svc}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>
                Título breve
              </label>
              <Input
                placeholder="Ej: Reparar fuga en el baño"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
                aria-label="Título"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>
                Descripción del trabajo
              </label>
              <textarea
                className="min-h-[100px] w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                placeholder="Describe con detalle lo que necesitas..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
                aria-label="Descripción"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>
                Dirección
              </label>
              <Input
                placeholder="Dirección donde se realizará el servicio"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                required
                aria-label="Dirección"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>
                  Fecha preferida
                </label>
                <Input
                  type="date"
                  value={form.scheduledDate}
                  onChange={(e) => setForm((f) => ({ ...f, scheduledDate: e.target.value }))}
                  required
                  aria-label="Fecha"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>
                  Hora
                </label>
                <Input
                  type="time"
                  value={form.scheduledTime}
                  onChange={(e) => setForm((f) => ({ ...f, scheduledTime: e.target.value }))}
                  required
                  aria-label="Hora"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>
                Duración estimada (horas)
              </label>
              <Input
                type="number"
                min={1}
                step={0.5}
                value={form.estimatedHours}
                onChange={(e) =>
                  setForm((f) => ({ ...f, estimatedHours: parseFloat(e.target.value) || 1 }))
                }
                aria-label="Horas estimadas"
              />
            </div>

            <div
              className="rounded-xl p-4 text-sm"
              style={{ backgroundColor: '#E8FAF9', color: '#1A1A2E' }}
            >
              <p className="font-medium" style={{ color: '#2EC4B6' }}>
                💬 Sin costos ni comisiones
              </p>
              <p className="mt-1" style={{ color: '#6B7280' }}>
                El precio lo acuerdas directamente con el tasker. Favorcitos es 100% gratuito.
              </p>
            </div>

            <Button type="submit" className="w-full rounded-xl" size="lg" disabled={loading}>
              {loading ? 'Enviando solicitud...' : 'Enviar solicitud'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NuevaReservaPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 py-12 text-center" style={{ color: '#6B7280' }}>
          Cargando...
        </div>
      }
    >
      <NuevaReservaContent />
    </Suspense>
  );
}
