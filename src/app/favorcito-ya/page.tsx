'use client';

import { useEffect, useState } from 'react';
import { MapPin, Navigation, Search, Send, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MapWrapper } from '@/components/shared/MapWrapper';
import { ChatWindow } from '@/components/shared/ChatWindow';
import { useGeolocation } from '@/hooks/useGeolocation';
import Link from 'next/link';

type TaskerMarker = {
  id: string;
  firstName: string;
  lastName: string;
  lat: number;
  lng: number;
  distance: number;
  rating: number;
};

type AlertStatus = 'idle' | 'sending' | 'waiting' | 'accepted';

const MOCK_TASKERS: TaskerMarker[] = [
  { id: '1', firstName: 'Carlos', lastName: 'Rodríguez', lat: 0, lng: 0, distance: 1.2, rating: 4.8 },
  { id: '2', firstName: 'Ana', lastName: 'Martínez', lat: 0, lng: 0, distance: 2.1, rating: 4.9 },
  { id: '3', firstName: 'Roberto', lastName: 'Sánchez', lat: 0, lng: 0, distance: 3.5, rating: 4.7 },
];

function spawnTaskers(lat: number, lng: number) {
  return MOCK_TASKERS.map((t, i) => ({
    ...t,
    lat: lat + (i % 2 === 0 ? 0.005 : -0.003) * (i + 1),
    lng: lng + (i % 2 === 0 ? 0.004 : -0.005) * (i + 1),
  }));
}

export default function FavorcitYaPage() {
  const geo = useGeolocation();
  const [description, setDescription] = useState('');
  const [radius, setRadius] = useState(5);
  const [alertStatus, setAlertStatus] = useState<AlertStatus>('idle');
  const [acceptingTasker, setAcceptingTasker] = useState<TaskerMarker | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [taskers, setTaskers] = useState<TaskerMarker[]>([]);
  const [dotsCount, setDotsCount] = useState(1);

  // Manual location
  const [locationMode, setLocationMode] = useState<'auto' | 'manual'>('auto');
  const [locationQuery, setLocationQuery] = useState('');
  const [manualCenter, setManualCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [searchingLocation, setSearchingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  useEffect(() => { geo.request(); }, []);

  // Auto-detect: populate taskers when GPS resolves
  useEffect(() => {
    if (geo.status === 'success' && locationMode === 'auto') {
      const lat = (geo as any).lat as number;
      const lng = (geo as any).lng as number;
      setTaskers(spawnTaskers(lat, lng));
    }
  }, [geo.status, locationMode]);

  // Animated dots while waiting
  useEffect(() => {
    if (alertStatus !== 'waiting') return;
    const interval = setInterval(() => setDotsCount((d) => (d % 3) + 1), 500);
    return () => clearInterval(interval);
  }, [alertStatus]);

  async function handleLocationSearch() {
    if (!locationQuery.trim()) return;
    setSearchingLocation(true);
    setLocationError('');
    try {
      const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationQuery)}&region=mx&key=${key}`
      );
      const data = await res.json();
      if (data.status === 'OK' && data.results[0]) {
        const { lat, lng } = data.results[0].geometry.location;
        setManualCenter({ lat, lng });
        setTaskers(spawnTaskers(lat, lng));
      } else {
        setLocationError('No se encontró esa ubicación. Intenta con una ciudad o dirección.');
      }
    } catch {
      setLocationError('Error al buscar. Verifica tu conexión.');
    } finally {
      setSearchingLocation(false);
    }
  }

  function handleSendAlert() {
    if (!description.trim()) return;
    setAlertStatus('sending');
    setTimeout(() => {
      setAlertStatus('waiting');
      setTimeout(() => {
        const responder = MOCK_TASKERS[Math.floor(Math.random() * MOCK_TASKERS.length)];
        setAcceptingTasker(responder);
        setAlertStatus('accepted');
        setShowChat(true);
      }, 3000);
    }, 800);
  }

  const geoCenter = geo.status === 'success'
    ? { lat: (geo as any).lat as number, lng: (geo as any).lng as number }
    : null;
  const center = locationMode === 'manual' ? manualCenter ?? undefined : geoCenter ?? undefined;

  const markers = taskers.map((t) => ({
    id: t.id, lat: t.lat, lng: t.lng, label: `${t.firstName} ${t.lastName}`,
  }));

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: '#FFF7ED' }}>
          <Zap className="h-7 w-7" style={{ color: '#F97316' }} />
        </div>
        <h1 className="text-3xl font-bold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
          Favorcito YA!
        </h1>
        <p className="mt-2" style={{ color: '#6B7280' }}>
          Describe lo que necesitas — el primer tasker disponible acepta y comienzan a chatear
        </p>
      </div>

      {/* Main input card */}
      <div
        className="rounded-2xl p-6"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
      >
        {alertStatus === 'idle' || alertStatus === 'sending' ? (
          <>
            <label className="mb-2 block text-sm font-semibold" style={{ color: '#1A1A2E' }}>
              ¿Qué necesitas?
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Se me rompió una llave en la cerradura, necesito a alguien urgente..."
              rows={3}
              maxLength={200}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              style={{ color: '#1A1A2E' }}
            />
            <div className="mt-1 flex justify-between">
              <span className="text-xs" style={{ color: '#9CA3AF' }}>Sé específico para recibir mejores respuestas</span>
              <span className="text-xs" style={{ color: '#9CA3AF' }}>{description.length}/200</span>
            </div>

            {/* Location section */}
            <div className="mt-4 space-y-3">
              {/* Mode toggle */}
              <div className="flex rounded-xl p-1 gap-1" style={{ backgroundColor: '#F7F3EE' }}>
                <button
                  onClick={() => setLocationMode('auto')}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: locationMode === 'auto' ? '#FFFFFF' : 'transparent',
                    color: locationMode === 'auto' ? '#1A1A2E' : '#6B7280',
                    boxShadow: locationMode === 'auto' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  <Navigation className="h-3 w-3" /> Automática
                </button>
                <button
                  onClick={() => setLocationMode('manual')}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: locationMode === 'manual' ? '#FFFFFF' : 'transparent',
                    color: locationMode === 'manual' ? '#1A1A2E' : '#6B7280',
                    boxShadow: locationMode === 'manual' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  <MapPin className="h-3 w-3" /> Buscar ubicación
                </button>
              </div>

              {locationMode === 'auto' ? (
                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={() => geo.request()}
                    disabled={geo.status === 'loading'}
                    className="flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-colors"
                    style={{
                      borderColor: geo.status === 'success' ? '#2EC4B6' : '#E5E7EB',
                      color: geo.status === 'success' ? '#2EC4B6' : '#6B7280',
                      backgroundColor: geo.status === 'success' ? '#E8FAF9' : '#FFFFFF',
                    }}
                  >
                    {geo.status === 'success'
                      ? <><Navigation className="h-3.5 w-3.5" /> Ubicación detectada</>
                      : <><MapPin className="h-3.5 w-3.5" /> {geo.status === 'loading' ? 'Detectando...' : 'Detectar ubicación'}</>}
                  </button>
                  <div className="flex items-center gap-2 text-xs" style={{ color: '#6B7280' }}>
                    <span>Radio:</span>
                    <input type="range" min="1" max="20" value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="w-20" />
                    <span className="w-8 font-medium" style={{ color: '#1A1A2E' }}>{radius} km</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleLocationSearch(); }}
                      placeholder="Ciudad, colonia o dirección..."
                      className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <button
                      onClick={handleLocationSearch}
                      disabled={searchingLocation || !locationQuery.trim()}
                      className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                      style={{ backgroundColor: '#F97316' }}
                    >
                      <Search className="h-4 w-4" />
                      {searchingLocation ? 'Buscando...' : 'Buscar'}
                    </button>
                  </div>
                  {locationError && <p className="text-xs" style={{ color: '#EF4444' }}>{locationError}</p>}
                  {manualCenter && !locationError && (
                    <p className="text-xs" style={{ color: '#2EC4B6' }}>✓ Ubicación encontrada</p>
                  )}
                </div>
              )}
            </div>

            <Button
              onClick={handleSendAlert}
              disabled={!description.trim() || alertStatus === 'sending' || !center}
              className="mt-5 w-full rounded-xl py-3 text-base font-bold"
              style={{ backgroundColor: '#F97316', color: '#FFFFFF' }}
            >
              {alertStatus === 'sending' ? 'Enviando...' : <><Send className="mr-2 h-4 w-4" /> Enviar alerta a taskers cercanos</>}
            </Button>
          </>
        ) : alertStatus === 'waiting' ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: '#FFF7ED' }}>
              <div className="text-3xl">📡</div>
            </div>
            <h2 className="text-lg font-bold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
              Alertando taskers cercanos{'.'?.repeat(dotsCount)}
            </h2>
            <p className="mt-2 text-sm" style={{ color: '#6B7280' }}>
              Tu solicitud fue enviada. En cuanto alguien acepte, el chat se abrirá automáticamente.
            </p>
            <div className="mt-4 rounded-xl p-3 text-sm" style={{ backgroundColor: '#F7F3EE', color: '#6B7280' }}>
              "{description}"
            </div>
            <button onClick={() => setAlertStatus('idle')} className="mt-4 text-xs underline" style={{ color: '#9CA3AF' }}>
              Cancelar alerta
            </button>
          </div>
        ) : (
          <div className="py-4 text-center">
            <div className="mb-3 text-4xl">🎉</div>
            <h2 className="text-lg font-bold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
              ¡{acceptingTasker?.firstName} aceptó tu favorcito!
            </h2>
            <p className="mt-1 text-sm" style={{ color: '#6B7280' }}>
              El chat ya está abierto. Coordina los detalles directamente.
            </p>
          </div>
        )}
      </div>

      {/* Map */}
      {center && taskers.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-xs font-medium" style={{ color: '#9CA3AF' }}>
            {taskers.length} taskers disponibles en tu zona
          </p>
          <MapWrapper
            center={center}
            markers={markers}
            onMarkerClick={(id) => {
              const t = taskers.find((x) => x.id === id);
              if (t) setAcceptingTasker(t);
            }}
          />
        </div>
      )}

      {geo.status === 'error' && locationMode === 'auto' && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm" style={{ color: '#DC2626' }}>
          {(geo as any).message || 'No se pudo detectar tu ubicación.'} Activa el GPS o usa la búsqueda manual.
        </div>
      )}

      <div className="mt-6 rounded-xl p-4 text-center" style={{ backgroundColor: '#F7F3EE' }}>
        <p className="text-sm" style={{ color: '#6B7280' }}>
          ¿No hay nadie disponible?{' '}
          <Link href="/buscar-servicios" style={{ color: '#F97316', fontWeight: 600 }}>
            Agenda un servicio →
          </Link>
        </p>
      </div>

      {/* Chat Modal */}
      {showChat && acceptingTasker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-4">
          <div className="w-full max-w-md">
            <ChatWindow
              taskerId={acceptingTasker.id}
              taskerName={`${acceptingTasker.firstName} ${acceptingTasker.lastName}`}
              initialMessage={`Hola ${acceptingTasker.firstName}, necesito ayuda: ${description}`}
              onClose={() => { setShowChat(false); setAlertStatus('idle'); setDescription(''); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
