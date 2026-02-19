import React from "react";

export function NavContainer({ children }: { children: React.ReactNode }) {
  return (
    // Agregamos bg-white, border-b y padding para que parezca una Navbar real
    <nav className="border-b border-gray-100 bg-white py-4 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {children}
      </div>
    </nav>
  );
}

export function NavGroup({ children }: { children: React.ReactNode }) {
  // Centraliza el agrupamiento de elementos (izquierda o derecha)
  return (
    <div className="flex items-center gap-6">
      {children}
    </div>
  );
}