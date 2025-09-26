import { create } from "zustand";

export interface User {
  id: number;
  name: string;
  email: string;
  profilePicture?: string | null;
}

interface UserState {
  user: User | null;
  setUser: (u: User | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
  },
}));