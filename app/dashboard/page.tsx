"use client";

import TaskItem from "@/components/task-item";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Textarea } from "@/components/ui/textarea";
import { getToken, logout } from "@/lib/auth-handlers";
import type { Task } from "@/lib/interfaces";
import { taskSchema, type TaskFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { taskRequester } from "../../lib/task-requester";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Form setup for adding a new task
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Check authentication and fetch tasks on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = (await taskRequester({ mode: "get" })) as Response;

        if (!response.ok) {
          if (response.status === 401) {
            logout();
            router.push("/login");
            return;
          }
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        setTasks(data);
      } catch (err) {
        console.error(err);
        toast.error("Ocurrió un error");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Add a new task
  const handleAddTask = async (data: TaskFormData) => {
    try {
      const response = (await taskRequester({
        mode: "add",
        data: data,
      })) as Response;

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      const newTask = await response.json();
      setTasks((prevTasks) => [newTask, ...prevTasks]);
      reset();
      toast.success("Tarea añadida exitosamente");
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error");
    }
  };

  // Toggle task completion
  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    try {
      const response = (await taskRequester({
        mode: "toggleComplete",
        taskId: taskId,
        completed: completed,
      })) as Response;

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, completed } : task
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error");
    }
  };

  // Edit a task
  const handleEditTask = async (
    taskId: string,
    title: string,
    description: string
  ) => {
    try {
      const response = (await taskRequester({
        mode: "edit",
        taskId: taskId,
        title: title,
        description: description,
      })) as Response;

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, title, description } : task
        )
      );
      toast.success("Tarea actualizada exitosamente");
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error");
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = (await taskRequester({
        mode: "delete",
        taskId: taskId,
      })) as Response;

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks(tasks.filter((task) => task._id !== taskId));
      toast.success("Tarea eliminada exitosamente");
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error");
    }
  };

  // Logout and redirect to login
  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Tus Tareas</h1>
          <div className="flex items-center space-x-2">
            <ThemeSwitcher />
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>

        {/* Form to add a new task */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-lg border bg-card text-card-foreground shadow-sm mb-6"
        >
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">
              Añadir Nueva Tarea
            </h3>
          </div>
          <div className="p-6 pt-0">
            <form onSubmit={handleSubmit(handleAddTask)} className="space-y-4">
              <div>
                <Input
                  {...register("title")}
                  placeholder="Ingresa el título de la tarea..."
                  className="w-full"
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <Textarea
                  {...register("description")}
                  placeholder="Ingresa la descripción de la tarea (opcional)..."
                  className="w-full min-h-[100px]"
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="w-full  flex justify-end">
                <Button type="submit" className="border w-full md:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Añadir Tarea
                </Button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Task list */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {tasks.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg border bg-card text-card-foreground shadow-sm"
              >
                <div className="p-6 text-center text-muted-foreground">
                  No hay tareas aún. ¡Añade tu primera!
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="task-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {tasks.map((task) => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTask}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
