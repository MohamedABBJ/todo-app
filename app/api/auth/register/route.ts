import { connectToDatabase } from "@/lib/db";
import { authRateLimiter } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";
import { type NextRequest, NextResponse } from "next/server";

// Handles user registration
export async function POST(request: NextRequest) {
  const rateLimitResult = await authRateLimiter(request);
  if (rateLimitResult) return rateLimitResult;

  try {
    // Get registration data from request
    const { name, email, password } = await request.json();

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          error: "El nombre, correo electrónico y contraseña son obligatorios",
        },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const users = await db.collection("users").find({}).toArray();

    // Check if user already exists
    for (const user of users) {
      const isMatch = email.toLowerCase() == user.email;
      if (isMatch) {
        return NextResponse.json(
          { error: "Ya existe un usuario con este correo electrónico" },
          { status: 409 }
        );
      }
    }
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into database
    const result = await db.collection("users").insertOne({
      name: name,
      email: email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Usuario registrado exitosamente", userId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    // Handle server errors
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
