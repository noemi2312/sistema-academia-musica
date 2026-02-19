"use client";

import { TextBold, TextSecondary } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { ActionGroup } from "@/components/ui/Layouts";
import { ListItem } from "@/components/ui/Listado"; 
import { eliminarReserva } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface ReservaConDetalles {
  id: number;
  inicio: Date;
  fin: Date;
  recurso: {
    nombre: string;
    tipo: string;
  };
  usuario: {
    nombre: string | null;
    email: string | null;
  };
}

interface ReservaAdminProps {
  reservas: ReservaConDetalles[];
}

export function ReservaListaAdmin({ reservas }: ReservaAdminProps) {
  const router = useRouter();

  const handleEliminar = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta reserva como administrador?")) {
      await eliminarReserva(id);
      router.refresh();
    }
  };

  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="mt-4">
      {reservas.map((reserva) => (
        <ListItem key={reserva.id}>
          {/* Información detallada para el Admin */}
          <div>
            <TextBold>{reserva.recurso.nombre}</TextBold>
            <TextSecondary>
              Usuario: {reserva.usuario.nombre ?? "Sin nombre"} ({reserva.usuario.email})
            </TextSecondary>
          </div>
          
          {/* Estructura de tiempo y acciones idéntica a la vista de usuario */}
          <div className="flex items-center gap-8">
            <div className="text-right">
              <TextBold>{formatearFecha(reserva.inicio)}</TextBold>
              <TextSecondary>Hasta: {formatearFecha(reserva.fin)}</TextSecondary>
            </div>
            
            <ActionGroup>
              <Button 
                variant="danger" 
                onClick={() => handleEliminar(reserva.id)}
              >
                Eliminar
              </Button>
            </ActionGroup>
          </div>
        </ListItem>
      ))}
    </div>
  );
}