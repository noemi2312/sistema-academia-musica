"use client";

import { useState } from "react";
import { TextSecondary, TextBold } from "./Typography"; // Usamos tus tipografías
import { Button } from "./Button";
import { ActionGroup } from "./Layouts"; // Usamos tu layout para los botones
import { ModalConfirmacion } from "./ModalConfirmacion";
import { ModalEdicion } from "./ModalEdicion";
import { eliminarRecurso, editarRecurso } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface RecursoCardProps {
  id: number;
  nombre: string;
  tipo: string;
  capacidad: number;
  isAdmin?: boolean;
}

export function RecursoCard({ id, nombre, tipo, capacidad, isAdmin = false }: RecursoCardProps) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEliminar = async () => {
    await eliminarRecurso(id);
    setIsDeleteOpen(false);
    router.refresh();
  };

  const handleEditar = async (nuevoNombre: string, nuevoTipo: string, nuevaCapacidad: number) => {
    await editarRecurso(id, nuevoNombre, nuevoTipo, nuevaCapacidad);
    setIsEditOpen(false);
    router.refresh();
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <div className="mb-4">
        <TextBold>{nombre}</TextBold>
        <TextSecondary>{tipo} — Capacidad: {capacidad}</TextSecondary>
      </div>
      
      {isAdmin ? (
        <ActionGroup>
          <Button variant="secondary" onClick={() => setIsEditOpen(true)}>
            Editar
          </Button>
          <Button variant="danger" onClick={() => setIsDeleteOpen(true)}>
            Borrar
          </Button>
        </ActionGroup>
      ) : (
        <Button onClick={() => alert("Próximamente: Formulario de Reserva")}>
          Reservar
        </Button>
      )}

      {isAdmin && (
        <>
          <ModalConfirmacion 
            isOpen={isDeleteOpen} 
            onClose={() => setIsDeleteOpen(false)} 
            onConfirm={handleEliminar} 
            title="¿Eliminar recurso?" 
            message={`¿Estás seguro de borrar "${nombre}"?`} 
          />
          <ModalEdicion 
            isOpen={isEditOpen} 
            onClose={() => setIsEditOpen(false)} 
            onConfirm={handleEditar} 
            initialNombre={nombre} 
            initialTipo={tipo} 
            initialCapacidad={capacidad} 
          />
        </>
      )}
    </div>
  );
}