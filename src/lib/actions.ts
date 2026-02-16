"use server"

import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

/**
 * REGISTRO: Crea una Academia nueva y su primer Administrador
 * Requisito: Punto 4.1 y 14.7
 */
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
    console.error("Error en registro admin:", err) 
    return { error: "Hubo un fallo en el registro. Quizás el email ya existe." }
  }

  redirect("/login")
}

/**
 * REGISTRO: Crea un Alumno y lo vincula a una Academia existente
 * Requisito: Punto 4.2 y 14.7
 */
export async function registrarAlumno(formData: FormData) {
  const nombre = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const academiaId = formData.get("academiaId") as string

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await prisma.usuario.create({
      data: {
        nombre: nombre,
        email: email,
        password: hashedPassword,
        rol: "USER", // Rol fijo para alumnos
        academiaId: parseInt(academiaId)
      }
    })
    return { success: true }
  } catch (err) {
    console.error("Error en registro alumno:", err)
    return { error: "No se pudo completar el registro. Verifica el ID de la academia." }
  }
}

/**
 * RECURSOS: Crear nuevo (Solo Admin)
 * Requisito: Punto 3.1 y 11
 */
export async function crearRecurso(formData: FormData, academiaId: number) {
  const nombre = formData.get("nombre") as string
  const tipo = formData.get("tipo") as string
  const capacidad = formData.get("capacidad") as string

  if (!nombre || !tipo) return { error: "Campos obligatorios faltantes." }

  try {
    await prisma.recurso.create({
      data: {
        nombre: nombre,
        tipo: tipo,
        capacidad: parseInt(capacidad) || 0,
        academiaId: academiaId,
      },
    })
  } catch (err) {
    console.error("Error al crear:", err)
    return { error: "No se pudo crear el recurso." }
  }

  revalidatePath("/dashboard")
  redirect("/dashboard")
}

/**
 * RECURSOS: Editar existente
 * Requisito: Punto 3.1
 */
export async function editarRecurso(id: number, nombre: string, tipo: string, capacidad: number) {
  try {
    await prisma.recurso.update({
      where: { id: id },
      data: { 
        nombre, 
        tipo,
        capacidad: Number(capacidad)
      },
    })
    revalidatePath("/dashboard")
  } catch (err) {
    console.error("Error al editar:", err)
    return { error: "No se pudo actualizar el recurso." }
  }
}

/**
 * RECURSOS: Eliminar
 * Requisito: Punto 3.1
 */
export async function eliminarRecurso(id: number) {
  try {
    await prisma.recurso.delete({
      where: { id: id },
    })
    revalidatePath("/dashboard")
  } catch (err) {
    console.error("Error al eliminar:", err)
    return { error: "Error al borrar. Puede tener reservas activas." }
  }
}