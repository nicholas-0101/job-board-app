"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";

interface PublicOnlyGuardProps {
  children: React.ReactNode;
}

export default function PublicOnlyGuard({ children }: PublicOnlyGuardProps) {
  const router = useRouter();
  const { user } = useUserStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // If no token, allow access (public pages)
    if (!token) return;

    // If admin is logged in, redirect to admin
    if (role === "ADMIN") {
      console.log("🔒 Admin logged in, redirecting to admin panel");
      router.replace("/admin");
      return;
    }

    // If user is logged in, redirect to explore jobs (better landing page)
    if (role === "USER") {
      console.log("🔒 User logged in, redirecting to explore jobs");
      router.replace("/explore/jobs");
      return;
    }
  }, [mounted, user, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#24CFA7]"></div>
      </div>
    );
  }

  return <>{children}</>;
}
