import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/features/Navbar";
import { DashboardCard } from "@/components/features/DashboardCard";
import { Container, DashboardLayout, ActionGroup, FormGroup, Grid } from "@/components/ui/Layouts";
import { TextSecondary, TitleSection, TextBold } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { RecursoCard } from "@/components/features/RecursoCard";
import { obtenerReservasAcademia } from "@/lib/actions";
import { ReservaListaAdmin } from "@/components/features/ReservaListaAdmin";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const isAdmin = session.user?.rol === "ADMIN";
  const usuarioId = session.user?.id ? Number(session.user.id) : undefined;
  const academiaId = Number(session.user?.academiaId);

  const [recursos, reservas] = await Promise.all([
    prisma.recurso.findMany({
      where: { academiaId: academiaId },
      orderBy: { nombre: 'asc' }
    }),
    isAdmin ? obtenerReservasAcademia(academiaId) : Promise.resolve([])
  ]);

  return (
    <DashboardLayout>
      <Navbar userName={session.user?.name} rol={session.user?.rol} />

      <Container>
        <DashboardCard title="Panel de Control">
          <FormGroup>
            <TextSecondary>
              Sesión iniciada: <TextBold>{session.user?.email}</TextBold>
            </TextSecondary>
          </FormGroup>

          {isAdmin ? (
            <FormGroup>
              <TextBold>Gestión Institucional</TextBold>
              <ActionGroup>
                <Link href="/dashboard/recursos/nuevo">
                  <Button variant="primary">Nuevo Recurso</Button>
                </Link>
              </ActionGroup>
            </FormGroup>
          ) : (
            <FormGroup>
              <TextBold>Portal de Alumno</TextBold>
              <TextSecondary>Explora los recursos y gestiona tus turnos disponibles.</TextSecondary>
            </FormGroup>
          )}

          <FormGroup>
            <TitleSection>Recursos Disponibles</TitleSection>
            
            {recursos.length === 0 ? (
              <TextSecondary>No se encontraron registros en esta academia actualmente.</TextSecondary>
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

          {isAdmin && (
            <FormGroup>
              <TitleSection>Últimas Reservas</TitleSection>
              {reservas.length === 0 ? (
                <TextSecondary>No hay actividad de reservas registrada.</TextSecondary>
              ) : (
                /* Aplicamos FormGroup aquí para un espaciado consistente */
                <FormGroup>
                  <TextSecondary>Vistazo rápido a los movimientos recientes:</TextSecondary>
                  <ReservaListaAdmin reservas={reservas.slice(0, 3)} />
                </FormGroup>
              )}
            </FormGroup>
          )}

        </DashboardCard>
      </Container>
    </DashboardLayout>
  );
}