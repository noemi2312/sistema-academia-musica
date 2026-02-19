"use client";

import { useState } from "react";
import { crearReserva } from "@/lib/actions";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { InfoBox } from "@/components/ui/InfoBox";
import { TextSecondary } from "@/components/ui/Typography";
import { ActionGroup, FormGroup } from "@/components/ui/Layouts";

interface ModalReservaProps {
  recurso: { id: number; nombre: string };
  usuarioId: number;
  academiaId: number;
  onClose: () => void;
}

export function ModalReserva({ recurso, usuarioId, academiaId, onClose }: ModalReservaProps) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    formData.append("recursoId", recurso.id.toString());

    const result = await crearReserva(formData, usuarioId, academiaId);

    if (result && "error" in result) {
      setError(result.error);
      setIsLoading(false);
    } else {
      alert("¡Reserva realizada con éxito!");
      onClose();
    }
  }
  
  const ahora = new Date().toISOString().slice(0, 16);

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title={`Reservar ${recurso.nombre}`}
    >
      <form onSubmit={handleSubmit}>
        {/* Agregamos FormGroup para que el texto y los inputs tengan el mismo aire */}
        <FormGroup>
          <TextSecondary>
            Selecciona el rango horario para tu reserva.
          </TextSecondary>

          <Input 
            label="Inicio" 
            name="inicio" 
            type="datetime-local" 
            min={ahora} 
            required 
          />
          <Input 
            label="Fin" 
            name="fin" 
            type="datetime-local" 
            min={ahora} 
            required 
          />
        </FormGroup>

        {error && <InfoBox>{error}</InfoBox>}

        <ActionGroup>
          <Button 
            type="submit" 
            className="flex-1" 
            isLoading={isLoading}
          >
            Confirmar Reserva
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose} 
            disabled={isLoading}
          >
            Cancelar
          </Button>
        </ActionGroup>
      </form>
    </Modal>
  );
}