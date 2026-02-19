import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { Role } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
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

        // IMPORTANTE: Devolvemos exactamente lo que definimos en el .d.ts
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
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        //datos en el token cuando el usuario inicia sesión
        token.id = user.id; 
        token.rol = user.rol;
        token.academiaId = user.academiaId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        // Aquí es donde estaban los errores. Usamos "as" para asegurar el tipo.
        session.user.id = token.id as string;
        session.user.rol = token.rol as Role;
        session.user.academiaId = token.academiaId as number;
      }
      return session;
    },
  },
// ...
  session: { strategy: "jwt" },
});