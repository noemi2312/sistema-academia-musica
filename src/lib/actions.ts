"use server"

import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

/**
 * REGISTRO: Crea una Academia nueva y su primer Administrador
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
        rol: "USER",
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
    
    revalidatePath("/dashboard")
    return { success: true } // Cambiado para permitir que el Toast se muestre antes de redirigir
  } catch (err) {
    console.error("Error al crear:", err)
    return { error: "No se pudo crear el recurso." }
  }
}

/**
 * RECURSOS: Editar existente
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
    return { success: true }
  } catch (err) {
    console.error("Error al editar:", err)
    return { error: "No se pudo actualizar el recurso." }
  }
}

/**
 * RECURSOS: Eliminar
 */
export async function eliminarRecurso(id: number) {
  try {
    await prisma.recurso.delete({
      where: { id: id },
    })
    revalidatePath("/dashboard")
    return { success: true }
  } catch (err) {
    console.error("Error al eliminar:", err)
    return { error: "Error al borrar. Puede tener reservas activas." }
  }
}

/**
 * RESERVAS: Crear nueva con validación de disponibilidad
 */
export async function crearReserva(formData: FormData, usuarioId: number, academiaId: number) {
  if (!usuarioId || usuarioId <= 0) {
    return { error: "Tu sesión es inválida. Por favor, vuelve a iniciar sesión." };
  }
  const recursoId = parseInt(formData.get("recursoId") as string);
  const inicio = new Date(formData.get("inicio") as string);
  const fin = new Date(formData.get("fin") as string);

  if (inicio >= fin) {
    return { error: "La hora de inicio debe ser anterior a la de fin." };
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const conflicto = await tx.reserva.findFirst({
        where: {
          recursoId,
          OR: [
            {
              AND: [
                { inicio: { lt: fin } },
                { fin: { gt: inicio } }
              ]
            }
          ]
        }
      });

      if (conflicto) {
        throw new Error("El recurso ya está ocupado en ese horario.");
      }

      await tx.reserva.create({
        data: {
          inicio,
          fin,
          usuarioId,
          recursoId,
          academiaId
        }
      });

      return { success: true };
    });
  } catch (err: unknown) {
    console.error("Error en reserva:", err);
    if (err instanceof Error) return { error: err.message };
    return { error: "Error al procesar la reserva." };
  } finally {
    revalidatePath("/dashboard");
  }
}

export async function obtenerReservasUsuario(usuarioId: number) {
  try {
    return await prisma.reserva.findMany({
      where: { usuarioId: usuarioId },
      include: {
        recurso: { select: { nombre: true, tipo: true } }
      },
      orderBy: { inicio: 'desc' } 
    });
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    return [];
  }
}

export async function eliminarReserva(id: number) {
  try {
    await prisma.reserva.delete({
      where: { id: id },
    });
    revalidatePath("/dashboard")
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar reserva:", error);
    return { error: "No se pudo cancelar la reserva" };
  }
}

export async function obtenerReservasAcademia(academiaId: number) {
  try {
    return await prisma.reserva.findMany({
      where: { academiaId: academiaId },
      include: {
        recurso: { select: { nombre: true, tipo: true } },
        usuario: { select: { nombre: true, email: true } }
      },
      orderBy: { inicio: 'asc' }
    });
  } catch (error) {
    console.error("Error al obtener reservas de la academia:", error);
    return [];
  }
}