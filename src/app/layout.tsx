import type { Metadata } from 'next';
import { Providers } from './providers';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Favorcitos - Servicios del Hogar en Latinoamérica',
  description:
    'Conecta gratis con profesionales verificados para limpieza, plomería, electricidad y más. México, Argentina, Colombia y Chile.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className="min-h-screen antialiased"
        style={{ backgroundColor: '#F7F3EE', color: '#1A1A2E', fontFamily: 'Inter, sans-serif' }}
      >
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-8rem)]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
