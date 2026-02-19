"use client";

import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TextBold, TextSecondary } from "@/components/ui/Typography";
import { NavContainer, NavGroup } from "@/components/ui/NavLayout"; 
import Link from "next/link";

interface NavbarProps {
  userName?: string | null;
  rol?: string | null;
}

export function Navbar({ userName, rol }: NavbarProps) {
  const pathname = usePathname();

  return (
    <NavContainer>
      <NavGroup>
        <Link href="/dashboard">
          <TextBold>Sistema Academia</TextBold>
        </Link>
        {userName && (
          <TextSecondary>
            Hola, {userName.split(" ")[0]} 
          </TextSecondary>
        )}
      </NavGroup>

      <NavGroup>
        {/* Link para volver siempre al Dashboard si no estamos ahí */}
        {pathname !== "/dashboard" && (
          <Link href="/dashboard">
            <Button variant="secondary">Inicio</Button>
          </Link>
        )}

        {/* Gestión Global para ADMIN */}
        {rol === "ADMIN" && pathname !== "/dashboard/reservas/admin" && (
          <Link href="/dashboard/reservas/admin">
            <Button variant="secondary">Gestión Global</Button>
          </Link>
        )}
        
        {/* Mis Reservas para Alumnos (No-Admin) */}
        {rol !== "ADMIN" && pathname !== "/dashboard/reservas" && (
          <Link href="/dashboard/reservas">
            <Button variant="secondary">Mis Reservas</Button>
          </Link>
        )}

        {userName && (
          <Button 
            variant="danger" 
            // CAMBIO CLAVE: callbackUrl ahora apunta a "/" para volver al landing
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Cerrar Sesión
          </Button>
        )}
      </NavGroup>
    </NavContainer>
  );
}