"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FormGroup, ActionGroup } from "@/components/ui/Layouts";

interface ModalEdicionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (nombre: string, tipo: string, capacidad: number) => Promise<void>; // Ahora es una promesa
  initialNombre: string;
  initialTipo: string;
  initialCapacidad: number;
}

export function ModalEdicion({ 
  isOpen, 
  onClose, 
  onConfirm, 
  initialNombre, 
  initialTipo, 
  initialCapacidad 
}: ModalEdicionProps) {
  const [nombre, setNombre] = useState(initialNombre);
  const [tipo, setTipo] = useState(initialTipo);
  const [capacidad, setCapacidad] = useState(initialCapacidad);
  const [isLoading, setIsLoading] = useState(false); // Para feedback visual

  const opcionesTipo = [
    { value: "CABINA", label: "Cabina" },
    { value: "AULA", label: "Aula" },
    { value: "INSTRUMENTO", label: "Instrumento" },
  ];

  const handleGuardar = async () => {
    setIsLoading(true);
    // Simplemente ejecutamos la acción del padre. 
    // Los toasts y el cierre se manejan allá según el resultado real.
    await onConfirm(nombre, tipo, capacidad);
    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Recurso">
      <FormGroup>
        <Input 
          label="Nombre" 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
          disabled={isLoading}
        />
        
        <Select 
          label="Tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          options={opcionesTipo}
          disabled={isLoading}
        />

        <Input 
          label="Capacidad" 
          type="number" 
          value={capacidad} 
          onChange={(e) => setCapacidad(Number(e.target.value))} 
          disabled={isLoading}
        />
      </FormGroup>

      <ActionGroup>
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button onClick={handleGuardar} isLoading={isLoading}>
          Guardar
        </Button>
      </ActionGroup>
    </Modal>
  );
}