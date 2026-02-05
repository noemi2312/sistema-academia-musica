//Evitará que alguien entre a ver las salas de música si no está logueado.

import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  // Definir qué rutas son privadas
  const isPrivateRoute = nextUrl.pathname.startsWith("/dashboard") || 
                         nextUrl.pathname.startsWith("/reservas");

  if (isPrivateRoute && !isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }
})

export const config = {
  // Aplicar el middleware a todas las rutas excepto archivos estáticos y api/auth
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}