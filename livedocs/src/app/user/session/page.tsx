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
  const { sessions, loading, error, deleteSession, deleting } = useSession();

  if (loading) {
    return (
      <main>
        <h1>My Sessions</h1>
        <LoaderCircle className="animate-spin" />
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <h1>My Sessions</h1>
        <p>Error {error}</p>
      </main>
    );
  }

  if (sessions.length === 0) {
    return (
      <main>
        <h1>My Sessions</h1>
        <p>No active sessions found.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>My Sessions</h1>

      {sessions.map((session) => (
        <Card key={session.id}>
          <CardHeader>
            <CardTitle>
              <span>{new Date(session.createdAt).toLocaleString("en-US")}</span>
              <span>{session.isCurrent && " (current session)"}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{session.userAgent}</CardDescription>
          </CardContent>
          <CardFooter>
            {!session.isCurrent && (
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
            )}
          </CardFooter>
        </Card>
      ))}
    </main>
  );
}
