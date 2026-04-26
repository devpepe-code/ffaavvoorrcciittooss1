# Map API Integration Guide

## Overview

Favorcitos uses maps in two main contexts:
- **Buscar Servicios**: Display tasker locations on a map
- **Favorcito Ya**: Real-time map of available taskers near the user

Currently, the app renders a **mock/placeholder** map. Follow this guide to integrate a real map API.

---

## Step 1 — Choose a Provider

### Recommended: Google Maps JavaScript API
- **Pros**: Best coverage in Mexico, familiar API, excellent documentation
- **Pricing**: Pay-as-you-go (first $200/month free)
- **APIs needed**: Maps JavaScript API, Places API, Geocoding API, Geolocation API

### Alternative: Mapbox GL JS
- **Pros**: More flexible styling, competitive pricing, modern library
- **Pricing**: $5/user/month after free tier
- **APIs needed**: Mapbox GL JS, Geocoding, Directions

---

## Step 2 — Google Maps Setup (Recommended)

### 2.1 Create API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable these APIs:
   - **Maps JavaScript API**
   - **Places API**
   - **Geocoding API** (optional, for Estado→Ciudad lookups)
   - **Geolocation API** (optional, for device geolocation)
4. Create an API key in "Credentials"
5. Restrict the key:
   - **Application restrictions**: HTTP referrers (your domain)
   - **API restrictions**: Select only the APIs above

### 2.2 Add to Environment

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_api_key_here
NEXT_PUBLIC_MAP_PROVIDER=google
```

### 2.3 Install Library

```bash
npm install @googlemaps/js-api-loader
```

### 2.4 Update `MapWrapper` Component

Replace the mock implementation in `/src/components/shared/MapWrapper.tsx`:

```tsx
'use client';

import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

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

  useEffect(() => {
    if (!mapRef.current || !center) return;

    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
      version: 'weekly',
    });

    loader.load().then(async (google) => {
      const { Map } = await google.maps.importLibrary('maps');
      const { AdvancedMarkerElement } = await google.maps.importLibrary('marker');

      mapInstanceRef.current = new Map(mapRef.current!, {
        center,
        zoom: 14,
        mapTypeControl: true,
        fullscreenControl: true,
      });

      // Add user location marker (blue)
      new AdvancedMarkerElement({
        position: center,
        map: mapInstanceRef.current,
        title: 'Tu ubicación',
      });

      // Add tasker markers (orange)
      markers.forEach((marker) => {
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.width = '32px';
        el.style.height = '32px';
        el.style.backgroundColor = '#F97316';
        el.style.borderRadius = '50%';
        el.style.border = '3px solid white';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.fontSize = '14px';
        el.style.fontWeight = 'bold';
        el.style.color = 'white';
        el.style.cursor = 'pointer';
        el.textContent = '📍';

        new AdvancedMarkerElement({
          position: { lat: marker.lat, lng: marker.lng },
          map: mapInstanceRef.current!,
          title: marker.label,
          content: el,
        }).addListener('click', () => {
          onMarkerClick?.(marker.id);
        });
      });

      // Auto-fit bounds
      if (markers.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(center);
        markers.forEach((m) => bounds.extend({ lat: m.lat, lng: m.lng }));
        mapInstanceRef.current.fitBounds(bounds);
      }
    });
  }, [center, markers, onMarkerClick]);

  return <div ref={mapRef} style={{ width: '100%', height: '400px', borderRadius: '1rem' }} />;
}
```

---

## Step 3 — Required API Features per Page

| Page | Feature | APIs Needed |
|------|---------|------------|
| `/buscar-servicios` | Display taskers on map | Maps JS API |
| `/favorcito-ya` | Real-time tasker pins, geolocation | Maps JS API, Geolocation API |
| User profile (registration) | Lat/Lng from Estado+Ciudad | Geocoding API (optional) |

---

## Step 4 — Tasker Location Data

Ensure each tasker record has:
- `lat` (float): Latitude
- `lng` (float): Longitude
- `serviceRadiusKm` (number): Search radius in kilometers
- `favorcito_ya_enabled` (boolean): Available for instant requests

Example Prisma schema update:

```prisma
model TaskerProfile {
  // ... existing fields
  lat              Float?
  lng              Float?
  serviceRadiusKm  Int?          @default(15)
  favorcito_ya_enabled Boolean?  @default(false)
}
```

Populate lat/lng during registration:
1. Get Estado + Ciudad from user input
2. Call Google Geocoding API to get coordinates
3. Store in database

---

## Step 5 — Real-time Tasker Availability (Advanced)

For **Favorcito Ya** to show live tasker availability:

### Option A: Supabase Realtime (Recommended)

```tsx
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Subscribe to taskers with favorcito_ya_enabled = true
supabase
  .from('tasker_profiles')
  .on('*', (payload) => {
    console.log('Tasker availability changed:', payload);
    // Update UI with new tasker list
  })
  .subscribe();
```

### Option B: WebSocket

Implement a WebSocket server that broadcasts tasker location updates every 5-10 seconds to connected clients.

### Option C: Polling (Simple)

Fetch `/api/taskers/favorcito-ya` every 5-10 seconds:

```tsx
setInterval(() => {
  fetch('/api/taskers/favorcito-ya?lat=19.43&lng=-99.13&radius=5')
    .then(r => r.json())
    .then(data => setTaskers(data));
}, 5000);
```

---

## Troubleshooting

**Map is blank or shows placeholder:**
- Check that `NEXT_PUBLIC_GOOGLE_MAPS_KEY` is set and valid
- Ensure key restrictions allow your domain
- Check browser console for JS errors

**Markers don't appear:**
- Verify lat/lng are valid coordinates
- Check that `google.maps.importLibrary` is called for 'marker'

**Rate limit errors:**
- You're hitting Google API quota limits
- Increase quota in Cloud Console → APIs & Services → Quotas
- Or implement response caching

---

## Cost Estimates (Google Maps)

Based on typical usage:
- **Maps rendering**: $7 per 1000 loads
- **Marker clustering**: $4 per 1000 loads
- **Geocoding**: $5 per 1000 requests
- **Total estimated monthly**: $50-200 at scale

**Free tier covers**: $200/month — sufficient for initial launch.

---

## Next Steps

1. Set up Google Cloud project and API key
2. Update `MapWrapper.tsx` with real Google Maps code (see Step 2.4)
3. Add environment variable to `.env.local`
4. Test on `/buscar-servicios` and `/favorcito-ya` pages
5. Monitor API usage in Cloud Console

For questions, refer to [Google Maps Documentation](https://developers.google.com/maps).
