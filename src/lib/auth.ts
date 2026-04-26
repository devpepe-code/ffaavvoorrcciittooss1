import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { prisma } from './db';
import { authConfig } from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user?.passwordHash) return null;
        const bcrypt = await import('bcryptjs');
        const valid = await bcrypt.compare(credentials.password as string, user.passwordHash);
        if (!valid) return null;
        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          image: user.profileImage,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const existing = await prisma.user.findUnique({ where: { email: user.email! } });
        if (!existing) {
          const parts = (user.name || 'Usuario').split(' ');
          await prisma.user.create({
            data: {
              email: user.email!,
              firstName: parts[0],
              lastName: parts.slice(1).join(' ') || '',
              profileImage: user.image ?? null,
              role: 'ONBOARDING',
              city: '',
              emailVerified: new Date(),
            },
          });
        }
        return true;
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account?.provider === 'google') {
        const dbUser = await prisma.user.findUnique({ where: { email: token.email! } });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      } else if (user) {
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
});
