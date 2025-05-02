import { z } from "zod";

// Validation schema for login form
export const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Validation schema for registration form
export const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .regex(/[A-Z]/, "La contraseña debe contener al menos una letra mayúscula")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "La contraseña debe contener al menos un símbolo"
    ),
});

// Validation schema for task form
export const taskSchema = z.object({
  title: z.string().min(1, "El título de la tarea no puede estar vacío"),
  description: z.string().optional(),
});

// Types inferred from schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type TaskFormData = z.infer<typeof taskSchema>;
