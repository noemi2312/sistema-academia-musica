"use client";

import { useSession } from "next-auth/react"; // Hook para el cliente
import { Container, DashboardLayout, ActionGroup, FormGroup } from "@/components/ui/Layouts";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextSecondary } from "@/components/ui/Typography";
import { useRouter } from "next/navigation";
import { crearRecurso } from "@/lib/actions";

export default function NuevoRecursoPage() {
  const router = useRouter();
  const { data: session } = useSession(); // Obtenemos la sesión en el cliente
  
  const handleAction = async (formData: FormData) => {
    const academiaId = session?.user?.academiaId;

    if (!academiaId) {
      alert("Error: No se pudo identificar la academia. Reintenta loguearte.");
      return;
    }

    // Ejecutamos la acción
    const resultado = await crearRecurso(formData, academiaId);

    // Si la acción devuelve un error, lo mostramos
    if (resultado?.error) {
      alert(resultado.error);
    } else {
      // Si todo salió bien, la acción misma debería redirigir, 
      // pero forzamos la vuelta al dashboard aquí por seguridad.
      router.push("/dashboard");
      router.refresh(); // Refrescamos para ver los cambios
    }
  };

  return (
    <DashboardLayout>
      <Container>
        <DashboardCard title="Registrar Nuevo Recurso">
          <TextSecondary>Ingresa los detalles para tu academia.</TextSecondary>
          
          <form action={handleAction}>
            <FormGroup>
              <Input name="nombre" label="Nombre del Recurso" placeholder="Ej: Sala de Piano A" required />
              
              <div className="flex flex-col gap-1">
                <TextSecondary>Tipo de Recurso</TextSecondary>
                <select name="tipo" className="input-academia" required>
                  <option value="SALA">Sala</option>
                  <option value="INSTRUMENTO">Instrumento</option>
                </select>
              </div>

              <Input name="capacidad" label="Capacidad Máxima" type="number" min="1" required />
            </FormGroup>
            
            <ActionGroup>
              <Button type="submit">Guardar Recurso</Button>
              <Button type="button" variant="secondary" onClick={() => router.back()}>
                Cancelar
              </Button>
            </ActionGroup>
          </form>
        </DashboardCard>
      </Container>
    </DashboardLayout>
  );
}