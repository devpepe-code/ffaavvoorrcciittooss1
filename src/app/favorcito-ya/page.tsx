'use client';

import { useEffect, useState } from 'react';
import { MapPin, Navigation, Send, Zap } from 'lucide-react';
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

export default function FavorcitYaPage() {
  const geo = useGeolocation();
  const [description, setDescription] = useState('');
  const [radius, setRadius] = useState(5);
  const [alertStatus, setAlertStatus] = useState<AlertStatus>('idle');
  const [acceptingTasker, setAcceptingTasker] = useState<TaskerMarker | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [taskers, setTaskers] = useState<TaskerMarker[]>([]);
  const [dotsCount, setDotsCount] = useState(1);

  useEffect(() => {
    geo.request();
  }, []);

  // Populate mock taskers with coordinates once geo is available
  useEffect(() => {
    if (geo.status === 'success') {
      const lat = (geo as any).lat as number;
      const lng = (geo as any).lng as number;
      setTaskers(MOCK_TASKERS.map((t, i) => ({
        ...t,
        lat: lat + (i % 2 === 0 ? 0.005 : -0.003) * (i + 1),
        lng: lng + (i % 2 === 0 ? 0.004 : -0.005) * (i + 1),
      })));
    }
  }, [geo.status]);

  // Animated dots while waiting
  useEffect(() => {
    if (alertStatus !== 'waiting') return;
    const interval = setInterval(() => setDotsCount((d) => (d % 3) + 1), 500);
    return () => clearInterval(interval);
  }, [alertStatus]);

  function handleSendAlert() {
    if (!description.trim()) return;
    setAlertStatus('sending');

    // Simulate sending alert
    setTimeout(() => {
      setAlertStatus('waiting');
      // TODO: Replace with real broadcast to nearby taskers via WebSocket/Supabase

      // Simulate first tasker accepting after ~3 seconds
      setTimeout(() => {
        const responder = MOCK_TASKERS[Math.floor(Math.random() * MOCK_TASKERS.length)];
        setAcceptingTasker(responder);
        setAlertStatus('accepted');
        setShowChat(true);
        // TODO: Replace with real-time listener for tasker acceptance event
      }, 3000);
    }, 800);
  }

  const markers = taskers.map((t) => ({
    id: t.id,
    lat: t.lat,
    lng: t.lng,
    label: `${t.firstName} ${t.lastName}`,
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
              <span className="text-xs" style={{ color: '#9CA3AF' }}>
                Sé específico para recibir mejores respuestas
              </span>
              <span className="text-xs" style={{ color: '#9CA3AF' }}>
                {description.length}/200
              </span>
            </div>

            {/* Location row */}
            <div className="mt-4 flex items-center justify-between gap-3">
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
                {geo.status === 'success' ? (
                  <><Navigation className="h-3.5 w-3.5" /> Ubicación detectada</>
                ) : (
                  <><MapPin className="h-3.5 w-3.5" /> {geo.status === 'loading' ? 'Detectando...' : 'Detectar ubicación'}</>
                )}
              </button>

              <div className="flex items-center gap-2 text-xs" style={{ color: '#6B7280' }}>
                <span>Radio:</span>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-20"
                />
                <span className="w-8 font-medium" style={{ color: '#1A1A2E' }}>{radius} km</span>
              </div>
            </div>

            <Button
              onClick={handleSendAlert}
              disabled={!description.trim() || alertStatus === 'sending'}
              className="mt-5 w-full rounded-xl py-3 text-base font-bold"
              style={{ backgroundColor: '#F97316', color: '#FFFFFF' }}
            >
              {alertStatus === 'sending' ? (
                'Enviando...'
              ) : (
                <><Send className="mr-2 h-4 w-4" /> Enviar alerta a taskers cercanos</>
              )}
            </Button>
          </>
        ) : alertStatus === 'waiting' ? (
          /* Waiting state */
          <div className="py-6 text-center">
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: '#FFF7ED' }}
            >
              <div className="text-3xl">📡</div>
            </div>
            <h2 className="text-lg font-bold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
              Alertando taskers cercanos{'.'?.repeat(dotsCount)}
            </h2>
            <p className="mt-2 text-sm" style={{ color: '#6B7280' }}>
              Tu solicitud fue enviada. En cuanto alguien acepte, el chat se abrirá automáticamente.
            </p>
            <div
              className="mt-4 rounded-xl p-3 text-sm"
              style={{ backgroundColor: '#F7F3EE', color: '#6B7280' }}
            >
              "{description}"
            </div>
            <button
              onClick={() => setAlertStatus('idle')}
              className="mt-4 text-xs underline"
              style={{ color: '#9CA3AF' }}
            >
              Cancelar alerta
            </button>
          </div>
        ) : (
          /* Accepted state */
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
      {geo.status === 'success' && taskers.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-xs font-medium" style={{ color: '#9CA3AF' }}>
            {taskers.length} taskers disponibles en tu zona
          </p>
          <MapWrapper
            center={{ lat: (geo as any).lat, lng: (geo as any).lng }}
            markers={markers}
            onMarkerClick={(id) => {
              const t = taskers.find((x) => x.id === id);
              if (t) setAcceptingTasker(t);
            }}
          />
        </div>
      )}

      {geo.status === 'error' && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm" style={{ color: '#DC2626' }}>
          {(geo as any).message || 'No se pudo detectar tu ubicación.'} Activa el GPS e intenta de nuevo.
        </div>
      )}

      {/* No taskers fallback */}
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
