"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/helper/axios";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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

        // Verify token with backend
        const response = await apiCall.get("/auth/keep");

        if (mounted) {
          if (response.data.success && response.data.data.role === "ADMIN") {
            setAllowed(true);
          } else {
            router.replace("/auth/signin");
          }
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        if (mounted) {
          // Clear invalid tokens
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("userId");
          localStorage.removeItem("companyId");
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
  }, [router]);

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


