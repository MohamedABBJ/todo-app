import { connectToDatabase } from "@/lib/db";
import { authRateLimiter } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { type NextRequest, NextResponse } from "next/server";

// POST handler for login requests
export async function POST(request: NextRequest) {
  // Applying rate limiting
  const rateLimitResult = await authRateLimiter(request);
  if (rateLimitResult) return rateLimitResult;

  try {
    // Ensure the JWT_SECRET environment variable is defined
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    // Parse the request body to extract email and password
    const { email, password } = await request.json();

    // Validate that both email and password are provided
    if (!email || !password) {
      return NextResponse.json(
        { error: "El correo electrónico y la contraseña son obligatorios" }, // Error message in Spanish
        { status: 400 }
      );
    }

    // Connect to the database
    const { db } = await connectToDatabase();
    // Find the user by email
    const user = await db.collection("users").findOne({
      email: email.toLowerCase(),
    });

    const isPasswordMatch = await bcrypt.compare(password, user?.password);

    if (!user || !isPasswordMatch) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Generate a JWT token with user details
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        name: user.name || user.displayName,
        email: email.toLowerCase(),
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );
    // Return the token
    return NextResponse.json({ token });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
