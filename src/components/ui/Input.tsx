import React from "react";

// Definimos la interfaz que TypeScript reclamaba
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input 
        {...props} 
        className="input-academia" 
      />
    </div>
  );
}