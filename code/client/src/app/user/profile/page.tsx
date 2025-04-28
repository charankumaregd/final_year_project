"use client";

import { useEffect, useState } from "react";
import { LoaderIcon, Trash2 } from "lucide-react";

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
import Header from "@/components/header";
import Loader from "@/components/loader";
import { useUserStore } from "@/store/user-store";
import { useSessionStore } from "@/store/session-store";
import { Session } from "@/types";

export default function Profile() {
  const user = useUserStore((state) => state.user);
  const sessions = useSessionStore((state) => state.sessions);
  const isSessionLoading = useSessionStore((state) => state.isLoading);
  const isSessionDeleting = useSessionStore((state) => state.isDeleting);
  const fetchSessions = useSessionStore((state) => state.fetchSessions);
  const deleteSession = useSessionStore((state) => state.deleteSession);

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isDeleteSessionDialogOpen, setIsDeleteSessionDialogOpen] =
    useState<boolean>(false);

  function handleDeleteSessionClick(session: Session) {
    setSelectedSession(session);
    setIsDeleteSessionDialogOpen(true);
  }

  async function handleConfirmDeleteSession() {
    if (selectedSession) {
      await deleteSession(selectedSession.id);
    }
    setIsDeleteSessionDialogOpen(false);
    setSelectedSession(null);
  }

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  if (isSessionLoading) {
    return <Loader />;
  }

  return (
    <>
      <Header variant="user" />
      <main>
        <h1 className="text-2xl font-bold">Profile Details</h1>

        <div className="flex flex-wrap items-center gap-8">
          <div
            className="flex justify-center items-center text-2xl font-semibold border rounded-2xl w-24 aspect-square"
            style={{ backgroundColor: user?.color }}
          >
            {user?.name.charAt(0).toUpperCase()}
          </div>

          <div className="flex flex-col space-y-2">
            <span className="text-xl font-semibold">{user?.name}</span>
            <span className="text-muted-foreground">{user?.email}</span>
            <span className="text-xs text-muted-foreground">
              Created at:{" "}
              {user && new Date(user.createdAt).toLocaleDateString()}
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
                    className="absolute right-3 top-3"
                  >
                    <Trash2 className="text-destructive" />
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
              Are you sure you want to delete this session? This action cannot
              be undone.
            </p>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setIsDeleteSessionDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDeleteSession}
              >
                {isSessionDeleting ? (
                  <LoaderIcon className="animate-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
