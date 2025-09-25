"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "ADMIN") {
      router.replace("/signin");
      return;
    }
    setAllowed(true);
  }, [router]);

  if (!allowed) return null;
  return <>{children}</>;
}


