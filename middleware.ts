import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Middleware to redirect authenticated users away from login/register/home
export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");

  // Decode JWT payload to check if token exists and is valid
  const tokenCheck = token && JSON.parse(atob(token.value.split(".")[1]));

  // If user is authenticated, redirect to dashboard
  if (tokenCheck) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
}

// Apply middleware to these routes
export const config = {
  matcher: ["/login", "/register", "/"],
};
