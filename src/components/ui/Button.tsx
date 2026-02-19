import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "danger";
  children: React.ReactNode;
}

export function Button({ isLoading, variant = "primary", children, className = "", ...props }: ButtonProps) {
  /**
   * 1. Clases base: 
   * - 'whitespace-nowrap' evita que el texto se divida en dos líneas.
   * - Eliminamos 'w-full' de la base para que el botón se adapte a su contenido 
   * a menos que le pases 'w-full' por className (como en el Landing).
   */
  const baseStyles = "px-6 py-2 rounded-md font-medium transition-all duration-200 flex items-center justify-center disabled:opacity-50 active:scale-95 whitespace-nowrap";

  /**
   * 2. Mapeamos las variantes con los colores institucionales de la UAP.
   */
  const variants = {
    // Azul Institucional UAP
    primary: "bg-[#0D2C6B] text-white hover:bg-[#163a85] shadow-sm",
    
    // Dorado Institucional UAP
    secondary: "bg-[#F4C430] text-[#0D2C6B] hover:bg-[#e5b62d] border border-[#d4a928] shadow-sm",
    
    // Variante de peligro
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200",
  };

  return (
    <button 
      {...props} 
      disabled={isLoading || props.disabled}
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