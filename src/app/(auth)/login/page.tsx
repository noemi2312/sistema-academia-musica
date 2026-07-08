"use client";

import { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Nombres actualizados para coincidir con Layouts.tsx
import { DashboardLayout, FormGroup } from "@/components/ui/Layouts";
import { AuthContainer } from "@/components/ui/AuthContainer";
import { AuthLink } from "@/components/ui/AuthLink";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { InfoBox } from "@/components/ui/InfoBox";
import { TextSecondary } from "@/components/ui/Typography";

// Este componente contiene la lógica que necesita los parámetros de búsqueda
function LoginForm() {
  const searchParams = useSearchParams();
  const roleRequired = searchParams.get("role"); // 'ADMIN' o null
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      role: roleRequired,
      redirect: false,
    });

    if (result?.error) {
      setError("Credenciales inválidas. Revisa tu email y contraseña.");
      setIsLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <Input
        label="Email"
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

      <Button type="submit" isLoading={isLoading} className="w-full">
        Entrar
      </Button>
    </form>
  );
}

// Esta es la página principal que el servidor prerenderiza
export default function LoginPage() {
  return (
    <DashboardLayout>
      <AuthContainer title="Iniciar Sesión">
        <FormGroup>
          {/* Suspense le dice a Next.js: "No te preocupes por el searchParams ahora, espera a que cargue en el cliente" */}
          <Suspense fallback={<div className="text-center">Cargando...</div>}>
            <LoginForm />
          </Suspense>
        </FormGroup>

        <FormGroup>
          <TextSecondary>
            ¿No tienes una cuenta?{" "}
            <AuthLink href="/registro">Regístrate aquí</AuthLink>
          </TextSecondary>
        </FormGroup>
      </AuthContainer>
    </DashboardLayout>
  );
}