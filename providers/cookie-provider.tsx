"use client";

import type { ReactNode } from "react";
import { CookiesProvider } from "react-cookie";

// Provides cookie context to the app
export function CookieProvider({ children }: { children: ReactNode }) {
  return <CookiesProvider>{children}</CookiesProvider>;
}
