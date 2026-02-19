"use client";

import { useSession } from "next-auth/react"; 
import { Container, DashboardLayout, ActionGroup, FormGroup } from "@/components/ui/Layouts";
import { DashboardCard } from "@/components/features/DashboardCard";
import { Navbar } from "@/components/features/Navbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { TextSecondary, TextBold } from "@/components/ui/Typography";
import { useRouter } from "next/navigation";
import { crearRecurso } from "@/lib/actions";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function NuevoRecursoPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    else if (status === "authenticated" && session?.user?.rol !== "ADMIN") router.push("/dashboard");
  }, [session, status, router]);

  async function handleAction(formData: FormData) {
    const academiaId = session?.user?.academiaId;
    const nombre = formData.get("nombre") as string;
    const capacidad = Number(formData.get("capacidad"));

    // 1. Validaciones manuales para evitar datos vacíos o inconsistentes
    if (!nombre || nombre.trim().length === 0) {
      toast.error("El nombre del recurso es obligatorio");
      return;
    }

    if (capacidad < 1) {
      toast.error("La capacidad mínima debe ser de 1 persona");
      return;
    }

    if (!academiaId) {
      toast.error("Error: No se pudo identificar la academia");
      return;
    }

    // 2. Si pasa las validaciones, procedemos a crear
    const resultado = await crearRecurso(formData, academiaId);
    
    if (resultado?.error) {
      toast.error(resultado.error);
    } else {
      toast.success("¡Recurso creado con éxito!");
      router.push("/dashboard");
      router.refresh();
    }
  }

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
              
              {/* 'required' y 'minLength' activan la validación nativa del navegador */}
              <Input 
                name="nombre" 
                label="Nombre del Recurso" 
                placeholder="Ej: Sala de Piano A" 
                required 
                minLength={2}
              />
              
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
              
              {/* 'min="1"' evita que el usuario baje de 1 con las flechitas del input */}
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