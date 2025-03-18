"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { LoaderCircle } from "lucide-react";
import useUser from "@/hooks/useUser";
import useAuth from "@/hooks/useAuth";

export default function Profile() {
  const { user, loading } = useUser();
  const { logout, isLoggingOut } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  return (
    <main className="max-w-2xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Name : {user?.name}</p>
          <p>Email : {user?.email}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={logout} disabled={isLoggingOut}>
            {isLoggingOut ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Logout"
            )}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
