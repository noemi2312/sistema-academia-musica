import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  children: React.ReactNode;
}

export function Button({ isLoading, variant = "primary", children, className = "", ...props }: ButtonProps) {
  // 1. Clases base para todos los botones (el px-6 es la clave del ancho)
  const baseStyles = "px-6 py-2 rounded-md font-medium transition-all duration-200 flex items-center justify-center disabled:opacity-50";

  // 2. Mapeamos las variantes (manteniendo tus nombres pero agregando el color)
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
  };

  return (
    <button 
      {...props} 
      disabled={isLoading || props.disabled}
      // Combinamos las clases base + la variante + cualquier clase extra que pases
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Cargando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}