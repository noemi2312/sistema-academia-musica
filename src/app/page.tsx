import { Container, DashboardLayout, FormGroup } from "@/components/ui/Layouts";
import { DashboardCard } from "@/components/features/DashboardCard";
import { TitleSection, TextSecondary } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function Home() {
  return (
    <DashboardLayout>
      <Container>
        {/* Cabecera del sistema */}
        <FormGroup>
          <TitleSection>Sistema de Gestión Academia</TitleSection>
          <TextSecondary>
            Plataforma centralizada para la reserva de recursos y administración institucional.
          </TextSecondary>
        </FormGroup>

        {/* Acceso Alumnos */}
        <DashboardCard title="Área de Alumnos">
          <FormGroup>
            <TextSecondary>
              Gestioná tus turnos y reservá instrumentos o equipos de estudio.
            </TextSecondary>
            <Link href="/login">
              <Button variant="primary">Iniciar Sesión</Button>
            </Link>
            <Link href="/register">
              <Button variant="secondary">Crear Cuenta</Button>
            </Link>
          </FormGroup>
        </DashboardCard>

        {/* Acceso Instituciones / Admin */}
        <DashboardCard title="Gestión Institucional">
          <FormGroup>
            <TextSecondary>
              Accedé al panel de control de tu academia o registrá una nueva institución.
            </TextSecondary>
            {/* El Login es el mismo, pero el botón aquí guía al Admin */}
            <Link href="/login">
              <Button variant="primary">Acceso Administración</Button>
            </Link>
            <Link href="/register/admin">
              <Button variant="secondary">Registrar mi Academia</Button>
            </Link>
          </FormGroup>
        </DashboardCard>

        {/* Footer integrado */}
        <FormGroup>
          <TextSecondary>
            Proyecto Final - Programación III
          </TextSecondary>
        </FormGroup>
      </Container>
    </DashboardLayout>
  );
}