'use client';

import { useState, useCallback } from 'react';

type GeoState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; lat: number; lng: number }
  | { status: 'error'; message: string };

export function useGeolocation() {
  const [state, setState] = useState<GeoState>({ status: 'idle' });

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setState({ status: 'error', message: 'Tu navegador no soporta geolocalización' });
      return;
    }
    setState({ status: 'loading' });
    navigator.geolocation.getCurrentPosition(
      (pos) => setState({ status: 'success', lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => {
        const messages: Record<number, string> = {
          1: 'Permiso de ubicación denegado',
          2: 'No se pudo obtener tu ubicación',
          3: 'Tiempo de espera agotado',
        };
        setState({ status: 'error', message: messages[err.code] || 'Error al obtener ubicación' });
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  return { ...state, request };
}
