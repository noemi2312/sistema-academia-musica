"use server"

import { prisma } from "./prisma"
import { TipoRecurso } from "@prisma/client"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"

/**
 * REGISTRO: Crea una Academia nueva y su primer Administrador
 */
export async function registrarAcademiaYAdmin(formData: FormData) {
  const nombreAdmin = formData.get("nombreAdmin") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const nombreAcademia = formData.get("nombreAcademia") as string

  // Validación básica
  if (!email || !password || !nombreAcademia) {
    return { error: "Todos los campos son obligatorios." }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await prisma.$transaction(async (tx) => {
      const academia = await tx.academia.create({
        data: { nombre: nombreAcademia }
      })

      await tx.usuario.create({
        data: {
          nombre: nombreAdmin,
          email: email.toLowerCase(), // guardar el mail en minúsculas
          password: hashedPassword,
          rol: "ADMIN", // mapeo al Enum automático
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

  // Validación
  if (!nombre || !email || !password || !academiaId) {
    return { error: "Todos los campos son obligatorios." }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await prisma.usuario.create({
      data: {
        nombre: nombre,
        email: email.toLowerCase(),
        password: hashedPassword,
        rol: "ALUMNO", // Ajustado según nuestro Enum 'Role'
        academiaId: parseInt(academiaId)
      }
    })
    
    // En lugar de solo retornar success, podrías redirigir o manejar el login
    return { success: "Registro exitoso. ¡Ya puedes iniciar sesión!" }
  } catch (err) {
    console.error("Error en registro alumno:", err)
    return { error: "No se pudo completar el registro. El email ya existe o el ID de academia es inválido." }
  }
}

/**
 * RECURSOS: Crear nuevo (Solo Admin)
 */
export async function crearRecurso(formData: FormData, academiaId: number) {
  const nombre = (formData.get("nombre") as string)?.trim()
  const tipoRaw = formData.get("tipo") as string
  const capacidad = parseInt(formData.get("capacidad") as string)

  // Validaciones
  if (!nombre) return { error: "El nombre es obligatorio." }
  if (!tipoRaw) return { error: "El tipo de recurso es obligatorio." }
  if (isNaN(capacidad) || capacidad < 1) return { error: "La capacidad debe ser al menos 1." }

  // Casteo seguro al Enum
  const tipo = tipoRaw.toUpperCase() as TipoRecurso

  try {
    await prisma.recurso.create({
      data: {
        nombre: nombre,
        tipo: tipo, 
        capacidad: capacidad,
        academiaId: academiaId,
      },
    })
    
    revalidatePath("/dashboard")
    return { success: true }
  } catch (err) {
    console.error("Error al crear:", err)
    return { error: "No se pudo crear el recurso." }
  }
}

/**
 * RECURSOS: Editar existente
 */
export async function editarRecurso(id: number, nombre: string, tipo: string, capacidad: number) {
  const nombreLimpio = nombre?.trim()

  if (!nombreLimpio) return { error: "El nombre no puede quedar vacío." }
  if (capacidad < 1) return { error: "La capacidad mínima es 1." }

  const tipoCasteado = tipo.toUpperCase() as TipoRecurso

  try {
    await prisma.recurso.update({
      where: { id: id },
      data: { 
        nombre: nombreLimpio, 
        tipo: tipoCasteado,
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
    // Gracias al "onDelete: Cascade" que pusimos en el schema, 
    // las reservas se borrarán solas y no debería dar error aquí.
    return { error: "Error al borrar el recurso." }
  }
}

/**
 * RESERVAS: Crear nueva con blindaje total de disponibilidad y límite de 40 min
 */
export async function crearReserva(formData: FormData, usuarioId: number, academiaId: number) {
  if (!usuarioId || usuarioId <= 0) {
    return { error: "Tu sesión es inválida. Por favor, vuelve a iniciar sesión." };
  }

  const recursoId = parseInt(formData.get("recursoId") as string);
  const inicio = new Date(formData.get("inicio") as string);
  const fin = new Date(formData.get("fin") as string);

  // Validación de orden cronológico
  if (inicio >= fin) {
    return { error: "La hora de inicio debe ser anterior a la de fin." };
  }

  // Validación de fecha futura
  if (inicio < new Date()) {
    return { error: "No puedes realizar una reserva en una fecha u hora pasada." };
  }

  // VALIDACIÓN DE 40 MINUTOS 
  const diferenciaMinutos = (fin.getTime() - inicio.getTime()) / (1000 * 60);
  if (diferenciaMinutos > 40) {
    return { error: "La reserva no puede exceder los 40 minutos." };
  }

  try {
    return await prisma.$transaction(async (tx) => {
      // Detecta cualquier intersección de tiempo
      const conflicto = await tx.reserva.findFirst({
        where: {
          recursoId,
          inicio: { lt: fin },
          fin: { gt: inicio }
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
    const reservas = await prisma.reserva.findMany({
      where: { usuarioId: usuarioId },
      include: {
        recurso: { 
          select: { 
            nombre: true, 
            tipo: true 
          } 
        }
      },
      orderBy: { inicio: 'asc' } 
    });
    return reservas;
  } catch (error: unknown) {
    console.error("Error al obtener reservas del usuario:", error);
    return [];
  }
}

export async function eliminarReserva(id: number) {
  try {
    await prisma.reserva.delete({
      where: { id: id },
    });    
    //el usuario ve el cambio al instante
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error al eliminar reserva:", error);
    return { error: "No se pudo cancelar la reserva" };
  }
}

export async function obtenerReservasAcademia(academiaId: number) {
  try {
    const reservas = await prisma.reserva.findMany({
      where: { academiaId: academiaId },
      include: {
        recurso: { 
          select: { nombre: true, tipo: true } 
        },
        usuario: { 
          select: { nombre: true, email: true } 
        }
      },
      orderBy: { inicio: 'asc' }
    });
    return reservas;
  } catch (error: unknown) {
    console.error("Error al obtener reservas de la academia:", error);
    return [];
  }
}