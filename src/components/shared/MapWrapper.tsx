'use client';

export function MapWrapper({
  center,
  markers = [],
  onMarkerClick,
}: {
  center?: { lat: number; lng: number };
  markers?: Array<{ id: string; lat: number; lng: number; label: string }>;
  onMarkerClick?: (id: string) => void;
}) {
  const mapProvider = process.env.NEXT_PUBLIC_MAP_PROVIDER || 'mock';

  if (mapProvider === 'mock' || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY) {
    return (
      <div
        className="flex min-h-96 items-center justify-center rounded-2xl"
        style={{ backgroundColor: '#F7F3EE', border: '2px dashed #D1D5DB' }}
      >
        <div className="text-center">
          <div className="mb-3 text-4xl">🗺️</div>
          <p className="font-semibold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
            Mapa — Integración pendiente
          </p>
          <p className="mt-1 text-sm" style={{ color: '#6B7280' }}>
            Ver guía en <code style={{ backgroundColor: '#FFFFFF', padding: '2px 6px', borderRadius: '4px' }}>/docs/map-setup.md</code>
          </p>
          <div className="mt-4 text-sm" style={{ color: '#9CA3AF' }}>
            {markers.length} tasker{markers.length !== 1 ? 's' : ''} encontrado{markers.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>
    );
  }

  // Google Maps / Mapbox would be integrated here
  return (
    <div
      className="rounded-2xl"
      style={{ backgroundColor: '#E8F4F8', height: '400px', border: '1px solid #BAE6FD' }}
    >
      <div className="flex h-full items-center justify-center">
        <p style={{ color: '#0369A1' }}>Mapa interactivo (configurar API)</p>
      </div>
    </div>
  );
}
