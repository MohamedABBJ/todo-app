"use client";

import { TaskItemDeleteModal } from "@/components/task-item-delete-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCheckAuth } from "@/hooks/use-check-auth";
import type { TaskItemProps } from "@/lib/interfaces";
import { taskSchema, type TaskFormData } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, ChevronUp, Edit, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function TaskItem({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { authHandler } = useCheckAuth();

  // Setup form for editing a task
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task.title,
      description: task.description || "",
    },
  });

  // Enable editing mode and set form values
  const startEditing = () => {
    setValue("title", task.title);
    setValue("description", task.description || "");
    setIsEditing(true);
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
  };

  // Submit edited task
  const submitEdit = (data: TaskFormData) => {
    if (authHandler()) {
      onEdit(task._id, data.title, data.description || "");
      setIsEditing(false);
    }
  };

  // Expand/collapse task description
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-lg border bg-card text-card-foreground shadow-sm mb-4"
      >
        <div className="p-4">
          {isEditing ? (
            <form onSubmit={handleSubmit(submitEdit)} className="space-y-4">
              <div>
                <Input {...register("title")} autoFocus className="w-full" />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div>
                <Textarea
                  {...register("description")}
                  className="w-full min-h-[100px]"
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={cancelEditing}
                >
                  <X className="w-4 h-4 mr-1" /> Cancelar
                </Button>
                <Button type="submit" size="sm">
                  <Check className="w-4 h-4 mr-1" /> Guardar
                </Button>
              </div>
            </form>
          ) : (
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  {/* Custom Checkbox for completion */}
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      id={`task-${task._id}`}
                      className="peer absolute h-4 w-4 opacity-0"
                      checked={task.completed}
                      onChange={(e) => {
                        if (authHandler()) {
                          onToggleComplete(task._id, e.target.checked);
                        }
                      }}
                    />
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded border border-primary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                        task.completed
                          ? "bg-primary text-primary-foreground"
                          : "bg-background"
                      }`}
                    >
                      {task.completed && (
                        <Check className="h-3 w-3 text-current" />
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4 align-middle min-w-0 ">
                    <label
                      className={`text-lg font-medium break-words whitespace-normal w-11/12 block ${
                        task.completed && "line-through text-muted-foreground"
                      }`}
                    >
                      {task.title}
                    </label>
                    {task.description && (
                      <button
                        onClick={toggleExpand}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={startEditing}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-9 w-9 hover:bg-accent hover:text-accent-foreground text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-9 w-9 hover:bg-accent hover:text-accent-foreground text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {task.description && isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 ml-8 text-sm text-muted-foreground whitespace-pre-wrap overflow-hidden"
                  >
                    {task.description}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

      {/* Modal for confirming task deletion */}
      <TaskItemDeleteModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        onDelete={onDelete}
        task={task}
        authHandler={authHandler}
      />
    </>
  );
}
