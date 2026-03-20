import { Suspense } from 'react';
import { TaskerSearch } from '@/components/cliente/TaskerSearch';

export default function BuscarPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">Buscar Servicios</h1>
      <p className="mt-2 text-slate-600">
        Encuentra taskers verificados en tu zona
      </p>
      <Suspense fallback={<div className="mt-8">Cargando...</div>}>
        <TaskerSearch />
      </Suspense>
    </div>
  );
}
