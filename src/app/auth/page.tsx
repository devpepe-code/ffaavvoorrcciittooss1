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

          {/* Google OAuth */}
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl border py-2.5 text-sm font-medium transition-colors hover:bg-gray-50"
            style={{ borderColor: '#E5E7EB', color: '#1A1A2E' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </button>

          <div className="mb-4 flex items-center gap-3">
            <div className="flex-1 border-t" style={{ borderColor: '#E5E7EB' }} />
            <span className="text-xs" style={{ color: '#9CA3AF' }}>o con correo</span>
            <div className="flex-1 border-t" style={{ borderColor: '#E5E7EB' }} />
          </div>

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
