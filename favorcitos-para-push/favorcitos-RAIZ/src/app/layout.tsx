import type { Metadata } from 'next';
import { Providers } from './providers';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Favorcitos - Servicios del Hogar',
  description: 'Plataforma de servicios para Latinoamérica',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-8rem)]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
