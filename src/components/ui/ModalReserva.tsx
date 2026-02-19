"use client";

import { useState } from "react";
import { crearReserva } from "@/lib/actions";
import { Button } from "./Button";
import { Input } from "./Input";
import { InfoBox } from "./InfoBox";

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h3 className="text-xl font-bold mb-2">Reservar {recurso.nombre}</h3>
        <p className="text-gray-600 mb-4 text-sm">Selecciona el rango horario para tu reserva.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Inicio" name="inicio" type="datetime-local" min={ahora} required />
          <Input label="Fin" name="fin" type="datetime-local" min={ahora} required />

          {error && <InfoBox>{error}</InfoBox>}

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1" isLoading={isLoading}>
              Confirmar Reserva
            </Button>
            <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}