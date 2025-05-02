import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { DecodedToken } from "./interfaces";

export async function verifyAuth(
  request: NextRequest
): Promise<DecodedToken | null> {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
    return decoded;
  } catch (error) {
    console.error("Auth verification error:", error);
    return null;
  }
}
