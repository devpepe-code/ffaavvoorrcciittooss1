import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SERVICE_CATEGORIES } from '@/types';
import { Wrench, Shield, CreditCard, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-amber-600 to-orange-700 px-4 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            agent is connected
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-amber-100">
            Conectamos a personas que necesitan ayuda con profesionales verificados en México, Brasil,
            Argentina, Colombia y Chile.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/buscar">
              <Button size="lg" className="bg-white text-amber-600 hover:bg-amber-50">
                Buscar Servicios
              </Button>
            </Link>
            <Link href="/registro">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Ofrecer Servicios
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
          ¿Qué servicio necesitas?
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {SERVICE_CATEGORIES.slice(0, 10).map((cat) => (
            <Link
              key={cat.value}
              href={`/buscar?categoria=${cat.value}`}
              className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-6 transition hover:border-amber-300 hover:shadow-md"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="mt-2 text-center text-sm font-medium text-slate-700">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-slate-100 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            ¿Por qué Favorcitos?
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-sm">
              <Shield className="h-12 w-12 text-amber-500" />
              <h3 className="mt-4 font-semibold">Verificación</h3>
              <p className="mt-2 text-sm text-slate-600">
                Todos nuestros taskers pasan verificación de identidad y antecedentes.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-sm">
              <CreditCard className="h-12 w-12 text-amber-500" />
              <h3 className="mt-4 font-semibold">Pagos Seguros</h3>
              <p className="mt-2 text-sm text-slate-600">
                Pagos en escrow. Tu dinero está protegido hasta que el trabajo esté completo.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-sm">
              <Star className="h-12 w-12 text-amber-500" />
              <h3 className="mt-4 font-semibold">Calificaciones</h3>
              <p className="mt-2 text-sm text-slate-600">
                Lee reseñas reales de otros clientes antes de contratar.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-sm">
              <Wrench className="h-12 w-12 text-amber-500" />
              <h3 className="mt-4 font-semibold">Favorcitos</h3>
              <p className="mt-2 text-sm text-slate-600">
                Optimizado para México, Brasil, Argentina, Colombia y Chile.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-bold text-slate-900">¿Listo para empezar?</h2>
        <p className="mt-4 text-slate-600">
          Regístrate gratis y encuentra el profesional que necesitas en minutos.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/registro">
            <Button size="lg">Crear cuenta gratis</Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Ya tengo cuenta
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
