import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      
      // rutas privadas
      const isPrivateRoute = nextUrl.pathname.startsWith("/dashboard") || 
                             nextUrl.pathname.startsWith("/reservas");
      
      // rutas de autenticación
      const isAuthRoute = nextUrl.pathname.startsWith("/login") || 
                          nextUrl.pathname.startsWith("/register");

      // Si intenta entrar a una ruta privada y NO está logueado:
      if (isPrivateRoute) {
        if (isLoggedIn) return true;
        return false; // Al retornar false, NextAuth lo manda automáticamente al signIn definido arriba (/login)
      }

      // Si está logueado e intenta ir al login o registro:
      if (isAuthRoute && isLoggedIn) {
        // redirigir a la URL del dashboard
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true; // Para el resto de las rutas (públicas)
    },
  },
  providers: [], // Vacío aquí, se llena en auth.ts
} satisfies NextAuthConfig;