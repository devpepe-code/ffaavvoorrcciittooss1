import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SERVICE_CATEGORIES } from '@/types';
import { Shield, Star, MessageSquare } from 'lucide-react';

const CATEGORY_COLORS = [
  { bg: '#FFF0EB', border: '#FFCAB5' },
  { bg: '#E8FAF9', border: '#A0ECE7' },
  { bg: '#FFFBE6', border: '#FFE9A0' },
  { bg: '#F0F9FF', border: '#A0D9F0' },
  { bg: '#F9F0FF', border: '#D4A0F0' },
  { bg: '#F0FFF4', border: '#A0E6B4' },
  { bg: '#FFF5E6', border: '#FFD4A0' },
  { bg: '#EBF5FF', border: '#A0C8F0' },
  { bg: '#FFF0F3', border: '#F0A0B4' },
  { bg: '#F4FFF4', border: '#A0E6B4' },
];

const WHY_ITEMS = [
  {
    icon: <Shield className="h-10 w-10" style={{ color: '#F97316' }} />,
    title: 'Taskers Verificados',
    desc: 'Todos nuestros taskers pasan verificación de identidad y antecedentes.',
  },
  {
    icon: <MessageSquare className="h-10 w-10" style={{ color: '#2EC4B6' }} />,
    title: 'Contacto Directo',
    desc: 'Habla directo con tu tasker sin intermediarios — sin costos, sin comisiones.',
  },
  {
    icon: <Star className="h-10 w-10" style={{ color: '#F97316' }} />,
    title: 'Calificaciones Reales',
    desc: 'Lee reseñas de clientes reales antes de contratar. Transparencia total.',
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-36"
        style={{ background: 'linear-gradient(135deg, #F97316 0%, #1A1A2E 100%)' }}
      >
        <div className="mx-auto max-w-7xl text-center">
          <h1
            className="text-balance text-4xl font-bold tracking-tight text-white sm:text-6xl"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Alguien cerca de ti listo para ayudarte
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Desde arreglos en casa hasta cosas del día a día — conecta en minutos con personas confiables cerca de ti
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/buscar-servicios">
              <Button
                size="lg"
                className="rounded-xl font-semibold"
                style={{ backgroundColor: '#FFFFFF', color: '#F97316' }}
              >
                Buscar Servicios
              </Button>
            </Link>
            <Link href="/favorcito-ya">
              <Button
                size="lg"
                className="rounded-xl font-bold"
                style={{ backgroundColor: '#F97316', color: '#FFFFFF', border: '2px solid rgba(255,255,255,0.4)' }}
              >
                Favorcitos YA
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2
          className="text-center text-2xl font-bold sm:text-3xl"
          style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}
        >
          ¿Qué servicio necesitas?
        </h2>
        <p className="mt-2 text-center text-sm" style={{ color: '#6B7280' }}>
          Encuentra un profesional para cada tarea del hogar
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {SERVICE_CATEGORIES.slice(0, 10).map((cat, i) => {
            const { bg, border } = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
            return (
              <Link
                key={cat.value}
                href={`/buscar-servicios?categoria=${cat.value}`}
                className="group flex flex-col items-center rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                style={{ backgroundColor: bg, borderColor: border }}
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
                  style={{ backgroundColor: '#FFE66D' }}
                >
                  {cat.icon}
                </span>
                <span
                  className="mt-3 text-center text-sm font-semibold"
                  style={{ color: '#1A1A2E' }}
                >
                  {cat.label}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Why Favorcitos */}
      <section className="px-4 py-16 sm:px-6" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="mx-auto max-w-7xl">
          <h2
            className="text-center text-2xl font-bold sm:text-3xl"
            style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}
          >
            ¿Por qué Favorcitos?
          </h2>
          <p className="mt-2 text-center text-sm" style={{ color: '#6B7280' }}>
            Lo que necesites, cuando lo necesites
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {WHY_ITEMS.map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center rounded-2xl p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
                style={{
                  backgroundColor: '#F7F3EE',
                  border: '1px solid rgba(0,0,0,0.06)',
                }}
              >
                {item.icon}
                <h3
                  className="mt-4 font-semibold"
                  style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}
                >
                  {item.title}
                </h3>
                <p className="mt-2 text-sm" style={{ color: '#6B7280' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16 sm:px-6" style={{ backgroundColor: '#F7F3EE' }}>
        <div className="mx-auto max-w-4xl text-center">
          <h2
            className="text-2xl font-bold sm:text-3xl"
            style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}
          >
            Tan fácil como pedir un favor
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {[
              { step: '1', emoji: '🔍', title: 'Busca', desc: 'Filtra por servicio y ciudad. Ve perfiles, ratings y reseñas.' },
              { step: '2', emoji: '📱', title: 'Contacta', desc: 'Habla directo con el tasker. Sin intermediarios.' },
              { step: '3', emoji: '✅', title: 'Listo', desc: 'El servicio se realiza y dejas tu reseña. Así de simple.' },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold text-white"
                  style={{ backgroundColor: '#F97316' }}
                >
                  {s.emoji}
                </div>
                <h3 className="mt-4 font-semibold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>
                  {s.title}
                </h3>
                <p className="mt-2 text-sm" style={{ color: '#6B7280' }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="px-4 py-20 text-center sm:px-6"
        style={{ background: 'linear-gradient(135deg, #F97316 0%, #1A1A2E 100%)' }}
      >
        <h2
          className="text-2xl font-bold text-white sm:text-3xl"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          ¿Listo para empezar?
        </h2>
        <p className="mt-4 text-lg" style={{ color: 'rgba(255,255,255,0.8)' }}>
          Regístrate gratis y encuentra el profesional que necesitas en minutos.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/auth">
            <Button
              size="lg"
              className="rounded-xl px-8 font-semibold"
              style={{ backgroundColor: '#FFFFFF', color: '#F97316' }}
            >
              Crear cuenta gratis
            </Button>
          </Link>
          <Link href="/buscar-servicios">
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl border-white px-8 font-semibold"
              style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.7)' }}
            >
              Explorar servicios
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
