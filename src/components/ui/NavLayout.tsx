import React from "react";

export function NavContainer({ children }: { children: React.ReactNode }) {
  return (
    // Cambiamos el fondo al azul institucional y agregamos un borde dorado sutil abajo
    <nav className="bg-[#0D2C6B] border-b-4 border-[#F4C430] py-4 mb-8 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {children}
      </div>
    </nav>
  );
}

export function NavGroup({ children }: { children: React.ReactNode }) {
  // Mantenemos el agrupamiento pero aseguramos que el texto por defecto sea blanco para que resalte
  return (
    <div className="flex items-center gap-6 text-white font-medium">
      {children}
    </div>
  );
}