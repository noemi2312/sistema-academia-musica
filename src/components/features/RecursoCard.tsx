"use client";

import { useState } from "react";
import { TextSecondary, TextBold } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { ActionGroup } from "@/components/ui/Layouts";
import { Card, CardContent } from "@/components/ui/Cards"; // Reutilización de tu UI
import { ModalConfirmacion } from "./ModalConfirmacion";
import { ModalEdicion } from "./ModalEdicion";
import { ModalReserva } from "./ModalReserva"; 
import { eliminarRecurso, editarRecurso } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface RecursoCardProps {
  id: number;
  nombre: string;
  tipo: string;
  capacidad: number;
  isAdmin?: boolean;
  usuarioId?: number; 
  academiaId?: number;
}

export function RecursoCard({ 
  id, 
  nombre, 
  tipo, 
  capacidad, 
  isAdmin = false, 
  usuarioId, 
  academiaId 
}: RecursoCardProps) {
  const router = useRouter();
  
  // Estados para el control de los modales
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isReservaOpen, setIsReservaOpen] = useState(false);

  // Handlers de acciones de servidor
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
    <Card className="flex flex-col justify-between h-full">
      {/* Información del recurso delegada a la UI */}
      <CardContent>
        <TextBold>{nombre}</TextBold>
        <TextSecondary>{tipo} — Capacidad: {capacidad}</TextSecondary>
      </CardContent>
      
      {/* Acciones según el rol */}
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
        <Button onClick={() => setIsReservaOpen(true)}>
          Reservar
        </Button>
      )}

      {/* Renderizado condicional de Modales Administrativos */}
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

      {/* Modal de Reserva para Alumnos */}
      {isReservaOpen && usuarioId && academiaId && (
        <ModalReserva 
          recurso={{ id, nombre }}
          usuarioId={usuarioId}
          academiaId={academiaId}
          onClose={() => {
            setIsReservaOpen(false);
            router.refresh();
          }}
        />
      )}
    </Card>
  );
}