import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Asegurate de que esta ruta sea correcta
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, academiaNombre } = await req.json();

    // 1. Validar que no falten datos
    if (!name || !email || !password || !academiaNombre) {
      return NextResponse.json({ message: "Faltan campos obligatorios" }, { status: 400 });
    }

    // 2. Verificar si el usuario ya existe
    const userExists = await prisma.usuario.findUnique({ where: { email } });
    if (userExists) {
      return NextResponse.json({ message: "El email ya está registrado" }, { status: 400 });
    }

    // 3. Lógica de la Academia: ¿Existe o la creamos?
    let academia = await prisma.academia.findFirst({
      where: { nombre: academiaNombre }
    });

    let rolAsignado = "ALUMNO";

    if (!academia) {
      // Si no existe, la creamos y el usuario será ADMIN
      academia = await prisma.academia.create({
        data: { nombre: academiaNombre }
      });
      rolAsignado = "ADMIN";
    }

    // 4. Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Crear el Usuario vinculado a la academia
    const newUser = await prisma.usuario.create({
      data: {
        nombre: name,
        email: email,
        password: hashedPassword,
        rol: rolAsignado,
        academiaId: academia.id, // Aquí usamos el ID generado o encontrado
      },
    });

    return NextResponse.json({ message: "Usuario creado con éxito", user: newUser }, { status: 201 });

  } catch (error) {
    console.error("Error en el registro:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}