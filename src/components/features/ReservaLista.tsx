//Vista del alumno
"use client";

import { TextBold, TextSecondary } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { ActionGroup } from "@/components/ui/Layouts"; 
import { ListItem } from "@/components/ui/Listado"; 
import { eliminarReserva } from "@/lib/actions";
import { useRouter } from "next/navigation";

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

  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const handleCancelar = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas cancelar esta reserva?")) {
      const result = await eliminarReserva(id);
      if (result.success) {
        router.refresh();
      } else {
        alert(result.error);
      }
    }
  };

  return (
    <div className="mt-4">
      {reservas.map((reserva) => (
        <ListItem key={reserva.id}>
          {/* Información del Recurso */}
          <div>
            <TextBold>{reserva.recurso.nombre}</TextBold>
            <TextSecondary>{reserva.recurso.tipo}</TextSecondary>
          </div>
          
          {/* Información del Horario y Acción */}
          <div className="flex items-center gap-8">
            <div className="text-right">
              <TextBold>{formatearFecha(reserva.inicio)}</TextBold>
              <TextSecondary>Hasta: {formatearFecha(reserva.fin)}</TextSecondary>
            </div>
            
            <ActionGroup>
              <Button 
                variant="danger" 
                onClick={() => handleCancelar(reserva.id)}
              >
                Cancelar
              </Button>
            </ActionGroup>
          </div>
        </ListItem>
      ))}
    </div>
  );
}