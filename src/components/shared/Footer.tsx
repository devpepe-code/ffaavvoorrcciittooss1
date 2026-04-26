import Link from 'next/link';
import { Logo } from './Logo';

function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.77a4.85 4.85 0 0 1-1.01-.08z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#1A1A2E' }}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Logo dark />
            <p className="mt-3 max-w-xs text-sm" style={{ color: '#9CA3AF' }}>
              El servicio que necesitas, en tu colonia.
            </p>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>
                Plataforma
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/buscar-servicios" className="text-sm text-[#9CA3AF] transition-colors hover:text-white">
                  Buscar Servicios
                </Link>
                <Link href="/favorcito-ya" className="text-sm text-[#9CA3AF] transition-colors hover:text-white">
                  Favorcito YA!
                </Link>
                <Link href="/auth" className="text-sm text-[#9CA3AF] transition-colors hover:text-white">
                  Iniciar Sesión
                </Link>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>
                Compañía
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/about" className="text-sm text-[#9CA3AF] transition-colors hover:text-white">
                  Acerca de
                </Link>
                <Link href="/emergencias" className="text-sm text-[#9CA3AF] transition-colors hover:text-white">
                  Emergencias
                </Link>
                <div className="mt-2 flex gap-3">
                  <a
                    href="https://tiktok.com/@favorcitos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9CA3AF] transition-colors hover:text-white"
                    aria-label="TikTok"
                  >
                    <TikTokIcon />
                  </a>
                  <a
                    href="https://instagram.com/favorcitos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#9CA3AF] transition-colors hover:text-white"
                    aria-label="Instagram"
                  >
                    <InstagramIcon />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-10 border-t pt-6 text-center text-sm"
          style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#6B7280' }}
        >
          © {new Date().getFullYear()} Favorcitos · Hecho en México 🇲🇽
        </div>
      </div>
    </footer>
  );
}
