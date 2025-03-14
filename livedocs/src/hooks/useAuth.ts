import { api } from "@/lib/api";
import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
}

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

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
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, error, isAuthenticated };
}
