//create store for auth state management

import { User } from "@/types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  removeUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User | null) => set({ user }),
      removeUser: () => set({ user: null }),
    }),
    { name: "auth-storage" }
  )
);
