"use client"

import { CookiesProvider } from "react-cookie"
import type { ReactNode } from "react"

export function CookieProvider({ children }: { children: ReactNode }) {
  return <CookiesProvider>{children}</CookiesProvider>
}
