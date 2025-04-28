import { toast } from "sonner";
import { create } from "zustand";

import { api } from "@/lib/api";
import { Session } from "@/types";

type SessionStore = {
  sessions: Session[];
  isLoading: boolean;
  isDeleting: string | null;
  fetchSessions: () => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
};

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessions: [],
  isLoading: true,
  isDeleting: null,

  fetchSessions: async () => {
    try {
      set({ isLoading: true });

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

      set({ sessions });
    } catch (error: unknown) {
      set({ sessions: [] });

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSession: async (sessionId: string) => {
    try {
      set({ isDeleting: sessionId });

      await api(`/api/session/${sessionId}`, {
        method: "DELETE",
        credentials: "include",
      });

      set({
        sessions: get().sessions.filter((session) => session.id !== sessionId),
      });

      toast.success("Session deleted successfully.");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      set({ isDeleting: null });
    }
  },
}));
