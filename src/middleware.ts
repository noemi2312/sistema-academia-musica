import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// motor de NextAuth con la configuración liviana
export default NextAuth(authConfig).auth;

export const config = {
  // Este matcher es VITAL para que el middleware no intente procesar
  // archivos estáticos, lo que ayuda a reducir la carga de la Edge Function
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};