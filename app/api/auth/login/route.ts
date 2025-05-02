import { connectToDatabase } from "@/lib/db";
import { authRateLimiter } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const rateLimitResult = await authRateLimiter(request);
  if (rateLimitResult) return rateLimitResult;

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "El correo electrónico y la contraseña son obligatorios" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const users = await db.collection("users").find({}).toArray();

    for (const user of users) {
      const isEmailMatch = await bcrypt.compare(
        email.toLowerCase(),
        user.email
      );
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (isEmailMatch && isPasswordMatch) {
        // User is authenticated, log them in
        const token = jwt.sign(
          {
            userId: user._id.toString(),
            name: user.name || user.displayName,
            email: email.toLowerCase(),
          },
          process.env.JWT_SECRET as string,
          { expiresIn: "7d" }
        );
        return NextResponse.json({ token });
      }

      if (!isEmailMatch || !isPasswordMatch) {
        return NextResponse.json(
          { error: "Credenciales inválidas" },
          { status: 401 }
        );
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
