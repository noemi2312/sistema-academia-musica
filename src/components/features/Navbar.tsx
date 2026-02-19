"use client";

import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TextBold, TextSecondary } from "@/components/ui/Typography";
import { NavContainer, NavGroup } from "@/components/ui/NavLayout"; // Nuevos componentes
import Link from "next/link";

interface NavbarProps {
  userName?: string | null;
  rol?: string | null;
}

export function Navbar({ userName, rol }: NavbarProps) {
  const pathname = usePathname();

  return (
    <NavContainer>
      {/* Grupo Izquierdo: Marca y Saludo */}
      <NavGroup>
        <Link href="/">
          <TextBold>Sistema Academia</TextBold>
        </Link>
        {userName && (
          <TextSecondary>
            Hola, {userName}
          </TextSecondary>
        )}
      </NavGroup>

      {/* Grupo Derecho: Acciones Dinámicas */}
      <NavGroup>
        {rol === "ADMIN" && pathname !== "/dashboard/reservas/admin" && (
          <Link href="/dashboard/reservas/admin">
            <Button variant="secondary">Gestión Global</Button>
          </Link>
        )}
        
        {rol === "USER" && pathname !== "/dashboard/reservas" && (
          <Link href="/dashboard/reservas">
            <Button variant="secondary">Mis Reservas</Button>
          </Link>
        )}

        {userName && (
          <Button 
            variant="danger" 
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Cerrar Sesión
          </Button>
        )}
      </NavGroup>
    </NavContainer>
  );
}