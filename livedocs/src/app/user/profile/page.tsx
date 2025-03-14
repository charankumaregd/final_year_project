"use client";

import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { user, loading, isAuthenticated, logout, isLoggingOut } = useUser();
  const router = useRouter();

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
      <Button onClick={logout} disabled={isLoggingOut}>
        {isLoggingOut ? <LoaderCircle className="animate-spin" /> : "Logout"}
      </Button>
    </main>
  );
}
