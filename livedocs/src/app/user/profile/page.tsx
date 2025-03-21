"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { LoaderCircle, Trash2, User2 } from "lucide-react";
import useUser from "@/hooks/useUser";
import useSession, { Session } from "@/hooks/useSession";

export default function Profile() {
  const { user, loading: userLoading } = useUser();
  const {
    sessions,
    loading: sessionLoading,
    deleteSession,
    deleting,
  } = useSession();

  const [isDeleteSessionDialogOpen, setIsDeleteSessionDialogOpen] =
    useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const handleDeleteSessionClick = (session: Session) => {
    setSelectedSession(session);
    setIsDeleteSessionDialogOpen(true);
  };

  const handleConfirmDeleteSession = () => {
    if (selectedSession) {
      deleteSession(selectedSession.id);
    }
    setIsDeleteSessionDialogOpen(false);
    setSelectedSession(null);
  };

  if (userLoading || sessionLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  return (
    <main>
      <h1 className="text-2xl font-bold">Profile Details</h1>

      <div className="flex flex-wrap items-center gap-8">
        <div className="flex justify-center items-center bg-secondary border rounded-xl p-8 w-fit h-fit">
          <User2 className="w-8 h-8" />
        </div>

        <div className="flex flex-col space-y-2">
          <span className="text-xl font-semibold">{user?.name}</span>
          <span className="text-muted-foreground">{user?.email}</span>
          <span className="text-xs text-muted-foreground">
            Created at: {user && new Date(user.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <h1 className="text-2xl font-bold">My Sessions</h1>

      <div className="space-y-4">
        {sessions.length === 0 ? (
          <p className="text-muted-foreground">No active sessions found.</p>
        ) : (
          sessions.map((session) => (
            <Card key={session.id} className="relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 justify-between">
                  <span className="text-nowrap">
                    {new Date(session.createdAt).toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground text-nowrap">
                    {session.isCurrent && " (current session)"}
                  </span>
                </CardTitle>
                <CardDescription>{session.userAgent}</CardDescription>
              </CardHeader>
              {!session.isCurrent && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteSessionClick(session)}
                  disabled={deleting === session.id}
                  className="absolute right-3 top-3"
                >
                  {deleting === session.id ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <Trash2 className="text-destructive-foreground" />
                  )}
                </Button>
              )}
            </Card>
          ))
        )}
      </div>

      <Dialog
        open={isDeleteSessionDialogOpen}
        onOpenChange={setIsDeleteSessionDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Session</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this session? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteSessionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDeleteSession}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

/*
            <Card
              key={session.id}
              className="flex flex-row items-start justify-between"
            >
              <div className="space-y-4">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{new Date(session.createdAt).toLocaleString()}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{session.userAgent}</CardDescription>
                </CardContent>
              </div>
              <CardFooter>
                <span className="text-sm text-muted-foreground">
                  {session.isCurrent && " (current session)"}
                </span>
              </CardFooter>
              {!session.isCurrent && (
                <CardFooter>
                  <Button
                    variant="ghost"
                    onClick={() => handleDeleteSessionClick(session)}
                    disabled={deleting === session.id}
                  >
                    {deleting === session.id ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      <Trash2 className="text-destructive-foreground" />
                    )}
                  </Button>
                </CardFooter>
              )}
            </Card>
 */
