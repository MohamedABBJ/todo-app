"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/lib/auth-handlers";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);

    try {
      const success = await loginUser(data.email, data.password);
      if (success) {
        toast.success("Inicio de sesión exitoso");
        router.push("/dashboard");
      } else {
        toast.error("Correo electrónico o contraseña inválidos");
      }
    } catch (err) {
      toast.error("Ocurrió un error. Por favor, inténtalo de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-lg border bg-card text-card-foreground shadow-sm"
      >
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="text-2xl font-semibold leading-none tracking-tight text-center">
            Iniciar Sesión
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            Ingresa tus credenciales
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 pt-0 space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Correo Electrónico
              </label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="mail@ejemplo.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="••••••••••"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center p-6 pt-0 flex-col space-y-4">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              {`¿No tienes una cuenta? `}
              <Link href="/register" className="text-primary hover:underline">
                Registrarse
              </Link>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
