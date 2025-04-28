import { toast } from "sonner";
import { create } from "zustand";

import { api } from "@/lib/api";
import { ActiveUser, User } from "@/types";

type UserStore = {
  user: User | null;
  activeUsers: ActiveUser[];
  isLoading: boolean;
  isAuthenticated: boolean;
  isLoggingOut: boolean;
  fetchUser: (pathname?: string) => Promise<void>;
  setActiveUsers: (activeUsers: ActiveUser[]) => void;
  logout: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  activeUsers: [],
  isLoading: true,
  isAuthenticated: false,
  isLoggingOut: false,

  fetchUser: async (pathname) => {
    try {
      set({ isLoading: true });

      const response = await api("/api/user");
      const data = await response.json();

      set({
        user: data.user,
        isAuthenticated: !!data.user,
      });
    } catch (error: unknown) {
      set({ user: null, isAuthenticated: false });

      if (pathname?.startsWith("/user")) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unknown error occurred");
        }
      }
    } finally {
      set({ isLoading: false });
    }
  },

  setActiveUsers: (activeUsers) => {
    set({ activeUsers });
  },

  logout: async () => {
    try {
      set({ isLoggingOut: true });

      await api("/api/logout");

      set({ isAuthenticated: false });

      useUserStore.setState({ user: null });

      toast.success("Logged out successfully");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      set({ isLoggingOut: false });
    }
  },
}));
