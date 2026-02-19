import { Container, DashboardLayout, FormGroup, LandingGrid } from "@/components/ui/Layouts";
import { DashboardCard } from "@/components/features/DashboardCard";
import { TitleMain, TextSecondary } from "@/components/ui/Typography"; 
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function Home() {
  return (
    <DashboardLayout>
      <Container>
        <FormGroup>
          <TitleMain>Sistema de Gestión Academia</TitleMain>
          <TextSecondary>
            Plataforma centralizada para la reserva de recursos y administración institucional.
          </TextSecondary>
        </FormGroup>

        <LandingGrid> 
          <DashboardCard title="Área de Alumnos">
            <FormGroup>
              <TextSecondary>
                Gestioná tus turnos y reservá instrumentos o equipos de estudio.
              </TextSecondary>
              
              {/* Invertimos el orden: El Button es el hijo directo del FormGroup para que se centre solo */}
              <Button variant="primary">
                <Link href="/login">Iniciar Sesión</Link>
              </Button>

              <Button variant="secondary">
                <Link href="/registro">Crear Cuenta</Link>
              </Button>
            </FormGroup>
          </DashboardCard>

          <DashboardCard title="Gestión Institucional">
            <FormGroup>
              <TextSecondary>
                Accedé al panel de control de tu academia o registrá una nueva institución.
              </TextSecondary>
              
              <Button variant="primary">
                <Link href="/login">Acceso Administración</Link>
              </Button>

              <Button variant="secondary">
                <Link href="/registro/admin">Registrar mi Academia</Link>
              </Button>
            </FormGroup>
          </DashboardCard>
        </LandingGrid>

        <FormGroup className="mt-12">
          <TextSecondary>
            Proyecto Final - Programación III
          </TextSecondary>
        </FormGroup>
      </Container>
    </DashboardLayout>
  );
}