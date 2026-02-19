"use client";

import { useState } from "react";
import { registrarAcademiaYAdmin } from "@/lib/actions";

import { PageLayout, FormStack, AuthFooter, AuthHeader } from "@/components/ui/Layouts";
import { AuthContainer } from "@/components/ui/AuthContainer";
import { AuthLink } from "@/components/ui/AuthLink";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { InfoBox } from "@/components/ui/InfoBox";
import { TextSecondary } from "@/components/ui/Typography";

export default function RegisterAdminPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    try {
      // Esta acción crea la Academia y el Admin en una sola transacción
      const result = await registrarAcademiaYAdmin(formData);

      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      }
    } catch {
      setError("Ocurrió un error inesperado al crear la academia.");
      setIsLoading(false);
    }
  }

  return (
    <PageLayout>
      <AuthContainer title="Registrar Mi Academia">
        <AuthHeader>
          <TextSecondary>
            Crea una cuenta de administrador para gestionar tus recursos y alumnos.
          </TextSecondary>
        </AuthHeader>
        
        <FormStack onSubmit={handleSubmit}>
          <Input 
            label="Nombre de la Academia"
            name="nombreAcademia" 
            placeholder="Ej: Academia de Música Mozart"
            required 
            disabled={isLoading}
          />

          <Input 
            label="Tu Nombre (Admin)"
            name="nombreAdmin" 
            placeholder="Ej: Juan Pérez"
            required 
            disabled={isLoading}
          />

          <Input 
            label="Email Profesional"
            name="email" 
            type="email" 
            required 
            disabled={isLoading}
          />

          <Input 
            label="Contraseña"
            name="password" 
            type="password" 
            required 
            disabled={isLoading}
          />
          
          {error && <InfoBox>{error}</InfoBox>}
          
          <Button type="submit" isLoading={isLoading}>
            Crear Academia y Admin
          </Button>
        </FormStack>
        
        <AuthFooter>
          <TextSecondary>
            ¿Eres un alumno con ID?{" "}
            <AuthLink href="/registro">Regístrate como alumno aquí</AuthLink>
          </TextSecondary>
        </AuthFooter>
      </AuthContainer>
    </PageLayout>
  );
}