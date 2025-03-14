"use client";

import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function Profile() {
  const { user, loading, isAuthenticated } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
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
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    router.replace("/login");
    return null;
  }

  return (
    <main>
      <h1>Profile</h1>
      <p>
        <span>Name:</span> {user.name}
      </p>
      <p>
        <span>Email:</span> {user.email}
      </p>
      <Button onClick={handleLogout} disabled={isLoggingOut}>
        {isLoggingOut ? <LoaderCircle className="animate-spin" /> : "Logout"}
      </Button>
    </main>
  );
}
