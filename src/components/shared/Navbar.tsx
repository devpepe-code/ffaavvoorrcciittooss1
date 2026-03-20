'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Wrench, User, LogOut, LayoutDashboard } from 'lucide-react';

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-amber-600">
          <Wrench className="h-8 w-8" />
          <span className="text-xl">Favorcitos</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/buscar" className="text-slate-600 hover:text-amber-600">
            Buscar Servicios
          </Link>
          {status === 'loading' ? (
            <span className="text-sm text-slate-500">Cargando...</span>
          ) : session ? (
            <>
              <a
                href={
                  (session.user as { role?: string })?.role === 'ADMIN'
                    ? '/admin/dashboard'
                    : (session.user as { role?: string })?.role === 'TASKER'
                    ? '/tasker/dashboard'
                    : '/cliente/dashboard'
                }
                className="flex items-center gap-2 text-slate-600 hover:text-amber-600"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href =
                    (session.user as { role?: string })?.role === 'ADMIN'
                      ? '/admin/dashboard'
                      : (session.user as { role?: string })?.role === 'TASKER'
                      ? '/tasker/dashboard'
                      : '/cliente/dashboard';
                }}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </a>
              <a
                href="/cliente/mis-reservas"
                className="flex items-center gap-2 text-slate-600 hover:text-amber-600"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/cliente/mis-reservas';
                }}
              >
                <User className="h-4 w-4" />
                Mis Reservas
              </a>
              {(session.user as { role?: string })?.role === 'ADMIN' && (
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-2 text-slate-600 hover:text-amber-600"
                >
                  Admin
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                <LogOut className="h-4 w-4 mr-1" />
                Salir
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Iniciar Sesión</Button>
              </Link>
              <Link href="/registro">
                <Button>Registrarse</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
