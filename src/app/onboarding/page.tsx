'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Logo } from '@/components/shared/Logo';
import { Zap, Home } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { update } = useSession();
  const [selected, setSelected] = useState<'CLIENTE' | 'TASKER' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleContinue() {
    if (!selected) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/user/set-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selected }),
      });
      if (!res.ok) throw new Error('Error al guardar el rol');
      await update({ role: selected });
      router.push(selected === 'TASKER' ? '/tasker/dashboard' : '/cliente/dashboard');
    } catch {
      setError('Algo salió mal. Intenta de nuevo.');
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12" style={{ backgroundColor: '#F7F3EE' }}>
      <div className="mb-8">
        <Logo />
      </div>

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
        <h1 className="mb-2 text-center text-2xl font-bold" style={{ fontFamily: 'Sora, sans-serif', color: '#1A1A2E' }}>
          ¿Cómo quieres usar Favorcitos?
        </h1>
        <p className="mb-8 text-center text-sm" style={{ color: '#6B7280' }}>
          Puedes cambiar esto después desde tu perfil
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setSelected('CLIENTE')}
            className="flex flex-col items-center rounded-2xl border-2 p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            style={{
              borderColor: selected === 'CLIENTE' ? '#F97316' : '#E5E7EB',
              backgroundColor: selected === 'CLIENTE' ? '#FFF7ED' : '#FFFFFF',
            }}
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: selected === 'CLIENTE' ? '#FDBA74' : '#F3F4F6' }}>
              <Home className="h-7 w-7" style={{ color: selected === 'CLIENTE' ? '#FFFFFF' : '#6B7280' }} />
            </div>
            <h3 className="font-bold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>Contratar</h3>
            <p className="mt-1 text-xs" style={{ color: '#6B7280' }}>Necesito ayuda con servicios en casa</p>
          </button>

          <button
            onClick={() => setSelected('TASKER')}
            className="flex flex-col items-center rounded-2xl border-2 p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
            style={{
              borderColor: selected === 'TASKER' ? '#F97316' : '#E5E7EB',
              backgroundColor: selected === 'TASKER' ? '#FFF7ED' : '#FFFFFF',
            }}
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: selected === 'TASKER' ? '#FDBA74' : '#F3F4F6' }}>
              <Zap className="h-7 w-7" style={{ color: selected === 'TASKER' ? '#FFFFFF' : '#6B7280' }} />
            </div>
            <h3 className="font-bold" style={{ color: '#1A1A2E', fontFamily: 'Sora, sans-serif' }}>Ofrecer servicios</h3>
            <p className="mt-1 text-xs" style={{ color: '#6B7280' }}>Quiero ganar dinero con mis habilidades</p>
          </button>
        </div>

        {error && (
          <p className="mt-4 text-center text-sm" style={{ color: '#EF4444' }}>{error}</p>
        )}

        <button
          onClick={handleContinue}
          disabled={!selected || loading}
          className="mt-6 w-full rounded-xl py-3 text-base font-bold text-white transition-opacity disabled:opacity-40"
          style={{ backgroundColor: '#F97316' }}
        >
          {loading ? 'Guardando...' : 'Continuar →'}
        </button>
      </div>
    </div>
  );
}
