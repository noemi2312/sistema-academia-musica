"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FormGroup, ActionGroup } from "@/components/ui/Layouts";
import { toast } from "react-hot-toast";

interface ModalEdicionProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (nombre: string, tipo: string, capacidad: number) => void;
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

  const opcionesTipo = [
    { value: "CABINA", label: "Cabina" },
    { value: "AULA", label: "Aula" },
    { value: "INSTRUMENTO", label: "Instrumento" },
  ];

  const handleGuardar = () => {
    try {
      onConfirm(nombre, tipo, capacidad);
      toast.success("Cambios guardados correctamente");
    } catch {
      // Al omitir el parámetro del catch, evitamos el error de ESLint de variable no usada
      toast.error("Error al intentar guardar los cambios");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Recurso">
      <FormGroup>
        <Input 
          label="Nombre" 
          value={nombre} 
          onChange={(e) => setNombre(e.target.value)} 
        />
        
        <Select 
          label="Tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          options={opcionesTipo}
        />

        <Input 
          label="Capacidad" 
          type="number" 
          value={capacidad} 
          onChange={(e) => setCapacidad(Number(e.target.value))} 
        />
      </FormGroup>

      <ActionGroup>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleGuardar}>
          Guardar
        </Button>
      </ActionGroup>
    </Modal>
  );
}