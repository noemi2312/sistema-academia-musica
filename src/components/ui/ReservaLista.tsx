"use client";

import { TextBold, TextSecondary } from "./Typography";
import { Button } from "./Button";
import { ActionGroup } from "./Layouts";
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
  
  const formatearFecha = (fecha: Date) => {
    return new Date(fecha).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

    const router = useRouter();

    const handleCancelar = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas cancelar esta reserva?")) {
        const result = await eliminarReserva(id);
        if (result.success) {
        router.refresh(); // Refresca la lista automáticamente
        } else {
        alert(result.error);
        }
    }
    };

  return (
    <div className="space-y-4 mt-4">
      {reservas.map((reserva) => (
        <div 
          key={reserva.id} 
          className="p-4 border rounded-lg flex justify-between items-center bg-white shadow-sm hover:border-blue-300 transition-all"
        >
          {/* Envolvemos en divs para aplicar colores y tamaños sin tocar el componente base */}
          <div>
            <div className="text-blue-700">
              <TextBold>{reserva.recurso.nombre}</TextBold>
            </div>
            <div className="text-xs uppercase opacity-70">
              <TextSecondary>{reserva.recurso.tipo}</TextSecondary>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-right">
              <div className="text-gray-800">
                <TextBold>{formatearFecha(reserva.inicio)}</TextBold>
              </div>
              <div className="text-xs text-gray-500">
                <TextSecondary>Hasta: {formatearFecha(reserva.fin)}</TextSecondary>
              </div>
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
        </div>
      ))}
    </div>
  );
}