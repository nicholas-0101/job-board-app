"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@/helper/axios";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";

export function UserGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          // No token, allow access (public pages)
          setAllowed(true);
          setLoading(false);
          return;
        }

        // Verify token with backend
        const response = await apiCall.get("/auth/keep");

        if (response.data.success) {
          const data = response.data.data;
          const userRole = data.role;
          const isProfileComplete = Boolean(data.isProfileComplete);
          const refreshedToken = data.token;

          if (refreshedToken) {
            localStorage.setItem("token", refreshedToken);
          }
          if (userRole) {
            localStorage.setItem("role", userRole);
          }
          localStorage.setItem(
            "isProfileComplete",
            isProfileComplete ? "true" : "false"
          );

          // Admins and developers should not access user pages
          if (userRole === "ADMIN") {
            router.replace(
              isProfileComplete ? "/admin" : "/admin/profile/complete"
            );
            setLoading(false);
            return;
          }

          if (userRole === "DEVELOPER") {
            router.replace("/developer");
            setLoading(false);
            return;
          }

          if (!isProfileComplete && userRole === "USER") {
            router.replace("/profile/complete");
            setLoading(false);
            return;
          }

          setAllowed(true);
        } else {
          // Invalid token, allow access but token will be handled by other auth flows
          setAllowed(true);
        }
      } catch (error) {
        console.log("Auth verification failed:", error);
        // On error, allow access (user might not be logged in)
        setAllowed(true);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-50 to-background">
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

  // If not allowed (admin/developer), don't render children
  if (!allowed) return null;
  
  return <>{children}</>;
}

