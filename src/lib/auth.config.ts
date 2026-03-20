import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authConfig = {
  trustHost: true, // Necesario para Vercel y múltiples dominios
  providers: [
    Credentials({
      credentials: {},
      authorize: () => null,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' as const, maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const path = nextUrl.pathname;

      const publicPaths = ['/', '/login', '/registro', '/buscar'];
      const isTaskerProfile = /^\/tasker\/[^/]+$/.test(path);
      const isPublic =
        publicPaths.some((p) => path === p || path.startsWith(p + '/')) ||
        isTaskerProfile;

      if (isPublic && path !== '/login' && path !== '/registro') return true;
      if (path === '/login' || path === '/registro') {
        if (isLoggedIn) return Response.redirect(new URL('/dashboard', nextUrl));
        return true;
      }
      if (!isLoggedIn) return Response.redirect(new URL('/login', nextUrl));
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { id: string }).id = token.id as string;
        (session.user as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
