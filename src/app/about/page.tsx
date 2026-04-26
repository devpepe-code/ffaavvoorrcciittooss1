import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Acerca de — Favorcitos' };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold sm:text-4xl" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
        Acerca de Favorcitos
      </h1>
      <p className="mt-6 text-lg leading-relaxed" style={{ color: '#6B7280' }}>
        Favorcitos es la plataforma más directa para conectar a personas con profesionales de servicios del hogar en México.
        Sin comisiones, sin intermediarios — solo tú y el experto que necesitas.
      </p>
      <p className="mt-4 text-lg leading-relaxed" style={{ color: '#6B7280' }}>
        Nuestra misión es hacer que obtener ayuda sea tan fácil como pedirle un favor a un vecino de confianza.
        Desde plomería hasta limpieza, conectamos a vecinos con taskers verificados en su colonia.
      </p>
      <div className="mt-10 rounded-2xl p-8" style={{ backgroundColor: '#FFF7ED', border: '1px solid #FED7AA' }}>
        <h2 className="text-xl font-semibold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
          🚧 Página en construcción
        </h2>
        <p className="mt-2 text-sm" style={{ color: '#6B7280' }}>
          Estamos trabajando en completar esta sección. Próximamente encontrarás nuestra historia, equipo y valores.
        </p>
      </div>
      <div className="mt-8">
        <Link href="/">
          <Button style={{ backgroundColor: '#F97316', color: '#FFFFFF' }} className="rounded-xl">
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
}
