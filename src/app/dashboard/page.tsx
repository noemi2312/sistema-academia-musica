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

  // 1. Verificación de seguridad
  if (!session) {
    redirect("/login");
  }

  const isAdmin = session.user?.rol === "ADMIN";
  const academiaId = session.user?.academiaId;

  // 2. Carga de datos desde MySQL
  const recursos = await prisma.recurso.findMany({
    where: { academiaId: academiaId },
    orderBy: { nombre: 'asc' }
  });

  return (
    <DashboardLayout>
      <Navbar userName={session.user?.name} />

      <Container>
        <DashboardCard title="Panel de Control">
          {/* Usamos TextBold en lugar de <strong> para mantener el sistema de diseño */}
          <TextSecondary>
            Sesión iniciada como: <TextBold>{session.user?.email}</TextBold>
          </TextSecondary>

          {isAdmin ? (
            <InfoBox>
              Administrador de academia ID {academiaId}
              <ActionGroup>
                <Link href="/dashboard/recursos/nuevo">
                  <Button>+ Agregar Nueva Sala</Button>
                </Link>
              </ActionGroup>
            </InfoBox>
          ) : (
            <InfoBox>
              Panel de Alumno
            </InfoBox>
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