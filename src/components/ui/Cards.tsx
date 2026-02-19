import React from "react";

// prop opcional para padding o altura
interface CardProps {
  children: React.ReactNode;
  className?: string; // ajustes estructurales mínimos
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {children}
    </div>
  );
}

//título para paneles grandes
export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-bold text-gray-800 mb-6">{children}</h2>;
}

//contenedor para separar el texto de los botones en tarjetas pequeñas
export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 space-y-1">{children}</div>;
}