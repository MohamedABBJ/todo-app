"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Todo App</h1>
          <p className="mt-3 text-muted-foreground">
            Gestiona tus tareas de manera eficiente
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <Button className="w-full">
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
          <Button variant="outline" className="w-full">
            <Link href="/register">Registrarse</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
