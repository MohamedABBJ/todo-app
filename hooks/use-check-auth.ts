import { getToken } from "@/lib/auth-handlers";
import { useRouter } from "next/navigation";

export const useCheckAuth = () => {
  const router = useRouter();

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
