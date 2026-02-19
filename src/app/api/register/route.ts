import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

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

    // Definimos el rol con el tipo correcto desde el inicio
    let rolAsignado: Role = Role.ALUMNO;

    if (!academia) {
      // Si no existe la academia, la creamos y el primer usuario es ADMIN
      academia = await prisma.academia.create({
        data: { nombre: academiaNombre }
      });
      rolAsignado = Role.ADMIN;
    }

    // 4. Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Crear el Usuario vinculado a la academia
    const newUser = await prisma.usuario.create({
      data: {
        nombre: name,
        email: email,
        password: hashedPassword,
        rol: rolAsignado, // Ahora rolAsignado es de tipo Role
        academiaId: academia.id, 
      },
    });

    return NextResponse.json({ message: "Usuario creado con éxito", user: { email: newUser.email, nombre: newUser.nombre } }, { status: 201 });

  } catch (error) {
    console.error("Error en el registro:", error);
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 });
  }
}