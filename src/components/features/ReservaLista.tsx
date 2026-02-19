//Vista del alumno
"use client";

import { useState } from "react"; // Necesario para el estado del modal
import { TextBold, TextSecondary } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { ActionGroup } from "@/components/ui/Layouts"; 
import { ListItem } from "@/components/ui/Listado"; 
import { eliminarReserva } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ModalConfirmacion } from "@/components/features/ModalConfirmacion"; // Tu componente

interface ReservaConRecurso {
  id: number;
  inicio: Date;
  fin: Date;
  recurso: {
    nombre: string;
    tipo: string;
  };
}

interface ReservaListaProps {
  reservas: ReservaConRecurso[];
}

export function ReservaLista({ reservas }: ReservaListaProps) {
  const router = useRouter();
  
  // Estados para controlar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservaIdParaEliminar, setReservaIdParaEliminar] = useState<number | null>(null);

  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // 1. Esta función solo abre el modal y guarda el ID
  const handleAbrirConfirmacion = (id: number) => {
    setReservaIdParaEliminar(id);
    setIsModalOpen(true);
  };

  // 2. Esta función es la que realmente ejecuta el borrado
  const handleConfirmarEliminacion = async () => {
    if (!reservaIdParaEliminar) return;

    const result = await eliminarReserva(reservaIdParaEliminar);
    if (result.success) {
      toast.success("Reserva cancelada correctamente");
      router.refresh();
    } else {
      toast.error(result.error || "No se pudo cancelar la reserva");
    }
    
    setIsModalOpen(false); // Cerramos el modal al terminar
    setReservaIdParaEliminar(null);
  };

  return (
    <div className="mt-4">
      {reservas.map((reserva) => (
        <ListItem key={reserva.id}>
          <div>
            <TextBold>{reserva.recurso.nombre}</TextBold>
            <TextSecondary>{reserva.recurso.tipo}</TextSecondary>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-right">
              <TextBold>{formatearFecha(reserva.inicio)}</TextBold>
              <TextSecondary>Hasta: {formatearFecha(reserva.fin)}</TextSecondary>
            </div>
            
            <ActionGroup>
              <Button 
                variant="danger" 
                onClick={() => handleAbrirConfirmacion(reserva.id)} // Cambiado
              >
                Cancelar
              </Button>
            </ActionGroup>
          </div>
        </ListItem>
      ))}

      {/* Tu Modal de Confirmación integrado */}
      <ModalConfirmacion 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmarEliminacion}
        title="Cancelar Reserva"
        message="¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer."
      />
    </div>
  );
}