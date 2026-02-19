import { auth } from "@/auth"

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isPrivateRoute = nextUrl.pathname.startsWith("/dashboard") || 
                         nextUrl.pathname.startsWith("/reservas");
  const isAuthRoute = nextUrl.pathname.startsWith("/login") || 
                      nextUrl.pathname.startsWith("/register");

  // Si es ruta privada y no está logueado -> al Login
  if (isPrivateRoute && !isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  // Si está logueado e intenta ir al login -> al Dashboard
  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", nextUrl));
  }
})