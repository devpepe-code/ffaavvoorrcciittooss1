'use client';

import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

function LoginContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const urlError = searchParams.get('error');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      setError('Email o contraseña incorrectos. Verifica tus datos e intenta de nuevo.');
      setLoading(false);
    } else {
      window.location.href = callbackUrl;
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3
              className="text-lg font-bold"
              style={{ fontFamily: 'Sora, sans-serif', color: '#1A1A2E' }}
            >
              Recuperar contraseña
            </h3>
            <p className="mt-2 text-sm" style={{ color: '#6B7280' }}>
              Próximamente podrás recuperar tu contraseña por email. Por ahora,
              contáctanos en{' '}
              <strong style={{ color: '#FF6B35' }}>hola@favorcitos.com</strong>.
            </p>
            <Button
              className="mt-4 w-full"
              onClick={() => setShowForgotModal(false)}
            >
              Entendido
            </Button>
          </div>
        </div>
      )}

      <Card className="rounded-2xl border-0 shadow-lg" style={{ backgroundColor: '#FFFFFF' }}>
        <CardHeader className="pb-2">
          <CardTitle
            className="text-2xl"
            style={{ fontFamily: 'Sora, sans-serif', color: '#1A1A2E' }}
          >
            Iniciar Sesión
          </CardTitle>
          <p style={{ color: '#6B7280' }}>
            Accede a tu cuenta para solicitar o ofrecer servicios.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {(error || urlError) && (
              <div
                className="rounded-xl p-3 text-sm"
                style={{ backgroundColor: '#FEF2F2', color: '#EF4444' }}
              >
                {error ||
                  (urlError === 'CredentialsSignin'
                    ? 'Email o contraseña incorrectos.'
                    : 'Error al iniciar sesión.')}
              </div>
            )}
            <div>
              <label
                className="mb-1 block text-sm font-medium"
                style={{ color: '#1A1A2E' }}
              >
                Email
              </label>
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email"
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium" style={{ color: '#1A1A2E' }}>
                  Contraseña
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-medium transition-colors"
                  style={{ color: '#FF6B35' }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
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
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm" style={{ color: '#6B7280' }}>
            ¿No tienes cuenta?{' '}
            <Link
              href="/registro"
              className="font-semibold"
              style={{ color: '#FF6B35' }}
            >
              Regístrate gratis
            </Link>
          </p>
          <div
            className="mt-4 rounded-xl p-3 text-center text-xs"
            style={{ backgroundColor: '#F7F3EE', color: '#6B7280' }}
          >
            Demo: <strong>cliente@test.com</strong> / <strong>tasker@test.com</strong>
            {' '}— contraseña: <strong>password123</strong>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-12 text-center" style={{ color: '#6B7280' }}>
          Cargando...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
