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
  height: '420px',
  borderRadius: '12px',
};

const defaultCenter = { lat: 19.4326, lng: -99.1332 };

type Props = {
  taskers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    city: string;
    taskerProfile: {
      lat?: number | null;
      lng?: number | null;
      serviceRadiusKm?: number | null;
      coverageRadius?: number | null;
    } | null;
  }>;
  onTaskerClick?: (id: string) => void;
  userLocation?: { lat: number; lng: number } | null;
};

export function SearchMap({ taskers, onTaskerClick, userLocation: externalUserLocation }: Props) {
  const [internalUserLocation, setInternalUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const userLocation = externalUserLocation ?? internalUserLocation;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
  });

  useEffect(() => {
    if (externalUserLocation !== undefined) return;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setInternalUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setInternalUserLocation(null)
    );
  }, [externalUserLocation]);

  const taskerMarkers: TaskerMarker[] = taskers
    .map((t) => {
      const lat = t.taskerProfile?.lat;
      const lng = t.taskerProfile?.lng;
      if (lat && lng) {
        return {
          id: t.id,
          firstName: t.firstName,
          lastName: t.lastName,
          city: t.city,
          coverageRadius: t.taskerProfile?.serviceRadiusKm ?? t.taskerProfile?.coverageRadius ?? 5,
          lat,
          lng,
        };
      }
      const coords = getCityCoordinates(t.city);
      if (!coords) return null;
      return {
        id: t.id,
        firstName: t.firstName,
        lastName: t.lastName,
        city: t.city,
        coverageRadius: t.taskerProfile?.serviceRadiusKm ?? t.taskerProfile?.coverageRadius ?? 5,
        lat: coords.lat,
        lng: coords.lng,
      };
    })
    .filter((t): t is TaskerMarker => t !== null);

  const onLoad = useCallback((m: google.maps.Map) => setMap(m), []);
  const onUnmount = useCallback(() => setMap(null), []);

  useEffect(() => {
    if (!map || (taskerMarkers.length === 0 && !userLocation)) return;
    const bounds = new google.maps.LatLngBounds();
    if (userLocation) bounds.extend(userLocation);
    taskerMarkers.forEach((t) => bounds.extend({ lat: t.lat, lng: t.lng }));
    map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
  }, [map, taskerMarkers, userLocation]);

  if (loadError) {
    return (
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
        <p className="text-center text-sm" style={{ color: '#6B7280' }}>Error al cargar el mapa</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="h-[420px] animate-pulse rounded-xl" style={{ backgroundColor: '#F3F4F6' }} />
    );
  }

  const center = userLocation || (taskerMarkers[0] ? { lat: taskerMarkers[0].lat, lng: taskerMarkers[0].lng } : defaultCenter);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={11}
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
              fillColor: '#2EC4B6',
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
                fillColor: '#FF6B35',
                fillOpacity: 0.1,
                strokeColor: '#FF6B35',
                strokeOpacity: 0.4,
                strokeWeight: 1,
              }}
            />
            <Marker
              position={{ lat: t.lat, lng: t.lng }}
              title={`${t.firstName} ${t.lastName} — ${t.city}`}
              onClick={() => onTaskerClick?.(t.id)}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 9,
                fillColor: '#FF6B35',
                fillOpacity: 1,
                strokeColor: '#fff',
                strokeWeight: 2,
              }}
            />
          </div>
        ))}
      </GoogleMap>
      <div
        className="border-t px-4 py-2 text-xs"
        style={{ backgroundColor: '#FFFFFF', color: '#6B7280', borderColor: 'rgba(0,0,0,0.06)' }}
      >
        🟢 Tu ubicación · 🟠 Taskers y su área de cobertura
      </div>
    </div>
  );
}
