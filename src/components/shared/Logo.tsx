import Link from 'next/link';

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 no-underline">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-full"
        style={{ backgroundColor: '#F97316' }}
      >
        {/* Zap / lightning bolt */}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      </div>
      <span
        style={{
          fontFamily: 'Sora, sans-serif',
          fontWeight: 700,
          fontSize: '1.15rem',
          color: dark ? '#FFFFFF' : '#1A1A2E',
          letterSpacing: '-0.01em',
        }}
      >
        Favorcitos
      </span>
    </Link>
  );
}
