import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  children: React.ReactNode;
}

export function Button({ isLoading, variant = "primary", children, ...props }: ButtonProps) {
  // Mapeamos la variante a la clase de CSS correspondiente
  const variants = {
    primary: "btn-academia",
    secondary: "btn-secondary",
    danger: "btn-danger",
  };

  return (
    <button 
      {...props} 
      disabled={isLoading || props.disabled}
      className={variants[variant]}
    >
      {isLoading ? "Cargando..." : children}
    </button>
  );
}