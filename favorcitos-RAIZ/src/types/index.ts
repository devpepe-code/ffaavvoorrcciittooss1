export const SERVICE_CATEGORIES = [
  { value: 'LIMPIEZA_HOGAR', label: 'Limpieza del Hogar', icon: '🧹' },
  { value: 'PLOMERIA', label: 'Plomería', icon: '🔧' },
  { value: 'ELECTRICIDAD', label: 'Electricidad', icon: '⚡' },
  { value: 'REPARACION_ELECTRODOMESTICOS', label: 'Reparación Electrodomésticos', icon: '🔌' },
  { value: 'CARPINTERIA', label: 'Carpintería', icon: '🪚' },
  { value: 'PINTURA', label: 'Pintura', icon: '🎨' },
  { value: 'JARDINERIA', label: 'Jardinería', icon: '🌿' },
  { value: 'MUDANZA', label: 'Mudanza', icon: '📦' },
  { value: 'ENSAMBLAJE_MUEBLES', label: 'Ensamblaje Muebles', icon: '🛠️' },
  { value: 'HANDYMAN_GENERAL', label: 'Handyman General', icon: '👷' },
  { value: 'CERRAJERIA', label: 'Cerrajería', icon: '🔐' },
  { value: 'AIRE_ACONDICIONADO', label: 'Aire Acondicionado', icon: '❄️' },
  { value: 'OTRO', label: 'Otro', icon: '📋' },
] as const;

export const BOOKING_STATUS = {
  PENDING: 'Pendiente',
  QUOTATION_REQUESTED: 'Cotización solicitada',
  QUOTATION_SENT: 'Cotización enviada',
  CONFIRMED: 'Confirmada',
  IN_PROGRESS: 'En progreso',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
  DISPUTED: 'En disputa',
} as const;
