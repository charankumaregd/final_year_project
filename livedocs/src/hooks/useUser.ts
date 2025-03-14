import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
}

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  async function fetchUser() {
    try {
      setLoading(true);

      const response = await api("/api/user");

      const data = await response.json();

      setUser(data.user);

      setIsAuthenticated(true);
    } catch (error: unknown) {
      setUser(null);

      setIsAuthenticated(false);

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      setIsLoggingOut(true);

      await api("/api/logout");

      toast.success("Logged out successfully");

      router.replace("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred");
      }
    } finally {
      setIsLoggingOut(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, isAuthenticated, logout, isLoggingOut };
}
