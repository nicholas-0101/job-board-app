"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiCall } from "@/helper/axios";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token || role !== "ADMIN") {
          if (mounted) {
            router.replace("/auth/signin");
            setLoading(false);
          }
          return;
        }

        const response = await apiCall.get("/auth/keep");

        if (!mounted) return;

        if (response.data.success && response.data.data.role === "ADMIN") {
          const data = response.data.data;
          const refreshedToken = data.token;
          const isProfileComplete = Boolean(data.isProfileComplete);

          if (refreshedToken) {
            localStorage.setItem("token", refreshedToken);
          }
          localStorage.setItem("role", "ADMIN");
          localStorage.setItem(
            "isProfileComplete",
            isProfileComplete ? "true" : "false"
          );

          const onCompletionFlow = pathname.startsWith("/admin/profile/complete");

          if (!isProfileComplete && !onCompletionFlow) {
            setAllowed(false);
            router.replace("/admin/profile/complete");
            return;
          }

          setAllowed(true);
        } else {
          router.replace("/auth/signin");
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        if (mounted) {
          ["token", "role", "userId", "companyId", "isProfileComplete"].forEach(
            (key) => {
              try {
                localStorage.removeItem(key);
              } catch {
                // ignore
              }
            }
          );
          router.replace("/auth/signin");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center justify-center py-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader className="w-8 h-8 text-[#24CFA7]" />
          </motion.div>
        </div>
      </div>
    );
  }

  if (!allowed) return null;
  return <>{children}</>;
}

