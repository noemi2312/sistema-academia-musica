import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/features/Navbar";
import { DashboardCard } from "@/components/features/DashboardCard";
import { Container, DashboardLayout, FormGroup, Grid, GroupTitle, Section } from "@/components/ui/Layouts";
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

  // Carga de datos
  const [recursos, reservas] = await Promise.all([
    prisma.recurso.findMany({
      where: { academiaId: academiaId },
      orderBy: { nombre: 'asc' }
    }),
    isAdmin ? obtenerReservasAcademia(academiaId) : Promise.resolve([])
  ]);

  // Agrupamiento por tipo
  const tipos = ["AULA", "CABINA", "INSTRUMENTO"];
  const recursosAgrupados = tipos.map(tipo => ({
    tipo,
    items: recursos.filter(r => r.tipo === tipo)
  })).filter(grupo => grupo.items.length > 0);

  return (
    <DashboardLayout>
      <Navbar userName={session.user?.name} rol={session.user?.rol} />

      <Container>
        {/* Cabecera centrada */}
        <FormGroup>
          <TitleSection>Panel de Control</TitleSection>
          <TextSecondary>
            Sesión iniciada: <TextBold>{session.user?.email}</TextBold>
          </TextSecondary>
          
          {/* Muestra el ID de la academia solo para Administradores */}
          {isAdmin && (
            <TextSecondary>
              ID de Academia: <TextBold>{academiaId}</TextBold>
            </TextSecondary>
          )}

          {isAdmin && (
            <Link href="/dashboard/recursos/nuevo">
              <Button variant="primary">Nuevo Recurso</Button>
            </Link>
          )}
        </FormGroup>

        {/* Listado de Recursos: Ocupando el ancho total */}
        <div className="w-full">
          {recursos.length === 0 ? (
            <FormGroup>
              <TextSecondary>No se encontraron registros en esta academia actualmente.</TextSecondary>
            </FormGroup>
          ) : (
            recursosAgrupados.map((grupo) => (
              <Section key={grupo.tipo}>
                <GroupTitle>{grupo.tipo}S</GroupTitle>
                <Grid>
                  {grupo.items.map((recurso) => (
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
              </Section>
            ))
          )}
        </div>

        {/* Reservas destacadas en tarjeta blanca */}
        {isAdmin && reservas.length > 0 && (
          <Section>
            <DashboardCard title="Últimas Reservas">
              <ReservaListaAdmin reservas={reservas.slice(0, 5)} />
            </DashboardCard>
          </Section>
        )}
      </Container>
    </DashboardLayout>
  );
}