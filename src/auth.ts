import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config"; //  base liviana

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig, // Expandir la configuración base
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
    ...authConfig.callbacks, // callbacks del config
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; 
        token.rol = user.rol;
        token.academiaId = user.academiaId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.rol = token.rol as string;
        session.user.academiaId = token.academiaId as number;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
});


declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      rol?: string;
      academiaId?: number;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    rol?: string;
    academiaId?: number;
  }
}

import "next-auth/jwt";
declare module "next-auth/jwt" {
  interface JWT {
    id?: string; 
    rol?: string;
    academiaId?: number;
  }
}