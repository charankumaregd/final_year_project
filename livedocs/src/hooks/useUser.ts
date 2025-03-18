import { api } from "@/lib/api";
import { useEffect, useState } from "react";
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

  async function fetchUser() {
    try {
      setLoading(true);

      const response = await api("/api/user");

      const data = await response.json();

      setUser(data.user);

      localStorage.setItem("isAuthenticated", "true");
    } catch (error: unknown) {
      setUser(null);

      localStorage.removeItem("isAuthenticated");

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading };
}
