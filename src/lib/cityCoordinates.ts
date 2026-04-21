export const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Ciudad de México y alcaldías
  'Ciudad de México': { lat: 19.4326, lng: -99.1332 },
  'Ciudad de Mexico': { lat: 19.4326, lng: -99.1332 },
  CDMX: { lat: 19.4326, lng: -99.1332 },
  'Benito Juárez': { lat: 19.3984, lng: -99.1577 },
  Coyoacán: { lat: 19.3466, lng: -99.1617 },
  Cuauhtémoc: { lat: 19.4392, lng: -99.1442 },
  Iztapalapa: { lat: 19.3571, lng: -99.0639 },
  'Miguel Hidalgo': { lat: 19.4326, lng: -99.1956 },
  Tlalpan: { lat: 19.2977, lng: -99.1593 },

  // Estado de México
  Ecatepec: { lat: 19.6011, lng: -99.0314 },
  Nezahualcóyotl: { lat: 19.4019, lng: -99.015 },
  Toluca: { lat: 19.2826, lng: -99.6557 },
  Naucalpan: { lat: 19.4789, lng: -99.2378 },
  Tlalnepantla: { lat: 19.5448, lng: -99.1888 },

  // Jalisco
  Guadalajara: { lat: 20.6597, lng: -103.3496 },
  Zapopan: { lat: 20.7214, lng: -103.3907 },
  Tlaquepaque: { lat: 20.6413, lng: -103.3107 },

  // Nuevo León
  Monterrey: { lat: 25.6866, lng: -100.3161 },
  Guadalupe: { lat: 25.6765, lng: -100.2594 },
  'San Nicolás de los Garza': { lat: 25.7451, lng: -100.3005 },
  Apodaca: { lat: 25.7811, lng: -100.1881 },
  'San Pedro Garza García': { lat: 25.6565, lng: -100.4015 },

  // Puebla
  Puebla: { lat: 19.0414, lng: -98.2063 },
  Tehuacán: { lat: 18.4614, lng: -97.3925 },

  // Quintana Roo
  Cancún: { lat: 21.1619, lng: -86.8515 },
  'Playa del Carmen': { lat: 20.6296, lng: -87.0739 },
  Tulum: { lat: 20.2114, lng: -87.4654 },

  // Baja California
  Tijuana: { lat: 32.5149, lng: -117.0382 },
  Mexicali: { lat: 32.6278, lng: -115.4545 },
  Ensenada: { lat: 31.8676, lng: -116.5958 },

  // Yucatán
  Mérida: { lat: 20.9674, lng: -89.5926 },
  Valladolid: { lat: 20.6892, lng: -88.2023 },

  // Guanajuato
  León: { lat: 21.1236, lng: -101.6859 },
  Guanajuato: { lat: 21.019, lng: -101.2574 },
  Irapuato: { lat: 20.6736, lng: -101.3558 },
  Celaya: { lat: 20.5236, lng: -100.8157 },

  // Michoacán
  Morelia: { lat: 19.7059, lng: -101.1849 },
  Uruapan: { lat: 19.4197, lng: -102.0613 },

  // Guerrero
  Acapulco: { lat: 16.8531, lng: -99.8237 },

  // Tamaulipas
  Reynosa: { lat: 26.0923, lng: -98.2775 },
  Matamoros: { lat: 25.8694, lng: -97.5028 },
  'Nuevo Laredo': { lat: 27.4767, lng: -99.5151 },
  Tampico: { lat: 22.2332, lng: -97.8615 },

  // Chihuahua
  Chihuahua: { lat: 28.6353, lng: -106.0889 },
  'Ciudad Juárez': { lat: 31.6904, lng: -106.4245 },

  // Coahuila
  Saltillo: { lat: 25.4232, lng: -101.0027 },
  Torreón: { lat: 25.5428, lng: -103.4068 },

  // Sonora
  Hermosillo: { lat: 29.0729, lng: -110.9559 },
  Nogales: { lat: 31.3236, lng: -110.9481 },

  // Sinaloa
  Culiacán: { lat: 24.8049, lng: -107.394 },
  Mazatlán: { lat: 23.2329, lng: -106.4062 },
  'Los Mochis': { lat: 25.7909, lng: -109.0132 },

  // Veracruz
  Veracruz: { lat: 19.1739, lng: -96.1342 },
  Xalapa: { lat: 19.5438, lng: -96.9269 },
  Coatzacoalcos: { lat: 18.1417, lng: -94.4488 },

  // Querétaro
  Querétaro: { lat: 20.5888, lng: -100.3899 },

  // Morelos
  Cuernavaca: { lat: 18.9261, lng: -99.2203 },

  // Chiapas
  'Tuxtla Gutiérrez': { lat: 16.7521, lng: -93.1152 },

  // Tabasco
  Villahermosa: { lat: 17.9892, lng: -92.9475 },

  // Oaxaca
  'Oaxaca de Juárez': { lat: 17.0654, lng: -96.7236 },

  // San Luis Potosí
  'San Luis Potosí': { lat: 22.1565, lng: -100.9855 },

  // Jalisco adicional
  'Puerto Vallarta': { lat: 20.6534, lng: -105.2253 },

  // Baja California Sur
  'La Paz': { lat: 24.1426, lng: -110.3128 },
  'Los Cabos': { lat: 22.8906, lng: -109.9167 },
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
