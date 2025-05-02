import { getToken } from "@/lib/auth-handlers";
import { TaskFormData } from "@/lib/validations";

export const taskRequester = async ({
  mode,
  data,
  completed,
  title,
  description,
  taskId,
}: {
  mode: "get" | "add" | "edit" | "delete" | "toggleComplete";
  data?: TaskFormData;
  completed?: boolean;
  title?: string;
  description?: string;
  taskId?: string;
}) => {
  const token = getToken();

  if (mode == "get") {
    const response = await fetch("/api/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
  if (mode == "add") {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: data && data.title,
        description: (data && data.description) || "",
      }),
    });
    return response;
  }
  if (mode == "toggleComplete") {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed }),
    });

    return response;
  }
  if (mode == "edit") {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, description }),
    });
    return response;
  }
  if (mode == "delete") {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  }
};
