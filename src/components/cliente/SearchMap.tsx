'use client';

import { useCallback, useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api';
import { getCityCoordinates } from '@/lib/cityCoordinates';

type TaskerMarker = {
  id: string;
  firstName: string;
  lastName: string;
  city: string;
  coverageRadius: number;
  lat: number;
  lng: number;
};

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px',
};

const defaultCenter = { lat: 19.4326, lng: -99.1332 };

type Props = {
  taskers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    city: string;
    taskerProfile: { coverageRadius?: number } | null;
  }>;
  onTaskerClick?: (id: string) => void;
};

export function SearchMap({ taskers, onTaskerClick }: Props) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLocation(null)
    );
  }, []);

  const taskerMarkers: TaskerMarker[] = taskers
    .map((t) => {
      const coords = getCityCoordinates(t.city);
      if (!coords) return null;
      return {
        id: t.id,
        firstName: t.firstName,
        lastName: t.lastName,
        city: t.city,
        coverageRadius: t.taskerProfile?.coverageRadius ?? 10,
        lat: coords.lat,
        lng: coords.lng,
      };
    })
    .filter((t): t is TaskerMarker => t !== null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (!map || (taskerMarkers.length === 0 && !userLocation)) return;
    const bounds = new google.maps.LatLngBounds();
    if (userLocation) bounds.extend(userLocation);
    taskerMarkers.forEach((t) => bounds.extend({ lat: t.lat, lng: t.lng }));
    map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
  }, [map, taskerMarkers, userLocation]);

  if (loadError || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-center text-slate-600">
          {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            ? 'Configura NEXT_PUBLIC_GOOGLE_MAPS_API_KEY para ver el mapa'
            : 'Error al cargar el mapa'}
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-slate-600">Cargando mapa...</p>
      </div>
    );
  }

  const center = userLocation || (taskerMarkers[0] ? { lat: taskerMarkers[0].lat, lng: taskerMarkers[0].lng } : defaultCenter);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        {userLocation && (
          <Marker
            position={userLocation}
            title="Tu ubicación"
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#3B82F6',
              fillOpacity: 1,
              strokeColor: '#fff',
              strokeWeight: 2,
            }}
          />
        )}
        {taskerMarkers.map((t) => (
          <div key={t.id}>
            <Circle
              center={{ lat: t.lat, lng: t.lng }}
              radius={t.coverageRadius * 1000}
              options={{
                fillColor: '#F59E0B',
                fillOpacity: 0.15,
                strokeColor: '#F59E0B',
                strokeOpacity: 0.5,
                strokeWeight: 1,
              }}
            />
            <Marker
              position={{ lat: t.lat, lng: t.lng }}
              title={`${t.firstName} ${t.lastName} - ${t.city}`}
              onClick={() => onTaskerClick?.(t.id)}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#F59E0B',
                fillOpacity: 1,
                strokeColor: '#fff',
                strokeWeight: 2,
              }}
            />
          </div>
        ))}
      </GoogleMap>
      <div className="border-t border-slate-200 bg-white px-4 py-2 text-xs text-slate-500">
        🔵 Tu ubicación · 🟠 Taskers y su área de cobertura
      </div>
    </div>
  );
}
