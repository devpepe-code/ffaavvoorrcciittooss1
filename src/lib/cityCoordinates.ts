// Coordenadas de ciudades para mostrar taskers en el mapa
export const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Ciudad de México': { lat: 19.4326, lng: -99.1332 },
  'Ciudad de Mexico': { lat: 19.4326, lng: -99.1332 },
  Guadalajara: { lat: 20.6597, lng: -103.3496 },
  Monterrey: { lat: 25.6866, lng: -100.3161 },
  Puebla: { lat: 19.0414, lng: -98.2063 },
  Cancún: { lat: 21.1619, lng: -86.8515 },
  Tijuana: { lat: 32.5149, lng: -117.0382 },
  Mérida: { lat: 20.9674, lng: -89.5926 },
  'Buenos Aires': { lat: -34.6037, lng: -58.3816 },
  Córdoba: { lat: -31.4201, lng: -64.1888 },
  Rosario: { lat: -32.9468, lng: -60.6393 },
  Mendoza: { lat: -32.8895, lng: -68.8458 },
  'San Salvador': { lat: 13.6929, lng: -89.2182 },
  'Santa Ana': { lat: 13.9946, lng: -89.5597 },
  'San Miguel': { lat: 13.4833, lng: -88.1833 },
  Bogotá: { lat: 4.711, lng: -74.0721 },
  Bogota: { lat: 4.711, lng: -74.0721 },
  Medellín: { lat: 6.2476, lng: -75.5658 },
  Medellin: { lat: 6.2476, lng: -75.5658 },
  Cali: { lat: 3.4516, lng: -76.532 },
  Barranquilla: { lat: 10.9639, lng: -74.7964 },
  Cartagena: { lat: 10.3997, lng: -75.5144 },
};

export function getCityCoordinates(city: string): { lat: number; lng: number } | null {
  const normalized = city.trim();
  const withoutAccents = normalized
    .replace(/á/g, 'a')
    .replace(/é/g, 'e')
    .replace(/í/g, 'i')
    .replace(/ó/g, 'o')
    .replace(/ú/g, 'u');
  return (
    CITY_COORDINATES[normalized] ??
    CITY_COORDINATES[withoutAccents] ??
    Object.entries(CITY_COORDINATES).find(
      ([key]) => key.toLowerCase() === normalized.toLowerCase()
    )?.[1] ??
    null
  );
}
