import Link from 'next/link';

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#1A1A2E' }}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Link href="/" className="flex items-center gap-2">
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
                  color: '#FFFFFF',
                }}
              >
                favorcitos
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm" style={{ color: '#9CA3AF' }}>
              El servicio que necesitas, en tu colonia.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-10">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>
                Plataforma
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/buscar" className="text-sm text-[#9CA3AF] transition-colors hover:text-white">
                  Buscar Servicios
                </Link>
                <Link href="/registro" className="text-sm text-[#9CA3AF] transition-colors hover:text-white">
                  Registrarse
                </Link>
                <Link href="/login" className="text-sm text-[#9CA3AF] transition-colors hover:text-white">
                  Iniciar Sesión
                </Link>
              </div>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B7280' }}>
                Ciudades
              </p>
              <div className="flex flex-col gap-2 text-sm" style={{ color: '#9CA3AF' }}>
                <span>Ciudad de México</span>
                <span>Guadalajara</span>
                <span>Monterrey</span>
                <span>Puebla</span>
                <span>Cancún</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-10 border-t pt-6 text-center text-sm"
          style={{ borderColor: 'rgba(255,255,255,0.08)', color: '#6B7280' }}
        >
          © {new Date().getFullYear()} Favorcitos. La plataforma de servicios del hogar en México. Sin costos, sin comisiones.
        </div>
      </div>
    </footer>
  );
}
