import React from "react";
import { Card, CardTitle } from "./Cards";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md animate-in zoom-in duration-200 relative">
        <Card>
          <div className="flex justify-between items-start">
            <CardTitle>{title}</CardTitle>
            {/* Usamos onClose aquí para que el usuario pueda salir del modal */}
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold leading-none"
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>
          {children}
        </Card>
      </div>
    </div>
  );
}