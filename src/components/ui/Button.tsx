import React from "react";

// Agregamos variant a la interfaz
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary"; // Definimos los tipos permitidos
}

export function Button({ isLoading, variant = "primary", children, ...props }: ButtonProps) {
  const variantClass = variant === "secondary" ? "btn-secondary" : "btn-academia";

  return (
    <button 
      {...props} 
      disabled={isLoading || props.disabled}
      className={variantClass}
    >
      {isLoading ? "Cargando..." : children}
    </button>
  );
}