"use client";

import { LoaderCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useSession from "@/hooks/useSession";

export default function Sessions() {
  const { sessions, loading, deleteSession, deleting } = useSession();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  return (
    <main>
      <h1>My Sessions</h1>

      {sessions.length === 0 ? (
        <p>No active sessions found.</p>
      ) : (
        sessions.map((session) => (
          <Card key={session.id}>
            <CardHeader>
              <CardTitle>
                <span>
                  {new Date(session.createdAt).toLocaleString("en-US")}
                </span>
                <span>{session.isCurrent && " (current session)"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{session.userAgent}</CardDescription>
            </CardContent>
            {!session.isCurrent && (
              <CardFooter>
                <Button
                  variant="destructive"
                  onClick={() => deleteSession(session.id)}
                  disabled={deleting === session.id}
                >
                  {deleting === session.id ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </Button>
              </CardFooter>
            )}
          </Card>
        ))
      )}
    </main>
  );
}
