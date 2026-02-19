import { DefaultSession } from "next-auth"
import { Role } from "@prisma/client"

declare module "next-auth" {
  interface User {
    rol: Role; // Usamos 'rol' para que coincida con tu Prisma
    academiaId: number;
  }

  interface Session {
    user: {
      id: string;
      rol: Role;
      academiaId: number;
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    rol: Role;
    academiaId: number;
  }
}