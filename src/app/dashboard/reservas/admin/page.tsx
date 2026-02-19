import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { obtenerReservasAcademia } from "@/lib/actions";
import { Container, DashboardLayout, FormGroup } from "@/components/ui/Layouts";
import { Navbar } from "@/components/features/Navbar";
import { DashboardCard } from "@/components/features/DashboardCard";
import { TitleSection, TextSecondary } from "@/components/ui/Typography";
import { InfoBox } from "@/components/ui/InfoBox";
import { ReservaListaAdmin } from "@/components/features/ReservaListaAdmin";

export default async function AdminReservasPage() {
  const session = await auth();

  // 1. Protección de ruta por Rol: Redirige si no es ADMIN
  if (!session || session.user?.rol !== "ADMIN") {
    redirect("/dashboard/reservas");
  }

  // 2. Obtención de datos filtrados por Academia
  const academiaId = Number(session.user.academiaId);
  const reservas = await obtenerReservasAcademia(academiaId);

  return (
    <DashboardLayout>
      {/* Pasamos el rol para que la Navbar muestre los links correctos */}
      <Navbar userName={session.user.name} rol={session.user.rol} />
      
      <Container>
        <DashboardCard title="Administración de Reservas">
          {/* FormGroup principal para separar el texto introductorio del listado */}
          <FormGroup>
            <TextSecondary>
              Panel de control global para la gestión de turnos y recursos de la academia.
            </TextSecondary>

            {/* FormGroup anidado para mantener la jerarquía de títulos y listas */}
            <FormGroup>
              <TitleSection>Todas las Reservas</TitleSection>
              
              {reservas.length === 0 ? (
                <InfoBox>No hay reservas registradas en la academia actualmente.</InfoBox>
              ) : (
                <ReservaListaAdmin reservas={reservas} />
              )}
            </FormGroup>
          </FormGroup>
        </DashboardCard>
      </Container>
    </DashboardLayout>
  );
}