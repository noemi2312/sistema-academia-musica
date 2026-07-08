"use client";

import { useState } from "react";
import { TextSecondary, TextBold } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { ActionGroup } from "@/components/ui/Layouts";
import { ModalConfirmacion } from "./ModalConfirmacion";
import { ModalEdicion } from "./ModalEdicion";
import { ModalReserva } from "./ModalReserva"; 
import { eliminarRecurso, editarRecurso } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface RecursoCardProps {
  id: number;
  nombre: string;
  tipo: string;
  capacidad: number;
  isAdmin?: boolean;
  usuarioId?: number; 
  academiaId?: number;
}

export function RecursoCard({ id, nombre, tipo, capacidad, isAdmin = false, usuarioId, academiaId }: RecursoCardProps) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isReservaOpen, setIsReservaOpen] = useState(false);

  const handleEliminar = async () => {
    const resultado = await eliminarRecurso(id);
    
    if (resultado?.error) {
      toast.error(resultado.error);
    } else {
      toast.success("Recurso eliminado");
      setIsDeleteOpen(false);
      router.refresh();
    }
  };

  const handleEditar = async (nuevoNombre: string, nuevoTipo: string, nuevaCapacidad: number) => {
    const resultado = await editarRecurso(id, nuevoNombre, nuevoTipo, nuevaCapacidad);
    
    if (resultado?.error) {
      toast.error(resultado.error);
      return; 
    }

    if (resultado?.success) {
      toast.success("¡Cambios guardados!");
      setIsEditOpen(false);
      router.refresh();
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <div className="mb-4">
        <TextBold>{nombre}</TextBold>
        <TextSecondary>{tipo} — Capacidad: {capacidad}</TextSecondary>
      </div>
      
      {/* Contenedor flexible para mostrar botones */}
      <div className="flex flex-col gap-2">
        {isAdmin && (
          <ActionGroup>
            <Button variant="secondary" onClick={() => setIsEditOpen(true)}>
              Editar
            </Button>
            <Button variant="danger" onClick={() => setIsDeleteOpen(true)}>
              Borrar
            </Button>
          </ActionGroup>
        )}
        
        <Button className="w-full" onClick={() => setIsReservaOpen(true)}>
          Reservar
        </Button>
      </div>

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
    </div>
  );
}