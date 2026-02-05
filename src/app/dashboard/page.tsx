import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { DashboardCard } from "@/components/ui/DashboardCard";
import { Container } from "@/components/ui/Layouts";
import { InfoBox } from "@/components/ui/InfoBox";
import { TextSecondary, HighlightText } from "@/components/ui/Typography";
import { PageLayout } from "@/components/ui/Layouts";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <PageLayout>
      <Navbar userName={session.user?.name} />

      <Container>
        <DashboardCard title="Bienvenido al Panel de Control">
          <TextSecondary>
            Estás conectado como: <HighlightText>{session.user?.email}</HighlightText>
          </TextSecondary>
          
          <InfoBox>
            <strong>Info de la Academia:</strong> Tu ID es {session.user?.academiaId}. 
            Próximamente aquí podrás gestionar las salas.
          </InfoBox>
        </DashboardCard>
      </Container>
    </PageLayout>
  );
}