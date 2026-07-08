import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user?.rol === "ADMIN";
      
      // Definimos rutas de administrador que requieren validación extra
      const isDashboardAdminRoute = nextUrl.pathname.startsWith("/dashboard/reservas/admin");
      
      // Rutas privadas que requieren autenticación
      const isPrivateRoute = nextUrl.pathname.startsWith("/dashboard");
      
      // Rutas de autenticación
      const isAuthRoute = nextUrl.pathname.startsWith("/login") || 
                          nextUrl.pathname.startsWith("/register"); 

      //Protección de acceso por rol: Si intenta entrar a admin sin ser ADMIN, bloqueamos
      if (isDashboardAdminRoute && !isAdmin) {
        return false; // Dispara redirección automática al login
      }                    
      
      //Protección de rutas privadas: Si no está logueado, bloqueamos
      if (isPrivateRoute) {
        return isLoggedIn;
      }

      //Si ya está logueado, evitamos que vuelva a entrar al login/registro
      if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true; // Acceso público permitido
    },
  },
  providers: [],
} satisfies NextAuthConfig;