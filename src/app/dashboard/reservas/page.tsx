import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { obtenerReservasUsuario } from "@/lib/actions";
import { Container, DashboardLayout, FormGroup } from "@/components/ui/Layouts";
import { Navbar } from "@/components/features/Navbar";
import { DashboardCard } from "@/components/features/DashboardCard";
import { TitleSection, TextSecondary } from "@/components/ui/Typography";
import { InfoBox } from "@/components/ui/InfoBox";
import { ReservaLista } from "@/components/features/ReservaLista";

export default async function MisReservasPage() {
  const session = await auth();
  
  if (!session?.user) redirect("/login");

  const usuarioId = Number(session.user.id);
  const reservas = await obtenerReservasUsuario(usuarioId);

  return (
    <DashboardLayout>
      <Navbar userName={session.user.name} rol={session.user.rol} />
      
      <Container>
        <DashboardCard title="Mis Reservas">
          {/* Contenedor principal para manejar el aire entre secciones */}
          <FormGroup>
            <TextSecondary>
              Gestiona tus horarios y recursos solicitados en la academia.
            </TextSecondary>

            {/* Bloque de contenido con su propia jerarquía */}
            <FormGroup>
              <TitleSection>Historial de Solicitudes</TitleSection>
              
              {reservas.length === 0 ? (
                <InfoBox>Aún no has realizado ninguna reserva.</InfoBox>
              ) : (
                <ReservaLista reservas={reservas} />
              )}
            </FormGroup>
          </FormGroup>
        </DashboardCard>
      </Container>
    </DashboardLayout>
  );
}