'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/shared/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

type Tab = 'login' | 'register';

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Register state
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regRole, setRegRole] = useState<'CLIENTE' | 'TASKER'>('CLIENTE');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await signIn('credentials', {
        email: loginEmail,
        password: loginPass,
        redirect: false,
      });
      if (res?.error) {
        setError('Correo o contraseña incorrectos.');
      } else {
        router.push('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: regFirstName,
          lastName: regLastName,
          email: regEmail,
          password: regPass,
          role: regRole,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al registrarse. Intenta de nuevo.');
        return;
      }
      const loginRes = await signIn('credentials', {
        email: regEmail,
        password: regPass,
        redirect: false,
      });
      if (loginRes?.error) {
        setError('Registro exitoso. Inicia sesión.');
        setTab('login');
      } else {
        router.push('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12" style={{ backgroundColor: '#F7F3EE' }}>
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
          {/* Tabs */}
          <div className="mb-6 flex rounded-xl p-1" style={{ backgroundColor: '#F7F3EE' }}>
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className="flex-1 rounded-lg py-2 text-sm font-semibold transition-all"
                style={{
                  backgroundColor: tab === t ? '#FFFFFF' : 'transparent',
                  color: tab === t ? '#1A1A2E' : '#6B7280',
                  boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {t === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: '#FEF2F2', color: '#EF4444' }}>
              {error}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>Correo electrónico</label>
                <Input
                  type="email"
                  placeholder="tu@correo.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>Contraseña</label>
                <div className="relative">
                  <Input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: '#9CA3AF' }}
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full rounded-xl font-semibold"
                style={{ backgroundColor: '#F97316', color: '#FFFFFF' }}
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Iniciar Sesión'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>Nombre</label>
                  <Input placeholder="María" value={regFirstName} onChange={(e) => setRegFirstName(e.target.value)} required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>Apellido</label>
                  <Input placeholder="García" value={regLastName} onChange={(e) => setRegLastName(e.target.value)} required />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>Correo electrónico</label>
                <Input type="email" placeholder="tu@correo.com" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>Contraseña</label>
                <div className="relative">
                  <Input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Mínimo 8 caracteres"
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    required
                    minLength={8}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: '#9CA3AF' }}
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium" style={{ color: '#1A1A2E' }}>Quiero...</label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { value: 'CLIENTE', label: '🏠 Contratar servicios' },
                    { value: 'TASKER', label: '⚡ Ofrecer servicios' },
                  ] as const).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setRegRole(opt.value)}
                      className="rounded-xl border p-3 text-sm font-medium transition-all"
                      style={{
                        borderColor: regRole === opt.value ? '#F97316' : '#E5E7EB',
                        backgroundColor: regRole === opt.value ? '#FFF7ED' : '#FFFFFF',
                        color: regRole === opt.value ? '#F97316' : '#6B7280',
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full rounded-xl font-semibold"
                style={{ backgroundColor: '#F97316', color: '#FFFFFF' }}
                disabled={loading}
              >
                {loading ? 'Registrando...' : 'Crear cuenta gratis'}
              </Button>
            </form>
          )}
        </div>
        <p className="mt-4 text-center text-xs" style={{ color: '#9CA3AF' }}>
          Al continuar aceptas nuestros{' '}
          <Link href="#" style={{ color: '#F97316' }}>términos de uso</Link>.
        </p>
      </div>
    </div>
  );
}
