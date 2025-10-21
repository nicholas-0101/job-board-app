"use client";
import { useRouter, usePathname } from "next/navigation";
import { useMemo, type ReactNode } from "react";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { useUserStore } from "@/lib/store/userStore";
import { SidebarHeader } from "./components/SidebarHeader";
import { SidebarNav } from "./components/SidebarNav";
import { SidebarActions } from "./components/SidebarActions";
import { MobileNotice } from "./components/MobileNotice";
import { useCompanyInfo } from "./hooks/useCompanyInfo";
import { useViewportWidth } from "./hooks/useViewportWidth";
import { getNavigationItems, type NavItem } from "./navigationConfig";
import "@/utils/suppressConsoleErrors"; // Suppress preselection 404 console errors

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUserStore();
  useCompanyInfo();
  const viewportWidth = useViewportWidth();

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
    () => getNavigationItems(pathname),
    [pathname]
  );

  const renderMobileNotice = () => <MobileNotice />;

  const renderDesktopLayout = () => (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-background">
      <div className="flex">
        {/* Fixed Sidebar */}
        {!isProfileCompletionPage && (
          <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg z-10">
            <div className="p-4">
              <SidebarHeader userName={user?.name} />
            </div>
            <div className="px-4 pb-4 space-y-4">
              <SidebarNav items={navigationItems as any} />
              <SidebarActions onLogout={onLogout} />
            </div>
          </aside>
        )}

        {/* Main Content Area */}
        <main className={`flex-1 ${!isProfileCompletionPage ? 'ml-64' : ''}`}>
          <div className="min-h-screen">
            {children}
          </div>
        </main>
      </div>
    </div>
  );

  return (
    <AdminGuard>
      {isMobileViewport ? renderMobileNotice() : renderDesktopLayout()}
    </AdminGuard>
  );
}
