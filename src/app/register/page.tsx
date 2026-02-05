"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Importamos nuestras piezas de UI ya limpias
import { PageLayout, FormStack, AuthFooter } from "@/components/ui/Layouts";
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
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    // Cambiamos academiaId por academiaNombre
    const academiaNombre = formData.get("academiaNombre"); 

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, academiaNombre }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        // Registro exitoso, lo mandamos al login
        router.push("/login");
      } else {
        const data = await response.json();
        setError(data.message || "Error al registrar usuario.");
      }
    } catch {
      setError("Ocurrió un error inesperado. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageLayout>
      <AuthContainer title="Crear Cuenta">
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
            label="Nombre de tu Academia" // Etiqueta mucho más clara para el usuario
            name="academiaNombre" 
            type="text" 
            placeholder="Ej: Conservatorio Beethoven"
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