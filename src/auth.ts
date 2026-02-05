import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs"
import type { JWT } from "next-auth/jwt";

// 1. Extendemos las interfaces de Auth.js
declare module "next-auth" {
  interface Session {
    user: {
      role?: string;
      academiaId?: number;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    academiaId?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    academiaId?: number;
  }
}
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

        // Buscar al usuario en MySQL 
        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email as string },
        });

        // Si el usuario no existe o no tiene password, rebotar
        if (!user || !user.password) return null;

        // Comparar contraseñas usando bcrypt (Punto 4.1)
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        // Retornar el usuario para crear la sesión (JWT)
        return {
          id: user.id.toString(),
          name: user.nombre,
          email: user.email,
          role: user.rol, 
          academiaId: user.academiaId, // Para filtrar datos por academia
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.academiaId = user.academiaId;
      }
      return token;
    },
    async session({ session, token }) {
      // Agregamos "&& session.user" para asegurarnos de que el objeto exista
      if (token && session.user) { 
        session.user.role = token.role as string;
        session.user.academiaId = token.academiaId as number;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Nuestra página personalizada de Login
  },
  session: { strategy: "jwt" }, // Requisito 4.1: Sesiones basadas en tokens
});