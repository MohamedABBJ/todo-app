import { connectToDatabase } from "@/lib/db";
import { authRateLimiter } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const rateLimitResult = await authRateLimiter(request);
  if (rateLimitResult) return rateLimitResult;

  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          error: "El nombre, correo electrónico y contraseña son obligatorios",
        },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const hashedEmail = await bcrypt.hash(email.toLowerCase(), 10);
    const users = await db.collection("users").find({}).toArray();

    for (const user of users) {
      const isMatch = await bcrypt.compare(email.toLowerCase(), user.email);
      if (isMatch) {
        return NextResponse.json(
          { error: "Ya existe un usuario con este correo electrónico" },
          { status: 409 }
        );
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection("users").insertOne({
      name: name,
      email: hashedEmail,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Usuario registrado exitosamente", userId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
