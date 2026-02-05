import { signOut } from "@/auth";

export function Navbar({ userName }: { userName?: string | null }) {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
        <h1 className="text-xl font-bold text-blue-600">Sistema de Gestión de Salas</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">Hola, <strong>{userName}</strong></span>
          <form action={async () => { "use server"; await signOut(); }}>
            <button className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded-md hover:bg-red-100 transition-colors">
              Cerrar Sesión
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}