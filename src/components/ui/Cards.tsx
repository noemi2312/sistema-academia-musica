import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    // Mantenemos tu diseño con el borde superior azul UAP
    <div className={`bg-white rounded-xl shadow-md border border-gray-100 border-t-4 border-t-[#0D2C6B] p-6 transition-transform hover:shadow-lg ${className}`}>
      {children}
    </div>
  );
}

/**
 * Centramos el título de la tarjeta para que coincida con el resto del landing.
 */
export function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-bold text-[#0D2C6B] mb-6 text-center w-full">
      {children}
    </h2>
  );
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 space-y-1 text-center">{children}</div>;
}