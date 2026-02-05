//Es una ruta especial de Next.js que captura todas las peticiones de autenticación
//Para que Auth.js pueda manejar las peticiones de inicio y cierre de sesión, necesitamos exponer sus "handlers".

import { handlers } from "@/auth"
export const { GET, POST } = handlers