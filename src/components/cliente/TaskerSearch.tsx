'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SERVICE_CATEGORIES } from '@/types';
import { Search, Star, MapPin, AlertCircle } from 'lucide-react';

type Tasker = {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  taskerProfile: {
    bio: string | null;
    services: string;
    averageRating: number;
    totalReviews: number;
    completedJobs: number;
    verificationStatus: string;
  } | null;
};

export function TaskerSearch() {
  const searchParams = useSearchParams();
  const categoriaParam = searchParams.get('categoria') || '';
  const [categoria, setCategoria] = useState(categoriaParam);
  const [ciudad, setCiudad] = useState('');
  const [taskers, setTaskers] = useState<Tasker[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    setCategoria(categoriaParam);
  }, [categoriaParam]);

  useEffect(() => {
    async function fetchTaskers() {
      setLoading(true);
      setFetchError(false);
      try {
        const params = new URLSearchParams();
        if (categoria) params.set('categoria', categoria);
        if (ciudad) params.set('ciudad', ciudad);
        const res = await fetch(`/api/taskers/search?${params}`);
        const data = await res.json();
        setTaskers(data.taskers || []);
      } catch {
        setFetchError(true);
        setTaskers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchTaskers();
  }, [categoria, ciudad]);

  const getServiceLabel = (val: string) =>
    SERVICE_CATEGORIES.find((c) => c.value === val)?.label || val;

  const getServices = (raw: string): string[] => {
    try {
      const s = JSON.parse(raw);
      return Array.isArray(s) ? s : [];
    } catch {
      return [];
    }
  };

  return (
    <div className="mt-8">
      {/* Filters */}
      <div
        className="mb-6 rounded-2xl p-4"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>
              Categoría
            </label>
            <select
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              aria-label="Filtrar por categoría"
            >
              <option value="">Todas las categorías</option>
              {SERVICE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>
              Ciudad
            </label>
            <Input
              placeholder="Ej: Ciudad de México"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              aria-label="Filtrar por ciudad"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse rounded-2xl">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="h-16 w-16 rounded-full" style={{ backgroundColor: '#F3F4F6' }} />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded" style={{ backgroundColor: '#F3F4F6' }} />
                    <div className="h-3 w-1/2 rounded" style={{ backgroundColor: '#F3F4F6' }} />
                    <div className="h-3 w-1/3 rounded" style={{ backgroundColor: '#F3F4F6' }} />
                  </div>
                </div>
                <div className="mt-4 h-3 rounded" style={{ backgroundColor: '#F3F4F6' }} />
                <div className="mt-2 h-3 w-2/3 rounded" style={{ backgroundColor: '#F3F4F6' }} />
                <div className="mt-4 h-9 rounded-xl" style={{ backgroundColor: '#F3F4F6' }} />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : fetchError ? (
        <div
          className="flex flex-col items-center rounded-2xl border border-dashed p-12 text-center"
          style={{ borderColor: '#EF4444' }}
        >
          <AlertCircle className="h-12 w-12" style={{ color: '#EF4444' }} />
          <p className="mt-4 font-medium" style={{ color: '#1A1A2E' }}>
            Error al cargar los taskers
          </p>
          <p className="mt-2 text-sm" style={{ color: '#6B7280' }}>
            Verifica tu conexión e intenta de nuevo.
          </p>
        </div>
      ) : taskers.length === 0 ? (
        <div
          className="flex flex-col items-center rounded-2xl border border-dashed p-12 text-center"
          style={{ borderColor: '#D1D5DB' }}
        >
          <Search className="h-12 w-12" style={{ color: '#9CA3AF' }} />
          <p className="mt-4 font-medium" style={{ color: '#1A1A2E' }}>
            No se encontraron taskers
          </p>
          <p className="mt-2 text-sm" style={{ color: '#6B7280' }}>
            Prueba ampliando la búsqueda o cambiando los filtros.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm" style={{ color: '#6B7280' }}>
            {taskers.length} tasker{taskers.length !== 1 ? 's' : ''} encontrado{taskers.length !== 1 ? 's' : ''}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {taskers.map((t) => (
              <Card
                key={t.id}
                className="overflow-hidden rounded-2xl border-0 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                style={{ backgroundColor: '#FFFFFF' }}
              >
                <CardContent className="p-0">
                  <div className="flex gap-4 p-5">
                    <div
                      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white"
                      style={{ backgroundColor: '#FF6B35' }}
                    >
                      {t.firstName[0]}
                      {t.lastName[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold" style={{ color: '#1A1A2E' }}>
                        {t.firstName} {t.lastName}
                      </h3>
                      <div className="mt-1 flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
                        <Star className="h-4 w-4 fill-[#FF6B35] text-[#FF6B35]" />
                        <span className="font-medium">
                          {t.taskerProfile?.averageRating.toFixed(1) || '-'}
                        </span>
                        <span>({t.taskerProfile?.totalReviews || 0} reseñas)</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-sm" style={{ color: '#6B7280' }}>
                        <MapPin className="h-4 w-4" />
                        {t.city}
                      </div>
                      {t.taskerProfile?.verificationStatus === 'APPROVED' && (
                        <Badge
                          className="mt-2 rounded-full px-2 py-0.5 text-xs"
                          style={{ backgroundColor: '#F0FFF4', color: '#22C55E', border: 'none' }}
                        >
                          ✓ Verificado
                        </Badge>
                      )}
                    </div>
                  </div>

                  {t.taskerProfile?.bio && (
                    <p
                      className="line-clamp-2 border-t px-5 py-3 text-sm"
                      style={{ color: '#6B7280', borderColor: 'rgba(0,0,0,0.06)' }}
                    >
                      {t.taskerProfile.bio}
                    </p>
                  )}

                  <div
                    className="border-t px-5 py-3"
                    style={{ borderColor: 'rgba(0,0,0,0.06)' }}
                  >
                    <p className="mb-2 text-xs font-medium" style={{ color: '#9CA3AF' }}>
                      Servicios
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {getServices(t.taskerProfile?.services || '[]')
                        .slice(0, 3)
                        .map((svc) => (
                          <span
                            key={svc}
                            className="rounded-full px-2 py-0.5 text-xs font-medium"
                            style={{ backgroundColor: '#FFF0EB', color: '#FF6B35' }}
                          >
                            {getServiceLabel(svc)}
                          </span>
                        ))}
                      {getServices(t.taskerProfile?.services || '[]').length > 3 && (
                        <span className="text-xs" style={{ color: '#9CA3AF' }}>
                          +{getServices(t.taskerProfile?.services || '[]').length - 3} más
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="border-t p-4" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                    <Link href={`/tasker/${t.id}`}>
                      <Button className="w-full rounded-xl">Ver perfil y contactar</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
