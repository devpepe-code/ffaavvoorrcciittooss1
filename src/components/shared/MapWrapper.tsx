'use client';

import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const MOCK_MODE =
  !process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ||
  process.env.NEXT_PUBLIC_MAP_PROVIDER === 'mock';

export function MapWrapper({
  center,
  markers = [],
  onMarkerClick,
}: {
  center?: { lat: number; lng: number };
  markers?: Array<{ id: string; lat: number; lng: number; label: string }>;
  onMarkerClick?: (id: string) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRefsRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  useEffect(() => {
    if (MOCK_MODE || !mapRef.current || !center) return;

    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
      version: 'weekly',
    });

    (async () => {
      try {
        const { Map } = await loader.importLibrary('maps') as google.maps.MapsLibrary;
        const { AdvancedMarkerElement } = await loader.importLibrary('marker') as google.maps.MarkerLibrary;

        if (!mapRef.current) return;

        mapInstanceRef.current = new Map(mapRef.current, {
          center,
          zoom: 14,
          mapId: 'favorcitos-map',
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
        });

        markerRefsRef.current.forEach((m) => (m.map = null));
        markerRefsRef.current = [];

        const userPin = document.createElement('div');
        userPin.style.cssText = `
          width: 16px; height: 16px;
          background: #3B82F6; border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(59,130,246,0.5);
        `;
        markerRefsRef.current.push(
          new AdvancedMarkerElement({ position: center, map: mapInstanceRef.current, title: 'Tu ubicación', content: userPin })
        );

        markers.forEach((marker) => {
          const pin = document.createElement('div');
          pin.style.cssText = `
            width: 36px; height: 36px;
            background: #F97316; border: 3px solid white;
            border-radius: 50%; display: flex; align-items: center;
            justify-content: center; cursor: pointer; font-size: 16px;
            box-shadow: 0 2px 8px rgba(249,115,22,0.4);
            transition: transform 0.15s;
          `;
          pin.textContent = '🔧';
          pin.addEventListener('mouseenter', () => (pin.style.transform = 'scale(1.2)'));
          pin.addEventListener('mouseleave', () => (pin.style.transform = 'scale(1)'));

          const el = new AdvancedMarkerElement({
            position: { lat: marker.lat, lng: marker.lng },
            map: mapInstanceRef.current!,
            title: marker.label,
            content: pin,
          });
          el.addListener('click', () => onMarkerClick?.(marker.id));
          markerRefsRef.current.push(el);
        });

        if (markers.length > 0) {
          const bounds = new google.maps.LatLngBounds();
          bounds.extend(center);
          markers.forEach((m) => bounds.extend({ lat: m.lat, lng: m.lng }));
          mapInstanceRef.current.fitBounds(bounds, 80);
        }
      } catch (err) {
        console.error('Google Maps failed to load:', err);
      }
    })();
  }, [center?.lat, center?.lng, markers.length]);

  if (MOCK_MODE) {
    return (
      <div
        className="flex min-h-64 items-center justify-center rounded-2xl"
        style={{ backgroundColor: '#F7F3EE', border: '2px dashed #D1D5DB' }}
      >
        <div className="text-center">
          <div className="mb-3 text-4xl">🗺️</div>
          <p className="font-semibold" style={{ color: '#1A1A2E' }}>Mapa — Integración pendiente</p>
          <p className="mt-1 text-sm" style={{ color: '#6B7280' }}>
            Agrega <code className="rounded bg-white px-1">NEXT_PUBLIC_GOOGLE_MAPS_KEY</code> en Vercel
          </p>
          <p className="mt-2 text-sm" style={{ color: '#9CA3AF' }}>
            {markers.length} tasker{markers.length !== 1 ? 's' : ''} en zona
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className="w-full rounded-2xl overflow-hidden"
      style={{ height: '400px', border: '1px solid rgba(0,0,0,0.08)' }}
    />
  );
}
