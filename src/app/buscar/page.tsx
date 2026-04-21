import { Suspense } from 'react';
import { TaskerSearch } from '@/components/cliente/TaskerSearch';

export const metadata = {
  title: 'Buscar Servicios — Favorcitos',
  description: 'Encuentra taskers verificados para limpieza, plomería, electricidad y más en tu ciudad.',
};

export default function BuscarPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1
        className="text-2xl font-bold sm:text-3xl"
        style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}
      >
        Buscar Servicios
      </h1>
      <p className="mt-2" style={{ color: '#6B7280' }}>
        Encuentra profesionales verificados en tu ciudad — sin costo, sin comisiones.
      </p>
      <Suspense
        fallback={
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl p-6"
                style={{ backgroundColor: '#FFFFFF', height: '220px' }}
              />
            ))}
          </div>
        }
      >
        <TaskerSearch />
      </Suspense>
    </div>
  );
}
