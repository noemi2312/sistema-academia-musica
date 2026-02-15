"use server"

import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

export async function registrarAcademiaYAdmin(formData: FormData) {
  const nombreAdmin = formData.get("nombreAdmin") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const nombreAcademia = formData.get("nombreAcademia") as string

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await prisma.$transaction(async (tx) => {
      const academia = await tx.academia.create({
        data: { nombre: nombreAcademia }
      })

      await tx.usuario.create({
        data: {
          nombre: nombreAdmin,
          email: email,
          password: hashedPassword,
          rol: "ADMIN",
          academiaId: academia.id 
        }
      })
    })
  } catch (err) { 
    console.error("Error detallado:", err) 
    return { error: "Hubo un fallo en el registro. Quizás el email ya existe." }
  }

  redirect("/login")
}

export async function crearRecurso(formData: FormData, academiaId: number) {
  const nombre = formData.get("nombre") as string;
  const tipo = formData.get("tipo") as string;

  if (!nombre || !tipo) {
    return { error: "El nombre y el tipo son obligatorios." };
  }

  try {
    await prisma.recurso.create({
      data: {
        nombre: nombre,
        tipo: tipo,
        academiaId: academiaId,
      },
    });
  } catch (err) {
    console.error("Error al crear recurso:", err);
    return { error: "No se pudo crear el recurso." };
  }

  redirect("/dashboard");
}