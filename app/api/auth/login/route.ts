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
    // Retrieve all users from the "users" collection
    const users = await db.collection("users").find({}).toArray();

    // Iterate through the list of users to find a match
    for (const user of users) {
      // Compare the provided email with the stored email
      const isEmailMatch = await bcrypt.compare(
        email.toLowerCase(),
        user.email
      );
      // Compare the provided password with the stored one
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      // If both email and password match, let the user log in
      if (isEmailMatch && isPasswordMatch) {
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
      }

      // If either email or password does not match, return an error
      if (!isEmailMatch || !isPasswordMatch) {
        return NextResponse.json(
          { error: "Credenciales inválidas" },
          { status: 401 }
        );
      }
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
