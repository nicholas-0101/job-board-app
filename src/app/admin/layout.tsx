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

  const renderMobileNotice = () => (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#1d2b53] via-[#233b6d] to-[#0f172a] px-6 py-16 text-white">
      <div className="mx-auto max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <div className="relative h-24 w-24 rounded-full bg-white/10 backdrop-blur">
            <div className="absolute inset-0 flex items-center justify-center text-[#24CFA7]">
              <MonitorSmartphone className="h-10 w-10" aria-hidden />
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">Dashboard Khusus Desktop</h1>
          <p className="text-sm text-white/80">
            Area admin hanya dapat diakses menggunakan desktop, laptop, atau
            tablet. Silakan lanjutkan melalui perangkat dengan layar lebih
            besar untuk pengalaman terbaik.
          </p>
        </div>
        <div className="rounded-2xl bg-white/10 p-5 text-left text-sm text-white/80 backdrop-blur">
          <p className="font-medium text-white">Tips</p>
          <ul className="mt-3 space-y-2 list-disc list-inside">
            <li>Gunakan browser terbaru untuk akses penuh fitur.</li>
            <li>
              Jika memakai tablet, aktifkan mode landscape agar tata letak
              optimal.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderDesktopLayout = () => (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-secondary-50 to-background">
      <div
        className={
          isProfileCompletionPage
            ? "mx-auto max-w-7xl px-4 py-6 sm:py-8"
            : "mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:py-8 md:grid-cols-[260px_1fr] md:gap-6"
        }
      >
        {!isProfileCompletionPage && (
          <aside className="h-fit min-w-0 md:sticky md:top-24">
            <Card className="border-t-4 border-t-[#24CFA7] shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-gradient-to-br from-[#24CFA7] to-[#467EC7] p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white"
                      aria-hidden
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                  <CardTitle className="text-base font-semibold">
                    Admin Dashboard
                  </CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                  Halo,{" "}
                  <span className="font-medium text-foreground">
                    {user?.name || "Admin"}
                  </span>
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="rounded-xl bg-gradient-to-r from-[#467EC7]/10 to-[#24CFA7]/10 p-4">
                  <h3 className="text-sm font-semibold text-foreground">
                    Company Snapshot
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {loadingCompany
                      ? "Memuat informasi perusahaan..."
                      : companyInfo
                      ? companyInfo.name || "Perusahaan terdaftar"
                      : "Lengkapi profil perusahaan Anda untuk membuka semua fitur."}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[#467EC7]">
                      <Building2 className="h-3 w-3" aria-hidden />
                      {companyInfo?.industry || "Industry belum terisi"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[#24CFA7]">
                      <User className="h-3 w-3" aria-hidden />
                      {companyInfo?.companySize || "Size belum terisi"}
                    </span>
                  </div>
                </div>

                <nav className="space-y-1">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:bg-gradient-to-r hover:from-[#467EC7]/10 hover:to-[#24CFA7]/10 ${
                        item.isActive
                          ? "bg-gradient-to-r from-[#467EC7]/10 to-[#24CFA7]/10 font-semibold"
                          : ""
                      }`}
                    >
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#467EC7] shadow-sm group-hover:scale-105 group-hover:shadow transition-transform">
                        {item.icon}
                      </span>
                      <span className="font-medium text-foreground">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </nav>

                <div className="space-y-2 border-t pt-3">
                  <Link
                    href="/admin/profile/edit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#467EC7] shadow-sm transition hover:shadow-md"
                  >
                    <Edit className="h-4 w-4" aria-hidden />
                    Update Profile
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onLogout}
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                      aria-hidden
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" x2="9" y1="12" y2="12" />
                    </svg>
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>
        )}

        <section className="min-w-0">{children}</section>
      </div>
    </div>
  );

  return (
    <AdminGuard>
      {isMobileViewport ? renderMobileNotice() : renderDesktopLayout()}
    </AdminGuard>
  );
}
