'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { SERVICE_CATEGORIES } from '@/types';
import { ESTADOS_MEXICO, CIUDADES_POR_ESTADO } from '@/lib/mexicoData';

type Role = 'CLIENTE' | 'TASKER';

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role | ''>('');
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    estado: '',
    city: '',
    colonia: '',
    bio: '',
    services: [] as string[],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  function setField<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: '' }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'Ingresa tu nombre';
    if (!form.lastName.trim()) e.lastName = 'Ingresa tu apellido';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Email inválido';
    if (form.password.length < 6) e.password = 'Mínimo 6 caracteres';
    if (!form.estado) e.estado = 'Selecciona un estado';
    if (!form.city) e.city = 'Selecciona una ciudad';
    if (role === 'TASKER') {
      if (!form.bio.trim()) e.bio = 'Agrega una descripción breve de tus servicios';
      if (form.services.length === 0) e.services = 'Selecciona al menos un servicio';
    }
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          country: 'México',
          role,
          phone: form.phone ? form.phone : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || 'Error al registrar');
        setLoading(false);
        return;
      }
      const signInRes = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (signInRes?.ok) {
        router.push(role === 'TASKER' ? '/tasker/dashboard' : '/cliente/dashboard');
        router.refresh();
      } else {
        router.push('/login');
      }
    } catch {
      setServerError('Error al registrar. Intenta de nuevo.');
    }
    setLoading(false);
  }

  function toggleService(svc: string) {
    setField(
      'services',
      form.services.includes(svc)
        ? form.services.filter((s) => s !== svc)
        : [...form.services, svc]
    );
  }

  const pwStrength =
    form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const pwColor = ['', '#EF4444', '#FF6B35', '#22C55E'][pwStrength];
  const pwLabel = ['', 'Débil', 'Aceptable', 'Fuerte'][pwStrength];

  const ciudades = form.estado ? (CIUDADES_POR_ESTADO[form.estado] || []) : [];

  /* ── Role selector ── */
  if (!role) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center px-4 py-12">
        <h1
          className="text-center text-3xl font-bold"
          style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}
        >
          Crear cuenta en Favorcitos
        </h1>
        <p className="mt-3 text-center" style={{ color: '#6B7280' }}>
          ¿Cómo quieres usar la plataforma?
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <button
            onClick={() => setRole('CLIENTE')}
            className="flex flex-col items-center rounded-2xl border-2 bg-white p-8 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            style={{ borderColor: '#E5E7EB' }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#FF6B35')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E5E7EB')}
          >
            <span className="text-5xl">🏠</span>
            <h3
              className="mt-4 text-xl font-bold"
              style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}
            >
              Necesito servicios
            </h3>
            <p className="mt-2 text-sm" style={{ color: '#6B7280' }}>
              Busca y contrata profesionales para tu hogar.
            </p>
            <span
              className="mt-5 rounded-xl px-6 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: '#FF6B35' }}
            >
              Soy Cliente →
            </span>
          </button>
          <button
            onClick={() => setRole('TASKER')}
            className="flex flex-col items-center rounded-2xl border-2 bg-white p-8 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            style={{ borderColor: '#E5E7EB' }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2EC4B6')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E5E7EB')}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ backgroundColor: '#FFF7ED' }}>
              <Zap className="h-8 w-8" style={{ color: '#F97316' }} />
            </div>
            <h3
              className="mt-4 text-xl font-bold"
              style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}
            >
              Quiero ofrecer servicios
            </h3>
            <p className="mt-2 text-sm" style={{ color: '#6B7280' }}>
              Ofrece tus habilidades y consigue clientes.
            </p>
            <span
              className="mt-5 rounded-xl px-6 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: '#2EC4B6' }}
            >
              Soy Tasker →
            </span>
          </button>
        </div>
        <p className="mt-6 text-center text-sm" style={{ color: '#6B7280' }}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-semibold" style={{ color: '#FF6B35' }}>
            Iniciar sesión
          </Link>
        </p>
      </div>
    );
  }

  /* ── Registration form ── */
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-4 py-12">
      <Card className="rounded-2xl border-0 shadow-lg" style={{ backgroundColor: '#FFFFFF' }}>
        <CardHeader className="pb-2">
          <button
            onClick={() => setRole('')}
            className="mb-2 text-left text-sm font-medium transition-colors"
            style={{ color: '#6B7280' }}
          >
            ← Cambiar tipo de cuenta
          </button>
          <CardTitle
            className="text-2xl"
            style={{ fontFamily: 'Sora, sans-serif', color: '#1A1A2E' }}
          >
            {role === 'TASKER' ? '⚡ Cuenta de Tasker' : '🏠 Cuenta de Cliente'}
          </CardTitle>
          <p style={{ color: '#6B7280' }}>
            {role === 'TASKER'
              ? 'Completa tu perfil para recibir solicitudes de servicio.'
              : 'Regístrate para solicitar servicios en tu hogar.'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {serverError && (
              <div
                className="rounded-xl p-3 text-sm"
                style={{ backgroundColor: '#FEF2F2', color: '#EF4444' }}
              >
                {serverError}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>
                  Nombre
                </label>
                <Input
                  placeholder="María"
                  value={form.firstName}
                  onChange={(e) => setField('firstName', e.target.value)}
                  className={errors.firstName ? 'border-red-400' : ''}
                  aria-label="Nombre"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>
                  Apellido
                </label>
                <Input
                  placeholder="García"
                  value={form.lastName}
                  onChange={(e) => setField('lastName', e.target.value)}
                  className={errors.lastName ? 'border-red-400' : ''}
                  aria-label="Apellido"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>
                Email
              </label>
              <Input
                type="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                className={errors.email ? 'border-red-400' : ''}
                aria-label="Email"
              />
              {errors.email && (
                <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{errors.email}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>
                Contraseña
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 6 caracteres"
                  value={form.password}
                  onChange={(e) => setField('password', e.target.value)}
                  className={`pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  aria-label="Contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: '#9CA3AF' }}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {form.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className="h-1 flex-1 rounded-full transition-colors"
                        style={{ backgroundColor: pwStrength >= n ? pwColor : '#E5E7EB' }}
                      />
                    ))}
                  </div>
                  <p className="mt-1 text-xs font-medium" style={{ color: pwColor }}>
                    {pwLabel}
                  </p>
                </div>
              )}
              {errors.password && (
                <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{errors.password}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>
                Teléfono <span style={{ color: '#9CA3AF' }}>(opcional)</span>
              </label>
              <div className="flex">
                <span
                  className="flex items-center rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 px-3 text-sm"
                  style={{ color: '#6B7280' }}
                >
                  🇲🇽 +52
                </span>
                <Input
                  type="tel"
                  placeholder="55 1234 5678"
                  value={form.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                  className="rounded-l-none"
                  aria-label="Teléfono"
                />
              </div>
            </div>

            {/* Estado / Ciudad */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>
                  Estado
                </label>
                <select
                  className={`flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] ${
                    errors.estado ? 'border-red-400' : 'border-slate-200'
                  }`}
                  value={form.estado}
                  onChange={(e) => setForm((f) => ({ ...f, estado: e.target.value, city: '' }))}
                  aria-label="Estado"
                >
                  <option value="">Selecciona estado</option>
                  {ESTADOS_MEXICO.map((est) => (
                    <option key={est} value={est}>{est}</option>
                  ))}
                </select>
                {errors.estado && (
                  <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{errors.estado}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>
                  Ciudad / Alcaldía
                </label>
                <select
                  className={`flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] ${
                    errors.city ? 'border-red-400' : 'border-slate-200'
                  }`}
                  value={form.city}
                  onChange={(e) => setField('city', e.target.value)}
                  disabled={!form.estado}
                  aria-label="Ciudad"
                >
                  <option value="">
                    {form.estado ? 'Selecciona ciudad' : 'Primero elige estado'}
                  </option>
                  {ciudades.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.city && (
                  <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{errors.city}</p>
                )}
              </div>
            </div>

            {/* Colonia */}
            <div>
              <label className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>
                Colonia <span style={{ color: '#9CA3AF' }}>(opcional)</span>
              </label>
              <Input
                placeholder="Ej: Del Valle, Condesa, Polanco..."
                value={form.colonia}
                onChange={(e) => setField('colonia', e.target.value)}
                aria-label="Colonia"
              />
            </div>

            {role === 'TASKER' && (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>
                    Descripción breve
                  </label>
                  <textarea
                    className={`min-h-[90px] w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35] ${
                      errors.bio ? 'border-red-400' : 'border-slate-200'
                    }`}
                    placeholder="Ej: Plomero con 5 años de experiencia, especializado en reparaciones de emergencia en Ciudad de México..."
                    value={form.bio}
                    onChange={(e) => setField('bio', e.target.value)}
                    aria-label="Descripción"
                  />
                  {errors.bio && (
                    <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{errors.bio}</p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium" style={{ color: '#1A1A2E' }}>
                    Servicios que ofreces
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SERVICE_CATEGORIES.map((cat) => {
                      const selected = form.services.includes(cat.value);
                      return (
                        <button
                          key={cat.value}
                          type="button"
                          onClick={() => toggleService(cat.value)}
                          className="rounded-xl border px-3 py-1.5 text-xs font-medium transition-all"
                          style={{
                            backgroundColor: selected ? '#FF6B35' : 'white',
                            color: selected ? 'white' : '#6B7280',
                            borderColor: selected ? '#FF6B35' : '#E5E7EB',
                          }}
                        >
                          {cat.icon} {cat.label}
                        </button>
                      );
                    })}
                  </div>
                  {errors.services && (
                    <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{errors.services}</p>
                  )}
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full"
              style={{
                backgroundColor: role === 'TASKER' ? '#2EC4B6' : '#FF6B35',
                color: 'white',
              }}
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Crear cuenta'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm" style={{ color: '#6B7280' }}>
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-semibold" style={{ color: '#FF6B35' }}>
              Iniciar sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
