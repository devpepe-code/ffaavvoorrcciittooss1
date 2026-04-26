import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Emergencias — Favorcitos' };

export default function EmergenciasPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl text-3xl" style={{ backgroundColor: '#FEF2F2' }}>
        🚨
      </div>
      <h1 className="text-3xl font-bold sm:text-4xl" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
        Servicios de Emergencia
      </h1>
      <p className="mt-6 text-lg leading-relaxed" style={{ color: '#6B7280' }}>
        ¿Tienes una fuga de agua, un corto eléctrico o una cerradura rota? Favorcitos te conecta con taskers disponibles ahora mismo.
      </p>
      <div className="mt-8 rounded-2xl p-6" style={{ backgroundColor: '#FFF7ED', border: '1px solid #FED7AA' }}>
        <h2 className="font-semibold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
          Para emergencias inmediatas usa Favorcito YA!
        </h2>
        <p className="mt-2 text-sm" style={{ color: '#6B7280' }}>
          Encuentra taskers disponibles en tiempo real en tu zona.
        </p>
        <Link href="/favorcito-ya" className="mt-4 inline-block">
          <Button style={{ backgroundColor: '#F97316', color: '#FFFFFF' }} className="rounded-xl font-bold">
            Buscar Favorcito YA! →
          </Button>
        </Link>
      </div>
      <div className="mt-6 rounded-2xl p-6" style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD' }}>
        <h2 className="font-semibold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
          🚧 Línea de emergencias — Próximamente
        </h2>
        <p className="mt-2 text-sm" style={{ color: '#6B7280' }}>
          Estamos configurando una línea directa de atención para emergencias del hogar 24/7.
        </p>
      </div>
      <div className="mt-8">
        <Link href="/">
          <Button variant="outline" className="rounded-xl">
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}
