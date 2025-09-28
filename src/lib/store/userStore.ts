import { create } from "zustand";

export interface User {
  id: number;
  name: string;
  email: string;
  profilePicture?: string | null;
  role: "USER" | "ADMIN";
  passwordHash?: string | null;

  // ADMIN 
  phone?: string;
  location?: string;
  description?: string;
  website?: string;
  logo?: string;

  // USER 
  gender?: string;
  dob?: string;
  education?: string;
  address?: string;
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