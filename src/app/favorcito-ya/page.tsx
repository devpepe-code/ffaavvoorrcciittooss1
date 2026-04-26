'use client';

import { useEffect, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MapWrapper } from '@/components/shared/MapWrapper';
import { ChatWindow } from '@/components/shared/ChatWindow';
import { useGeolocation } from '@/hooks/useGeolocation';
import { SERVICE_CATEGORIES } from '@/types';
import Link from 'next/link';

type TaskerMarker = {
  id: string;
  firstName: string;
  lastName: string;
  lat: number;
  lng: number;
  distance: number;
  rating: number;
  category: string;
};

export default function FavorcitYaPage() {
  const geo = useGeolocation();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [radius, setRadius] = useState(5);
  const [taskers, setTaskers] = useState<TaskerMarker[]>([]);
  const [selectedTasker, setSelectedTasker] = useState<TaskerMarker | null>(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    geo.request();
  }, []);

  // Mock tasker data
  useEffect(() => {
    if (geo.status === 'success') {
      const mockTaskers: TaskerMarker[] = [
        {
          id: '1',
          firstName: 'Carlos',
          lastName: 'Rodríguez',
          lat: geo.lat + 0.005,
          lng: geo.lng + 0.005,
          distance: 1.2,
          rating: 4.8,
          category: 'PLOMERIA',
        },
        {
          id: '2',
          firstName: 'Ana',
          lastName: 'Martínez',
          lat: geo.lat - 0.003,
          lng: geo.lng - 0.004,
          distance: 2.1,
          rating: 4.9,
          category: 'LIMPIEZA_HOGAR',
        },
        {
          id: '3',
          firstName: 'Roberto',
          lastName: 'Sánchez',
          lat: geo.lat + 0.004,
          lng: geo.lng - 0.006,
          distance: 3.5,
          rating: 4.7,
          category: 'PINTURA',
        },
      ];
      const filtered = selectedCategory
        ? mockTaskers.filter((t) => t.category === selectedCategory)
        : mockTaskers;
      setTaskers(filtered);
    }
  }, [geo.status, geo.lat, geo.lng, selectedCategory]);

  const markers = taskers.map((t) => ({
    id: t.id,
    lat: t.lat,
    lng: t.lng,
    label: `${t.firstName} ${t.lastName}`,
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
        Favorcito YA!
      </h1>
      <p className="mt-2" style={{ color: '#6B7280' }}>
        Taskers disponibles ahora mismo cerca de ti
      </p>

      {/* Filters */}
      <div className="mt-6 rounded-2xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium" style={{ color: '#1A1A2E' }}>
              Categoría
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2"
              style={{ focusRingColor: '#F97316' }}
            >
              <option value="">Todas</option>
              {SERVICE_CATEGORIES.filter((c) => c.value !== 'OTRO').map((c) => (
                <option key={c.value} value={c.value}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium" style={{ color: '#1A1A2E' }}>
              Radio de búsqueda: {radius} km
            </label>
            <input
              type="range"
              min="1"
              max="25"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="flex items-end">
            {geo.status === 'success' ? (
              <Button
                onClick={() => geo.request()}
                className="w-full rounded-xl"
                style={{ backgroundColor: '#2EC4B6', color: '#FFFFFF' }}
              >
                <Navigation className="mr-2 h-4 w-4" />
                Ubicación detectada
              </Button>
            ) : (
              <Button
                onClick={() => geo.request()}
                disabled={geo.status === 'loading'}
                variant="outline"
                className="w-full rounded-xl"
              >
                <MapPin className="mr-2 h-4 w-4" />
                {geo.status === 'loading' ? 'Buscando...' : 'Detectar ubicación'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Map */}
      {geo.status === 'success' ? (
        <div className="mt-8">
          <MapWrapper
            center={{ lat: geo.lat, lng: geo.lng }}
            markers={markers}
            onMarkerClick={(id) => {
              const t = taskers.find((x) => x.id === id);
              if (t) setSelectedTasker(t);
            }}
          />
        </div>
      ) : geo.status === 'error' ? (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p style={{ color: '#DC2626' }}>
            {geo.message || 'No pudimos detectar tu ubicación. Por favor, ingresa tu ciudad manualmente.'}
          </p>
          <input
            type="text"
            placeholder="Ej: Benito Juárez, CDMX"
            className="mt-4 rounded-xl border px-4 py-2 text-sm focus:outline-none"
          />
        </div>
      ) : (
        <div className="mt-8 animate-pulse rounded-2xl" style={{ backgroundColor: '#F3F4F6', height: '400px' }} />
      )}

      {/* Results */}
      {taskers.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-300 p-12 text-center">
          <p className="font-medium" style={{ color: '#1A1A2E' }}>
            No hay taskers disponibles en este momento cerca de ti
          </p>
          <p className="mt-2 text-sm" style={{ color: '#6B7280' }}>
            Intenta ampliar el radio o busca un servicio programado.
          </p>
          <Link href="/buscar-servicios" className="mt-4 inline-block">
            <Button style={{ backgroundColor: '#F97316', color: '#FFFFFF' }} className="rounded-xl">
              Buscar servicio programado
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {taskers.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl p-4"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)' }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold" style={{ color: '#1A1A2E' }}>
                    {t.firstName} {t.lastName}
                  </h3>
                  <p className="text-xs" style={{ color: '#6B7280' }}>
                    ⭐ {t.rating} · {t.distance} km
                  </p>
                  <p className="mt-1 text-xs" style={{ color: '#9CA3AF' }}>
                    {SERVICE_CATEGORIES.find((c) => c.value === t.category)?.label}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {
                  setSelectedTasker(t);
                  setShowChat(true);
                }}
                className="mt-4 w-full rounded-xl"
                style={{ backgroundColor: '#F97316', color: '#FFFFFF' }}
              >
                Iniciar chat
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Chat Modal */}
      {showChat && selectedTasker && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 backdrop-blur-sm sm:items-center">
          <div className="w-full sm:max-w-md">
            <ChatWindow
              taskerId={selectedTasker.id}
              taskerName={`${selectedTasker.firstName} ${selectedTasker.lastName}`}
              onClose={() => setShowChat(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
