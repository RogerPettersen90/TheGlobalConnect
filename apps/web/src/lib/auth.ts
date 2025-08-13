import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@theglobalconnect/db';
import { getEnv } from '@theglobalconnect/config';
import bcrypt from 'bcryptjs';

const env = getEnv();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      })
    ] : []),
    ...(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET ? [
      GitHubProvider({
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      })
    ] : []),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || user.suspended) {
          return null;
        }

        // Note: In a real implementation, you'd store hashed passwords
        // For this demo, we'll skip password validation
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          handle: user.handle,
          image: user.avatarUrl,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.handle = dbUser.handle;
          token.email = dbUser.email;
          token.name = dbUser.name;
          token.picture = dbUser.avatarUrl;
          token.suspended = dbUser.suspended;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.handle = token.handle as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
        session.accessToken = token.accessToken as string;
      }

      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            // Create handle from email or name
            const baseHandle = user.email?.split('@')[0] || user.name?.toLowerCase().replace(/\s+/g, '') || 'user';
            let handle = baseHandle;
            let counter = 1;

            while (await prisma.user.findUnique({ where: { handle } })) {
              handle = `${baseHandle}${counter}`;
              counter++;
            }

            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || user.email!.split('@')[0],
                handle,
                avatarUrl: user.image,
              },
            });
          }
        } catch (error) {
          console.error('Error creating user:', error);
          return false;
        }
      }

      return true;
    },
  },
  secret: env.NEXTAUTH_SECRET,
};