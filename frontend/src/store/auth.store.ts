import { create } from "zustand";

import type { User } from "../lib/api/schema";

type AuthState = {
  accessToken?: string;
  user?: User;
  setSession: (accessToken: string, user: User) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  setSession: (accessToken, user) => set({ accessToken, user }),
  clearSession: () => set({ accessToken: undefined, user: undefined }),
}));
