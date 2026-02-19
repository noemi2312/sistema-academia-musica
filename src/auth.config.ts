import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    //la lógica de protección que estaba en el middleware
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isPrivateRoute = nextUrl.pathname.startsWith("/dashboard") || 
                             nextUrl.pathname.startsWith("/reservas");
      const isAuthRoute = nextUrl.pathname.startsWith("/login") || 
                          nextUrl.pathname.startsWith("/register");

      if (isPrivateRoute) {
        if (isLoggedIn) return true;
        return false; // Redirige al login
      }

      if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
  },
  providers: [], // Los proveedores se configuran en auth.ts
} satisfies NextAuthConfig;