import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");

  const tokenCheck = token && JSON.parse(atob(token.value.split(".")[1]));

  if (tokenCheck) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
}

export const config = {
  matcher: ["/login", "/register", "/"],
};
