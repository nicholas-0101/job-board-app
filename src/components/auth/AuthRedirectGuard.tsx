"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";

interface AuthRedirectGuardProps {
  children: React.ReactNode;
}

export default function AuthRedirectGuard({ children }: AuthRedirectGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useUserStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const savedUser = localStorage.getItem("verifiedUser");

    // restore user if available
    if (!user && savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // If user has token and is on /auth/... route → redirect accordingly
    if (token && pathname.startsWith("/auth")) {
      if (role === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
      return;
    }

    setChecking(false);
  }, [user, setUser, pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#24CFA7]" />
      </div>
    );
  }

  return <>{children}</>;
}