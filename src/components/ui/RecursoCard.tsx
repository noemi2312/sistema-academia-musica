"use client";

import { useState } from "react";
import { TextSecondary } from "./Typography";
import { Button } from "./Button";
import { ModalConfirmacion } from "./ModalConfirmacion";
import { ModalEdicion } from "./ModalEdicion";
import { eliminarRecurso, editarRecurso } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface RecursoCardProps {
  id: number;
  nombre: string;
  tipo: string;
  capacidad: number; // 1. Agregamos capacidad a la interfaz
}

export function RecursoCard({ id, nombre, tipo, capacidad }: RecursoCardProps) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Acción para eliminar
  const handleEliminar = async () => {
    await eliminarRecurso(id);
    setIsDeleteOpen(false);
    router.refresh();
  };

  // 2. Actualizamos para recibir y enviar la nueva capacidad
  const handleEditar = async (nuevoNombre: string, nuevoTipo: string, nuevaCapacidad: number) => {
    await editarRecurso(id, nuevoNombre, nuevoTipo, nuevaCapacidad);
    setIsEditOpen(false);
    router.refresh();
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm flex flex-col justify-between gap-4">
      <div>
        <p className="font-bold text-blue-900">{nombre}</p>
        {/* 3. Mostramos la capacidad en la tarjeta */}
        <TextSecondary>{tipo} — Capacidad: {capacidad}</TextSecondary>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" onClick={() => setIsEditOpen(true)}>
          Editar
        </Button>
        <Button variant="danger" onClick={() => setIsDeleteOpen(true)}>
          Borrar
        </Button>
      </div>

      <ModalConfirmacion 
        isOpen={isDeleteOpen} 
        onClose={() => setIsDeleteOpen(false)} 
        onConfirm={handleEliminar} 
        title="¿Eliminar recurso?" 
        message={`¿Estás seguro de que quieres borrar "${nombre}"?`} 
      />

      {/* 4. Le pasamos los datos iniciales al modal de edición */}
      <ModalEdicion 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        onConfirm={handleEditar} 
        initialNombre={nombre} 
        initialTipo={tipo} 
        initialCapacidad={capacidad} 
      />
    </div>
  );
}