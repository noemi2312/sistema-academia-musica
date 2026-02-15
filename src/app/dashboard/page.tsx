import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Container, DashboardLayout, ActionGroup } from "@/components/ui/Layouts";
import { InfoBox } from "@/components/ui/InfoBox";
import { TextSecondary, HighlightText } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const isAdmin = session.user?.rol === "ADMIN";

  return (
    <DashboardLayout>
      <Navbar userName={session.user?.name} />

      <Container>
        <DashboardCard title="Panel de Control">
          <TextSecondary>
            Usuario: <HighlightText>{session.user?.email}</HighlightText>
          </TextSecondary>

          {isAdmin ? (
            <InfoBox>
              Administrador de academia ID {session.user?.academiaId}
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
        </DashboardCard>
      </Container>
    </DashboardLayout>
  );
}