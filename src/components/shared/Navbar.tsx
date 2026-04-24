'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, LayoutDashboard, CalendarDays } from 'lucide-react';

function FavorcitosLogo() {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-full"
        style={{ backgroundColor: '#FF6B35' }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 1.5L9.54 6H14L10.46 8.46 12 13 8 10.5 4 13l1.54-4.54L2 6h4.46L8 1.5z"
            fill="white"
          />
        </svg>
      </div>
      <span
        style={{
          fontFamily: 'Sora, sans-serif',
          fontWeight: 700,
          fontSize: '1.15rem',
          color: '#1A1A2E',
          letterSpacing: '-0.01em',
        }}
      >
        favorcitos
      </span>
    </div>
  );
}

export function Navbar() {
  const { data: session, status } = useSession();
  const role = (session?.user as { role?: string })?.role;
  const [menuOpen, setMenuOpen] = useState(false);

  const dashHref =
    role === 'ADMIN'
      ? '/admin/dashboard'
      : role === 'TASKER'
      ? '/tasker/dashboard'
      : '/cliente/dashboard';
  const reservasHref = role === 'TASKER' ? '/tasker/dashboard' : '/cliente/mis-reservas';
  const reservasLabel = role === 'TASKER' ? 'Mis Trabajos' : 'Mis Reservas';

  return (
    <nav
      className="sticky top-0 z-50 bg-white"
      style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" onClick={() => setMenuOpen(false)}>
          <FavorcitosLogo />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/buscar"
            className="text-sm font-medium transition-colors"
            style={{ color: '#6B7280' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B35')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}
          >
            Buscar Servicios
          </Link>

          {status === 'loading' ? (
            <span className="inline-block h-8 w-32 animate-pulse rounded-lg" style={{ backgroundColor: '#F3F4F6' }} />
          ) : session ? (
            <>
              {role !== 'TASKER' && (
                <Link
                  href={reservasHref}
                  className="flex items-center gap-1 text-sm font-medium transition-colors"
                  style={{ color: '#6B7280' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B35')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}
                >
                  <CalendarDays className="h-4 w-4" />
                  {reservasLabel}
                </Link>
              )}
              <Link href={dashHref}>
                <Button size="sm" variant="outline">
                  <LayoutDashboard className="mr-1 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                <LogOut className="mr-1 h-4 w-4" />
                Salir
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium transition-colors"
                style={{ color: '#6B7280' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FF6B35')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}
              >
                Iniciar sesión
              </Link>
              <Link href="/registro">
                <Button size="sm">Registrarse gratis</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex items-center justify-center rounded-lg p-2 transition-colors md:hidden"
          style={{ color: '#6B7280' }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className="border-t bg-white px-4 py-4 md:hidden"
          style={{ borderColor: 'rgba(0,0,0,0.06)' }}
        >
          <div className="flex flex-col gap-4">
            <Link
              href="/buscar"
              className="text-sm font-medium"
              style={{ color: '#6B7280' }}
              onClick={() => setMenuOpen(false)}
            >
              Buscar Servicios
            </Link>
            {session ? (
              <>
                {role !== 'TASKER' && (
                  <Link
                    href={reservasHref}
                    className="text-sm font-medium"
                    style={{ color: '#6B7280' }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {reservasLabel}
                  </Link>
                )}
                <Link href={dashHref} onClick={() => setMenuOpen(false)}>
                  <Button size="sm" variant="outline" className="w-full">
                    <LayoutDashboard className="mr-1 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    setMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                >
                  <LogOut className="mr-1 h-4 w-4" />
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium"
                  style={{ color: '#6B7280' }}
                  onClick={() => setMenuOpen(false)}
                >
                  Iniciar sesión
                </Link>
                <Link href="/registro" onClick={() => setMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    Registrarse gratis
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
