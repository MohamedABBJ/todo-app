import { CookieProvider } from "@/providers/cookie-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ToastProvider } from "@/providers/toast-provider";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";

//Adding font that will be used on body class
const inter = Inter({ subsets: ["latin"] });

//Metadata
export const metadata = {
  title: "Todo App",
  description: "Una aplicación web para gestionar tareas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <CookieProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <ToastProvider />
          </ThemeProvider>
        </CookieProvider>
      </body>
    </html>
  );
}
