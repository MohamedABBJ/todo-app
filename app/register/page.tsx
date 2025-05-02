"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/lib/auth-handlers";
import { registerSchema, type RegisterFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Setup form validation and state
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Handle registration form submission
  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);

    try {
      const success = await registerUser(data.name, data.email, data.password);
      if (success) {
        toast.success("Registro exitoso");
        router.push("/login");
      } else {
        toast.error(
          "El registro falló. Es posible que el correo electrónico ya esté en uso."
        );
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
            Registro
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            Crea una cuenta para gestionar tus tareas
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 pt-0 space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nombre
              </label>
              <Input
                id="name"
                type="text"
                {...register("name")}
                placeholder="Nombre"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Correo Electrónico
              </label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                placeholder="tu@ejemplo.com"
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
              <p className="text-xs text-muted-foreground">
                La contraseña debe tener al menos 6 caracteres, una letra
                mayúscula y un símbolo.
              </p>
            </div>
          </div>
          <div className="flex items-center p-6 pt-0 flex-col space-y-4">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Registrando..." : "Registrarse"}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Iniciar Sesión
              </Link>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
