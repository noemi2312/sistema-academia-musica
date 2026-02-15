import React from "react";

/**
 * 1. Para Login y Registro (Todo centrado en pantalla)
 */
export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      {children}
    </div>
  );
}

/**
 * 2. Para el Dashboard (Contenido empieza arriba con scroll natural)
 */
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {children}
    </div>
  );
}

/**
 * 3. Para apilar elementos con espacio (Formularios)
 */
interface FormStackProps {
  children: React.ReactNode;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
}

export function FormStack({ children, onSubmit }: FormStackProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {children}
    </form>
  );
}

/**
 * 4. Para centrar links de navegación al final de un cuadro
 */
export function AuthFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 text-center">{children}</div>;
}

/**
 * 5. Margen y ancho máximo para el Dashboard
 */
export function Container({ children }: { children: React.ReactNode }) {
  return <main className="max-w-7xl mx-auto py-10 px-4 w-full">{children}</main>;
}

export function FormGroup({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 space-y-4">{children}</div>;
}

export function ActionGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-4 mt-6">{children}</div>;
}