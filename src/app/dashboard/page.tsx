import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Container, DashboardLayout, ActionGroup, FormGroup, Grid } from "@/components/ui/Layouts";
import { InfoBox } from "@/components/ui/InfoBox";
import { TextSecondary, TitleSection, TextBold } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { RecursoCard } from "@/components/ui/RecursoCard";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const isAdmin = session.user?.rol === "ADMIN";
  
  // Obtenemos los IDs de la sesión de forma segura
  const usuarioId = session.user?.id ? Number(session.user.id) : undefined;
  const academiaId = session.user?.academiaId;

  const recursos = await prisma.recurso.findMany({
    where: { academiaId: academiaId },
    orderBy: { nombre: 'asc' }
  });

  return (
    <DashboardLayout>
      <Navbar userName={session.user?.name} />

      <Container>
        <DashboardCard title="Panel de Control">
          <TextSecondary>
            Sesión iniciada como: <TextBold>{session.user?.email}</TextBold>
          </TextSecondary>

          {isAdmin ? (
            <InfoBox>
              Administrador de la Academia
              <ActionGroup>
                <Link href="/dashboard/recursos/nuevo">
                  <Button>+ Agregar Nuevo Recurso</Button>
                </Link>
              </ActionGroup>
            </InfoBox>
          ) : (
            <InfoBox>Panel de Alumno</InfoBox>
          )}

          <FormGroup>
            <TitleSection>Recursos de la Academia</TitleSection>
            
            {recursos.length === 0 ? (
              <TextSecondary>No hay recursos registrados todavía.</TextSecondary>
            ) : (
              <Grid>
                {recursos.map((recurso) => (
                  <RecursoCard 
                    key={recurso.id}
                    id={recurso.id} 
                    nombre={recurso.nombre} 
                    tipo={recurso.tipo} 
                    capacidad={recurso.capacidad}
                    isAdmin={isAdmin}
                    usuarioId={usuarioId}
                    academiaId={academiaId}
                  />
                ))}
              </Grid>
            )}
          </FormGroup>

        </DashboardCard>
      </Container>
    </DashboardLayout>
  );
}