import { api } from "@/lib/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface Session {
  id: string;
  userAgent: string;
  createdAt: string;
  isCurrent: boolean;
}

export default function useSession() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function fetchSessions() {
    try {
      setLoading(true);

      const response = await api("/api/session");

      const currentSessionId = response.headers.get("sessionId");

      if (!currentSessionId) {
        throw new Error("Session ID not found in response headers");
      }

      const data = await response.json();

      const sessions = data.sessions.map((session: Session) => ({
        ...session,
        isCurrent: session.id === currentSessionId,
      }));

      setSessions(sessions);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  async function deleteSession(sessionId: string) {
    try {
      setDeleting(sessionId);

      await api(`/api/session/${sessionId}`, {
        method: "DELETE",
        credentials: "include",
      });

      setSessions((prevSessions) =>
        prevSessions.filter((session) => session.id !== sessionId)
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setDeleting(null);
    }
  }

  useEffect(() => {
    fetchSessions();
  }, []);

  return { sessions, loading, deleteSession, deleting };
}
