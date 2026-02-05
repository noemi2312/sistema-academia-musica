import React from "react";

// Esto es lo que faltaba: la definición de ButtonProps
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export function Button({ isLoading, children, ...props }: ButtonProps) {
  return (
    <button 
      {...props} 
      disabled={isLoading || props.disabled}
      className="btn-academia"
    >
      {isLoading ? "Cargando..." : children}
    </button>
  );
}