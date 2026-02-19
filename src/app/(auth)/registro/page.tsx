//registro alumno
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registrarAlumno } from "@/lib/actions";
import { PageLayout, FormStack, AuthFooter, AuthHeader } from "@/components/ui/Layouts";
import { AuthContainer } from "@/components/ui/AuthContainer";
import { AuthLink } from "@/components/ui/AuthLink";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { InfoBox } from "@/components/ui/InfoBox";
import { TextSecondary } from "@/components/ui/Typography";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    try {
      const result = await registrarAlumno(formData);

      if (result.success) {
        router.push("/login");
      } else {
        setError(result.error || "Error al registrar usuario.");
      }
    } catch {
      setError("Ocurrió un error inesperado. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageLayout>
      <AuthContainer title="Crear Cuenta de Alumno">
        {/* Agregamos el header informativo para dar aire al diseño */}
        <AuthHeader>
          <TextSecondary>
            Ingresa tus datos y el ID proporcionado por tu institución para comenzar.
          </TextSecondary>
        </AuthHeader>

        <FormStack onSubmit={handleSubmit}>
          <Input 
            label="Nombre Completo"
            name="name" 
            type="text" 
            placeholder="Ej: Ana García"
            required 
            disabled={isLoading}
          />

          <Input 
            label="Email"
            name="email" 
            type="email" 
            placeholder="tu@email.com"
            required 
            disabled={isLoading}
          />

          <Input 
            label="ID de la Academia" 
            name="academiaId" 
            type="number" 
            placeholder="Solicita el ID a tu profesor"
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
            Registrarse
          </Button>
        </FormStack>
        
        <AuthFooter>
          <TextSecondary>
            ¿Ya tienes una cuenta?{" "}
            <AuthLink href="/login">Inicia sesión aquí</AuthLink>
          </TextSecondary>
        </AuthFooter>
      </AuthContainer>
    </PageLayout>
  );
}