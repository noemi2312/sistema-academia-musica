# Sistema de Gestión - Academia de Música 🎹

Plataforma full-stack para la gestión de reservas de recursos, administración de usuarios y control de acceso institucional.

## 🚀 Stack Tecnológico
- **Frontend/Backend**: Next.js 14+ (App Router)
- **Base de Datos**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Autenticación**: Auth.js (NextAuth) con estrategia JWT
- **Testing**: Vitest

## 🧠 Justificación Técnica (Programación 4)

### Arquitectura de Base de Datos
Se optó por **PostgreSQL** sobre soluciones NoSQL debido a la fuerte naturaleza relacional del dominio. La integridad referencial es crítica para asegurar que las reservas estén siempre vinculadas a recursos y usuarios existentes, garantizando consistencia mediante transacciones ACID.

### Optimización y Performance
- **Connection Pooling**: Se implementó el uso de un Pooler (puerto 6543) para manejar eficientemente las conexiones a la base de datos serverless, evitando el agotamiento de recursos en producción.
- **Edge Runtime Optimization**: Se realizó una arquitectura de "Auth Config Splitting" para reducir el tamaño del Middleware, cumpliendo con el límite de 1MB de las Edge Functions de Vercel.
- **Server Components & Actions**: Se minimizó el uso de JavaScript en el cliente delegando la lógica de negocio y mutaciones al servidor.

### Seguridad y Autorización
- Implementación de **RBAC** (Role-Based Access Control) para diferenciar accesos entre Alumnos y Administradores de Academia.
- Hasheo de contraseñas mediante **BcryptJS**.
- Middleware de protección de rutas privadas.

### 🛡️ Lógica de Negocio Blindada
- **Algoritmo de Colisiones**: Se implementó una lógica de intersección temporal en el servidor para evitar solapamientos de reservas. La consulta utiliza una validación matemática de intervalos (`inicio < fin_nuevo AND fin > inicio_nuevo`) dentro de una transacción de base de datos para garantizar la disponibilidad absoluta del recurso.
- **Validaciones de Integridad en UI**: Los formularios de edición y reserva cuentan con "guardrails" en el cliente que impiden el envío de datos inconsistentes (ej. nombres vacíos o fechas pasadas), reduciendo la carga innecesaria en el servidor.

## 🧪 Testing
El proyecto cuenta con unit tests para validar la lógica crítica de autorización.
- Comando: `npm test`

## 🛠️ Instalación y Configuración
1. Clonar el repositorio.
2. Ejecutar `npm install`.
3. Configurar las variables de entorno en `.env` (`DATABASE_URL`, `AUTH_SECRET`).
4. Sincronizar la base de datos: `npx prisma db push`.