import React from "react";

export function NavContainer({ children }: { children: React.ReactNode }) {
  // Centraliza el espaciado y la alineación de la barra superior
  return (
    <nav className="flex justify-between items-center mb-6">
      {children}
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