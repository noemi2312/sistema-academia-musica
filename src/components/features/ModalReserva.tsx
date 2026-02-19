"use client";

import { useState } from "react";
import { crearReserva } from "@/lib/actions";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { InfoBox } from "@/components/ui/InfoBox";
import { TextSecondary } from "@/components/ui/Typography";
import { ActionGroup, FormGroup } from "@/components/ui/Layouts";
import { toast } from "react-hot-toast"; 

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
    const inicioStr = formData.get("inicio") as string;
    const finStr = formData.get("fin") as string;

    const inicio = new Date(inicioStr);
    const fin = new Date(finStr);
    const ahora = new Date();

    // --- BLINDAJE EN EL CLIENTE ---
    
    // 1. Validación: No reservar en el pasado
    if (inicio < ahora) {
      setError("No puedes realizar una reserva en una fecha u hora pasada.");
      setIsLoading(false);
      return;
    }

    // 2. Validación: Orden cronológico
    if (inicio >= fin) {
      setError("La hora de finalización debe ser posterior a la de inicio.");
      setIsLoading(false);
      return;
    }

    // 3. Validación: Máximo 40 minutos (Requisito de Progra 3)
    const diferenciaMs = fin.getTime() - inicio.getTime();
    const diferenciaMinutos = diferenciaMs / (1000 * 60);

    if (diferenciaMinutos > 40) {
      setError("La reserva no puede exceder los 40 minutos.");
      setIsLoading(false);
      return;
    }

    // Agregamos el ID del recurso al formData antes de enviarlo
    formData.append("recursoId", recurso.id.toString());

    try {
      // Llamada a la acción del servidor
      const result = await crearReserva(formData, usuarioId, academiaId);

      // Manejo de respuesta del servidor con discriminación de tipos
      if (result && 'error' in result) {
        setError(result.error);
        toast.error(result.error); 
        setIsLoading(false);
      } else if (result && 'success' in result) {
        toast.success("¡Reserva realizada con éxito!");
        onClose();
      }
    } catch (err) {
      console.error("Error al intentar crear la reserva:", err);
      setError("Ocurrió un error inesperado. Inténtalo de nuevo.");
      toast.error("Error de conexión con el servidor.");
      setIsLoading(false);
    }
  }
  
  // Mínimo permitido en el calendario (formato YYYY-MM-DDTHH:mm)
  const ahoraString = new Date().toISOString().slice(0, 16);

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title={`Reservar ${recurso.nombre}`}
    >
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <TextSecondary>
            Seleccioná el rango horario para tu reserva de <strong>{recurso.nombre}</strong>. 
            Recordá que el tiempo máximo es de 40 minutos.
          </TextSecondary>

          <Input 
            label="Fecha y Hora de Inicio" 
            name="inicio" 
            type="datetime-local" 
            min={ahoraString} 
            required 
            disabled={isLoading}
          />
          <Input 
            label="Fecha y Hora de Fin" 
            name="fin" 
            type="datetime-local" 
            min={ahoraString} 
            required 
            disabled={isLoading}
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