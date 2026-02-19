"use client";

import { useSession } from "next-auth/react"; 
import { Container, DashboardLayout, ActionGroup, FormGroup } from "@/components/ui/Layouts";
import { DashboardCard } from "@/components/features/DashboardCard";
import { Navbar } from "@/components/features/Navbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select"; // Importamos el componente Select
import { TextSecondary, TextBold } from "@/components/ui/Typography";
import { useRouter } from "next/navigation";
import { crearRecurso } from "@/lib/actions";
import { useEffect } from "react";

export default function NuevoRecursoPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    else if (status === "authenticated" && session?.user?.rol !== "ADMIN") router.push("/dashboard");
  }, [session, status, router]);

  const handleAction = async (formData: FormData) => {
    const academiaId = session?.user?.academiaId;
    if (!academiaId) return alert("Error de academia");

    const resultado = await crearRecurso(formData, academiaId);
    if (resultado?.error) alert(resultado.error);
    else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  if (status === "loading") {
    return (
      <DashboardLayout>
        <Container><TextSecondary>Verificando permisos...</TextSecondary></Container>
      </DashboardLayout>
    );
  }

  if (session?.user?.rol !== "ADMIN") return null;

  return (
    <DashboardLayout>
      <Navbar userName={session.user?.name} rol={session.user?.rol} />
      
      <Container>
        <DashboardCard title="Registrar Nuevo Recurso">
          <form action={handleAction}>
            <FormGroup>
              <TextSecondary>Ingresa los detalles para tu academia.</TextSecondary>
              
              <Input 
                name="nombre" 
                label="Nombre del Recurso" 
                placeholder="Ej: Sala de Piano A" 
                required 
              />
              
              {/* Usamos el componente Select de UI para mantener la limpieza */}
              <Select 
                label="Tipo de Recurso"
                name="tipo"
                required
                options={[
                  { value: "CABINA", label: "Cabina" },
                  { value: "AULA", label: "Aula" },
                  { value: "INSTRUMENTO", label: "Instrumento" },
                ]}
              />

              <Input 
                name="capacidad" 
                label="Capacidad Máxima" 
                type="number" 
                min="1" 
                required 
              />
              
              <TextSecondary>
                <TextBold>Nota:</TextBold> Para instrumentos, se recomienda asignar capacidad 1.
              </TextSecondary>
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