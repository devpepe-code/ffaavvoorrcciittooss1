'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.77a4.85 4.85 0 0 1-1.01-.08z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setDrawerOpen(false);
    }
    if (drawerOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  return (
    <>
      <nav
        className="sticky top-0 z-50 bg-white"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo />

          <div className="flex items-center gap-3">
            <Link
              href="/favorcito-ya"
              className="hidden rounded-xl px-5 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 sm:inline-flex"
              style={{ backgroundColor: '#F97316' }}
            >
              Favorcito YA!
            </Link>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors"
              style={{ color: '#1A1A2E' }}
              onClick={() => setDrawerOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Right-side drawer */}
      <div
        className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col bg-white shadow-2xl transition-transform duration-300"
        style={{ transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <Logo />
          <button
            onClick={() => setDrawerOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ color: '#6B7280' }}
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-5">
          <Link
            href="/auth"
            onClick={() => setDrawerOpen(false)}
            className="flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-orange-50"
            style={{ color: '#1A1A2E' }}
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/favorcito-ya"
            onClick={() => setDrawerOpen(false)}
            className="flex items-center rounded-xl px-4 py-3 text-sm font-bold transition-colors"
            style={{ backgroundColor: '#F97316', color: '#FFFFFF' }}
          >
            Favorcito YA!
          </Link>
          <Link
            href="/buscar-servicios"
            onClick={() => setDrawerOpen(false)}
            className="flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-orange-50"
            style={{ color: '#1A1A2E' }}
          >
            Buscar Servicios
          </Link>

          <div className="mt-auto border-t pt-5" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
            <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#9CA3AF' }}>
              Síguenos
            </p>
            <div className="flex gap-3 px-4">
              <a
                href="https://tiktok.com/@favorcitos"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-orange-50"
                style={{ color: '#1A1A2E' }}
                aria-label="TikTok"
              >
                <TikTokIcon />
              </a>
              <a
                href="https://instagram.com/favorcitos"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-orange-50"
                style={{ color: '#1A1A2E' }}
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
