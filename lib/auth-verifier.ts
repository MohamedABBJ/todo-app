import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { DecodedToken } from "./interfaces";

// Verifies the JWT from the Authorization header in the request
export async function verifyAuth(
  request: NextRequest
): Promise<DecodedToken | null> {
  try {
    const authHeader = request.headers.get("authorization");

    // Check if the Authorization header is present and properly formatted
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    // Extract the token from the header
    const token = authHeader.split(" ")[1];

    // Ensure the JWT secret is defined
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (error) {
    console.error("Auth verification error:", error);
    return null;
  }
}
