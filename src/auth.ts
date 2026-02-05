import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id.toString(),
          name: user.nombre,
          email: user.email,
          rol: user.rol, 
          academiaId: user.academiaId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.rol = user.rol;
        token.academiaId = user.academiaId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Forzamos el tipado aquí para eliminar el error 'unknown'
        session.user.rol = token.rol as string;
        session.user.academiaId = token.academiaId as number;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
});

// DECLARACIÓN DE TIPOS AL FINAL (Ambient Types)
// Esto soluciona el error 2664 de module not found
declare module "next-auth" {
  interface Session {
    user: {
      rol?: string;
      academiaId?: number;
    } & DefaultSession["user"];
  }

  interface User {
    rol?: string;
    academiaId?: number;
  }
}

import "next-auth/jwt";
declare module "next-auth/jwt" {
  interface JWT {
    rol?: string;
    academiaId?: number;
  }
}