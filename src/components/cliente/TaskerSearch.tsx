'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SERVICE_CATEGORIES } from '@/types';
import { Search, Star, MapPin } from 'lucide-react';

export function TaskerSearch() {
  const searchParams = useSearchParams();
  const categoriaParam = searchParams.get('categoria') || '';
  const [categoria, setCategoria] = useState(categoriaParam);
  const [ciudad, setCiudad] = useState('');
  const [taskers, setTaskers] = useState<Array<{
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
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCategoria(categoriaParam);
  }, [categoriaParam]);

  useEffect(() => {
    async function fetchTaskers() {
      setLoading(true);
      const params = new URLSearchParams();
      if (categoria) params.set('categoria', categoria);
      if (ciudad) params.set('ciudad', ciudad);
      const res = await fetch(`/api/taskers/search?${params}`);
      const data = await res.json();
      setTaskers(data.taskers || []);
      setLoading(false);
    }
    fetchTaskers();
  }, [categoria, ciudad]);

  const getServiceLabel = (val: string) => SERVICE_CATEGORIES.find((c) => c.value === val)?.label || val;
  const parseRates = (rates: string) => {
    try {
      const r = JSON.parse(rates);
      return Object.entries(r) as [string, number][];
    } catch {
      return [];
    }
  };

  return (
    <div className="mt-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Categoría</label>
          <select
            className="h-10 w-full rounded-lg border border-slate-200 px-3"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Todas</option>
            {SERVICE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.icon} {c.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Ciudad</label>
          <Input
            placeholder="Ej: Ciudad de México"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-24 rounded bg-slate-200" />
                <div className="mt-4 h-4 w-3/4 rounded bg-slate-200" />
                <div className="mt-2 h-4 w-1/2 rounded bg-slate-200" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : taskers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <Search className="mx-auto h-12 w-12 text-slate-400" />
          <p className="mt-4 text-slate-600">No se encontraron taskers con esos filtros.</p>
          <p className="mt-2 text-sm text-slate-500">Prueba ampliando la búsqueda.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {taskers.map((t) => (
            <Card key={t.id} className="overflow-hidden transition hover:shadow-md">
              <CardContent className="p-0">
                <div className="flex gap-4 p-6">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-amber-100 text-2xl font-bold text-amber-600">
                    {t.firstName[0]}
                    {t.lastName[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold">
                      {t.firstName} {t.lastName}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{t.taskerProfile?.averageRating.toFixed(1) || '-'}</span>
                      <span>({t.taskerProfile?.totalReviews || 0} reseñas)</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                      <MapPin className="h-4 w-4" />
                      {t.city}
                    </div>
                    {t.taskerProfile?.verificationStatus === 'APPROVED' && (
                      <Badge className="mt-2 bg-green-100 text-green-800">Verificado</Badge>
                    )}
                  </div>
                </div>
                {t.taskerProfile?.bio && (
                  <p className="border-t border-slate-100 px-6 py-3 text-sm text-slate-600 line-clamp-2">
                    {t.taskerProfile.bio}
                  </p>
                )}
                <div className="border-t border-slate-100 px-6 py-3">
                  <p className="mb-2 text-xs font-medium text-slate-500">Tarifas por hora</p>
                  <div className="flex flex-wrap gap-2">
                    {parseRates(t.taskerProfile?.hourlyRates || '{}').map(([svc, rate]) => (
                      <span key={svc} className="text-sm">
                        {getServiceLabel(svc)}: <strong>${rate} MXN</strong>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-slate-100 p-4">
                  <Link href={`/tasker/${t.id}`}>
                    <Button className="w-full">Ver perfil y reservar</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
