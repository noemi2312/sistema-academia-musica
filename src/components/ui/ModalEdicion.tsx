"use client";

import { useState } from "react";
import { Button } from "./Button";
import { TitleSection } from "./Typography";
import { FormGroup } from "./Layouts";

interface ModalEdicionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (nombre: string, tipo: string, capacidad: number) => void;
  initialNombre: string;
  initialTipo: string;
  initialCapacidad: number;
}

export function ModalEdicion({ isOpen, onClose, onConfirm, initialNombre, initialTipo, initialCapacidad }: ModalEdicionProps) {
  const [nombre, setNombre] = useState(initialNombre);
  const [tipo, setTipo] = useState(initialTipo);
  const [capacidad, setCapacidad] = useState(initialCapacidad);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
        <TitleSection>Editar Recurso</TitleSection>
        
        <div className="flex flex-col gap-4 mb-6">
          <FormGroup>
            <label className="text-sm font-medium">Nombre</label>
            <input className="w-full p-2 border rounded-md" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </FormGroup>

          <FormGroup>
            <label className="text-sm font-medium">Tipo</label>
            <select className="w-full p-2 border rounded-md" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="CABINA">Cabina</option>
              <option value="AULA">Aula</option>
              <option value="INSTRUMENTO">Instrumento</option>
            </select>
          </FormGroup>

          <FormGroup>
            <label className="text-sm font-medium">Capacidad</label>
            <input 
              type="number" 
              className="w-full p-2 border rounded-md" 
              value={capacidad} 
              onChange={(e) => setCapacidad(Number(e.target.value))} 
            />
          </FormGroup>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => onConfirm(nombre, tipo, capacidad)}>Guardar</Button>
        </div>
      </div>
    </div>
  );
}