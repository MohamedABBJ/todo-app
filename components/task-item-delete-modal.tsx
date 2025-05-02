import { TaskItemDeleteModalProps } from "@/lib/interfaces";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./ui/button";

export function TaskItemDeleteModal({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  onDelete,
  task,
  authHandler,
}: TaskItemDeleteModalProps) {
  if (!isDeleteModalOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={() => setIsDeleteModalOpen(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-background rounded-lg shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Confirmar Eliminación</h2>
          <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-9 w-9 hover:bg-accent hover:text-accent-foreground"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </button>
        </div>
        <div className="p-4">
          <p>¿Estás seguro de que quieres eliminar esta tarea?</p>
        </div>
        <div className="p-4 border-t flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            No
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (authHandler()) {
                onDelete(task._id);
                setIsDeleteModalOpen(false);
              }
            }}
          >
            Sí
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
