"use client";

import { useSession } from "next-auth/react"; 
import { Container, DashboardLayout, ActionGroup, FormGroup } from "@/components/ui/Layouts";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TextSecondary } from "@/components/ui/Typography";
import { useRouter } from "next/navigation";
import { crearRecurso } from "@/lib/actions";
import { useEffect } from "react";

export default function NuevoRecursoPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // EFECTO DE SEGURIDAD: Si no es ADMIN, fuera de aquí
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user?.rol !== "ADMIN") {
      // Si está logueado pero es Alumno, lo mandamos al dashboard
      router.push("/dashboard");
    }
  }, [session, status, router]);

  const handleAction = async (formData: FormData) => {
    const academiaId = session?.user?.academiaId;

    if (!academiaId) {
      alert("Error: No se pudo identificar la academia.");
      return;
    }

    const resultado = await crearRecurso(formData, academiaId);

    if (resultado?.error) {
      alert(resultado.error);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  // Mientras verifica la sesión, mostramos un estado de carga "Zen"
  if (status === "loading") {
    return (
      <DashboardLayout>
        <Container>
          <TextSecondary>Verificando permisos...</TextSecondary>
        </Container>
      </DashboardLayout>
    );
  }

  // Si no es admin, no renderizamos el formulario para evitar "flasheos" de UI
  if (session?.user?.rol !== "ADMIN") {
    return null;
  }

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
                  <option value="CABINA">Cabina</option>
                  <option value="AULA">Aula</option>
                  <option value="INSTRUMENTO">Instrumento</option>
                </select>
              </div>

              <Input name="capacidad" label="Capacidad Máxima" type="number" min="1" required />
              {/* Nota de ayuda para el usuario */}
              <div className="mt-1">
                <TextSecondary>
                  Nota: Para instrumentos, se recomienda asignar capacidad 1.
                </TextSecondary>
              </div>
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