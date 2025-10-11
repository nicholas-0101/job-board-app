"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";

interface AuthRedirectGuardProps {
  children: React.ReactNode;
}

const getStoredRole = () => {
  const role = localStorage.getItem("role");
  if (role === "ADMIN" || role === "USER") return role;

  try {
    const savedUser = localStorage.getItem("user") || localStorage.getItem("verifiedUser");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      if (parsed?.role === "ADMIN" || parsed?.role === "USER") {
        return parsed.role as "ADMIN" | "USER";
      }
    }
  } catch {
    // ignore parsing issues
  }

  return null;
};

const getProfileCompletionFlag = () => {
  const flag = localStorage.getItem("isProfileComplete");
  if (flag === "true") return true;
  if (flag === "false") return false;
  return null;
};

export default function AuthRedirectGuard({ children }: AuthRedirectGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useUserStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("verifiedUser");

    if (!user && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        // ignore invalid saved user data
      }
    }

    if (!token || !pathname.startsWith("/auth")) {
      setChecking(false);
      return;
    }

    // Allow access to the verification route until the process completes.
    if (pathname.startsWith("/auth/verify")) {
      setChecking(false);
      return;
    }

    const role = getStoredRole();
    const profileFlag = getProfileCompletionFlag();
    const isProfileComplete = profileFlag === null ? true : profileFlag;

    if (role === "ADMIN") {
      setChecking(false);
      router.replace(isProfileComplete ? "/admin" : "/admin/profile/complete");
      return;
    }

    setChecking(false);
    router.replace(isProfileComplete ? "/" : "/profile/complete");
  }, [pathname, router, setUser, user]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#24CFA7]" />
      </div>
    );
  }

  return <>{children}</>;
}
