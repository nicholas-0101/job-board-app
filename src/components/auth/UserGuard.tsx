"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiCall } from "@/helper/axios";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";

export function UserGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
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
          const userRole = response.data.data.role;
          
          // Allow admin to access ONLY profile edit/complete pages (for company profile editing)
          const allowedProfilePages = ['/profile/edit', '/profile/complete'];
          const isAllowedProfilePage = allowedProfilePages.some(page => pathname === page);
          
          // STRICT: Block admin from accessing user pages (except profile edit/complete)
          if (userRole === "ADMIN" && !isAllowedProfilePage) {
            console.log("Admin user blocked from user pages, redirecting to admin dashboard");
            router.replace("/admin");
            setLoading(false);
            // Don't set allowed to true - keep admin blocked
            return;
          }
          
          // STRICT: Block developer from accessing user pages
          if (userRole === "DEVELOPER") {
            console.log("Developer user blocked from user pages, redirecting to developer dashboard");
            router.replace("/developer");
            setLoading(false);
            // Don't set allowed to true - keep developer blocked
            return;
          }
          
          // Allow USER role, ADMIN on profile pages, or public
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
  }, [router, pathname]);

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

