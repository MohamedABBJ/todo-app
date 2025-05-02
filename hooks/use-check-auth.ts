import { getToken } from "@/lib/auth-handlers";
import { useRouter } from "next/navigation";

// Custom hook to check authentication and redirect if not authenticated
export const useCheckAuth = () => {
  const router = useRouter();

  // Checks for token, redirects to login if not found
  const authHandler = () => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return false;
    }
    return true;
  };

  return { authHandler };
};
