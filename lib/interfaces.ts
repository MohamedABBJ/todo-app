// Represents a task item
export interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// Represents a user
export interface User {
  _id: string;
  name: string;
  email: string;
}

// Represents the props for the task delete confirmation modal
export interface TaskItemDeleteModalProps {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  onDelete: (taskId: string) => void;
  task: { _id: string };
  authHandler: () => boolean;
}

// Represents the props for a single task item component
export interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string, description: string) => void;
}

// Decoded JWT token structure
export interface DecodedToken {
  userId: string;
  name: string;
  email: string;
}

// Options for rate limiting
export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

// Props for the custom Button component
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
}
