"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/helper/axios";
import { useUserStore } from "@/lib/store/userStore";
import { Building2, Edit, MonitorSmartphone, User } from "lucide-react";
import { SidebarHeader } from "./components/SidebarHeader";
import { SidebarNav } from "./components/SidebarNav";
import { SidebarActions } from "./components/SidebarActions";
import { MobileNotice } from "./components/MobileNotice";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  isActive: boolean;
};

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUserStore();

  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [loadingCompany, setLoadingCompany] = useState(true);
  const [viewportWidth, setViewportWidth] = useState<number | null>(() =>
    typeof window === "undefined" ? null : window.innerWidth
  );

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoadingCompany(false);
        return;
      }

      try {
        const resp = await apiCall.get("/company/admin");
        const data = resp.data?.data ?? resp.data;
        setCompanyInfo(data ?? null);

        if (data?.id) {
          localStorage.setItem("companyId", data.id.toString());
        }
      } catch (err: any) {
        console.error("Failed to load company info:", err);

        if (err?.response?.status === 500) {
          console.warn(
            "Server error loading company info - this is expected for new admins"
          );
        } else if (err?.response?.status === 404) {
          console.warn("Company not found - admin needs to complete profile");
          if (err?.response?.data?.needsProfileCompletion) {
            console.info(
              "Admin needs to complete profile to create company record"
            );
          }
        }

        setCompanyInfo(null);
      } finally {
        setLoadingCompany(false);
      }
    };

    const timer = setTimeout(fetchCompanyInfo, 120);
    return () => clearTimeout(timer);
  }, []);

  const onLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("verifiedToken");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      localStorage.removeItem("companyId");

      const { setUser } = useUserStore.getState();
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }

    router.replace("/");
  };

  const isProfileCompletionPage = pathname?.startsWith(
    "/admin/profile/complete"
  );

  const isMobileViewport =
    viewportWidth !== null ? viewportWidth < 768 : false;

  const navigationItems: NavItem[] = useMemo(
    () => [
      {
        href: "/admin",
        label: "Overview",
        isActive: pathname === "/admin",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#467EC7] transition-transform"
            aria-hidden
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        ),
      },
      {
        href: "/admin/jobs",
        label: "Jobs",
        isActive: pathname?.startsWith("/admin/jobs") ?? false,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#467EC7] transition-transform"
            aria-hidden
          >
            <path d="M3 4a2 2 0 0 1 2-2h3.5l1 2H19a2 2 0 0 1 2 2v11" />
            <rect width="18" height="8" x="3" y="13" rx="2" />
          </svg>
        ),
      },
      {
        href: "/admin/interviews",
        label: "Interviews",
        isActive: pathname?.startsWith("/admin/interviews") ?? false,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#467EC7] transition-transform"
            aria-hidden
          >
            <path d="M8 2v4" />
            <path d="M16 2v4" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M3 10h18" />
          </svg>
        ),
      },
      {
        href: "/admin/applicants",
        label: "Applicants",
        isActive: pathname?.startsWith("/admin/applicants") ?? false,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#467EC7] transition-transform"
            aria-hidden
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
      },
      {
        href: "/admin/preselection",
        label: "Pre-Selection",
        isActive: pathname?.startsWith("/admin/preselection") ?? false,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#467EC7] transition-transform"
            aria-hidden
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="9" x2="15" y1="15" y2="15" />
          </svg>
        ),
      },
      {
        href: "/admin/analytics",
        label: "Analytics",
        isActive: pathname?.startsWith("/admin/analytics") ?? false,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#467EC7] transition-transform"
            aria-hidden
          >
            <line x1="12" x2="12" y1="20" y2="10" />
            <line x1="18" x2="18" y1="20" y2="4" />
            <line x1="6" x2="6" y1="20" y2="16" />
          </svg>
        ),
      },
    ],
    [pathname]
  );

  const renderMobileNotice = () => <MobileNotice />;

  const renderDesktopLayout = () => (
    isProfileCompletionPage ? (
      <div className="min-h-screen">
        {children}
      </div>
    ) : (
      <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-secondary-50 to-background">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:py-8 md:grid-cols-[260px_1fr] md:gap-6">
          <aside className="h-fit min-w-0 md:sticky md:top-24">
            <Card className="border-t-4 border-t-[#24CFA7] shadow-lg">
              <CardHeader className="pb-4">
                <SidebarHeader userName={user?.name} />
              </CardHeader>
              <CardContent className="space-y-4">
                <SidebarNav items={navigationItems as any} />
                <SidebarActions onLogout={onLogout} />
              </CardContent>
            </Card>
          </aside>

          <section className="min-w-0">{children}</section>
        </div>
      </div>
    )
  );

  return (
    <AdminGuard>
      {isMobileViewport ? renderMobileNotice() : renderDesktopLayout()}
    </AdminGuard>
  );
}
