"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";

export function useVerifyRedirect() {
  const router = useRouter();
  const { user } = useUserStore();

  const handleRedirect = () => {
    let role = user?.role;

    if (!role) {
      try {
        role =
          (localStorage.getItem("role") as "ADMIN" | "USER" | null) ??
          JSON.parse(localStorage.getItem("verifiedUser") || "{}")?.role;
      } catch {
        role = user?.role;
      }
    }

    const profileCompleteFlag =
      localStorage.getItem("isProfileComplete") === "true";

    const target =
      role === "ADMIN"
        ? profileCompleteFlag
          ? "/admin"
          : "/admin/profile/complete"
        : profileCompleteFlag
        ? "/"
        : "/profile/complete";

    router.push(target);
  };

  return {
    handleRedirect,
  };
}
