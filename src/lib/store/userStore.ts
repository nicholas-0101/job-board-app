import { create } from "zustand";

export interface User {
  id: number;
  name?: string | null;
  email: string;
  profilePicture?: string | null;
  role: "USER" | "ADMIN";
  passwordHash?: string | null;
  phone?: string | null;
  gender?: string | null;
  dob?: string | null;
  education?: string | null;
  address?: string | null;
  city?: string | null;
  isProfileComplete?: boolean;
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
    [
      "token",
      "verifiedToken",
      "user",
      "verifiedUser",
      "role",
      "userId",
      "companyId",
      "isProfileComplete",
    ].forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch {
        // ignore storage errors
      }
    });
    set({ user: null });
  },
}));
