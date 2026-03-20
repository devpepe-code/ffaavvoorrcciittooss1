import Link from 'next/link';
import { Wrench } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Link href="/" className="flex items-center gap-2 font-bold text-amber-600">
            <Wrench className="h-6 w-6" />
            Favorcitos
          </Link>
          <div className="flex gap-8 text-sm text-slate-600">
            <Link href="/buscar" className="hover:text-amber-600">
              Buscar Servicios
            </Link>
            <Link href="/login" className="hover:text-amber-600">
              Iniciar Sesión
            </Link>
            <Link href="/registro" className="hover:text-amber-600">
              Registrarse
            </Link>
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Favorcitos. Plataforma de servicios para Latinoamérica.
        </p>
      </div>
    </footer>
  );
}
