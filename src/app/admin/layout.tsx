"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiCall } from "@/helper/axios";
import { useUserStore } from "@/lib/store/userStore";
import { Building2, Edit, User } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUserStore();
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [loadingCompany, setLoadingCompany] = useState(true);
  
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      // Wait a bit to ensure AdminGuard has verified the token
      const token = localStorage.getItem("token");
      if (!token) {
        setLoadingCompany(false);
        return;
      }

      try {
        const resp = await apiCall.get("/company/admin");
        const data = resp.data?.data ?? resp.data;
        setCompanyInfo(data);
        
        // Save to localStorage for other components
        if (data?.id) {
          localStorage.setItem("companyId", data.id.toString());
        }
      } catch (err: any) {
        console.error("Failed to load company info:", err);
        // If company doesn't exist, that's ok - admin can complete profile later
        // Don't crash the app, just show "Complete Profile" in sidebar
        setCompanyInfo(null);
      } finally {
        setLoadingCompany(false);
      }
    };
    
    // Small delay to ensure AdminGuard completes first
    const timer = setTimeout(fetchCompanyInfo, 100);
    return () => clearTimeout(timer);
  }, []);
  
  const onLogout = () => {
    try {
      // Clear all localStorage data
      localStorage.removeItem("token");
      localStorage.removeItem("verifiedToken");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      localStorage.removeItem("companyId");
      
      // Clear user store
      const { setUser } = useUserStore.getState();
      setUser(null);
      
      console.log("🔓 Admin logged out successfully");
    } catch (error) {
      console.error("Error during logout:", error);
    }
    
    // Redirect to homepage
    router.replace("/");
  };

  const isProfileCompletionPage = pathname?.startsWith("/admin/profile/complete");

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-background">
        <div
          className={
            isProfileCompletionPage
              ? "container mx-auto px-4 py-6 md:py-8"
              : "container mx-auto px-4 py-6 md:py-8 grid gap-4 md:gap-6 md:grid-cols-[260px_1fr]"
          }
        >
          {!isProfileCompletionPage && (
            <aside className="h-fit md:sticky md:top-24">
            {/* Navigation Card */}
            <Card className="shadow-lg border-t-4 border-t-[#24CFA7]">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-[#24CFA7] to-[#467EC7] rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  </div>
                  <CardTitle className="text-base font-semibold">Menu</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <nav className="space-y-2 text-sm">
                  <Link href="/admin" className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-gradient-to-r hover:from-[#467EC7]/10 hover:to-[#24CFA7]/10 transition-all group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#467EC7] group-hover:scale-110 transition-transform"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <Link href="/admin/jobs" className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-gradient-to-r hover:from-[#467EC7]/10 hover:to-[#24CFA7]/10 transition-all group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#467EC7] group-hover:scale-110 transition-transform"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                    <span className="font-medium">Jobs</span>
                  </Link>
                  <Link href="/admin/interviews" className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-gradient-to-r hover:from-[#467EC7]/10 hover:to-[#24CFA7]/10 transition-all group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#467EC7] group-hover:scale-110 transition-transform"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
                    <span className="font-medium">Interviews</span>
                  </Link>
                  <Link href="/admin/applicants" className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-gradient-to-r hover:from-[#467EC7]/10 hover:to-[#24CFA7]/10 transition-all group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#467EC7] group-hover:scale-110 transition-transform"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <span className="font-medium">Applicants</span>
                  </Link>
                  <Link href="/admin/preselection" className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-gradient-to-r hover:from-[#467EC7]/10 hover:to-[#24CFA7]/10 transition-all group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#467EC7] group-hover:scale-110 transition-transform"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="9" x2="15" y1="15" y2="15"/></svg>
                    <span className="font-medium">Pre-Selection</span>
                  </Link>
                  <Link href="/admin/analytics" className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-gradient-to-r hover:from-[#467EC7]/10 hover:to-[#24CFA7]/10 transition-all group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#467EC7] group-hover:scale-110 transition-transform"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>
                    <span className="font-medium">Analytics</span>
                  </Link>
                </nav>
                
                <div className="pt-3 border-t space-y-2">
                  <Button size="sm" variant="outline" onClick={onLogout} className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>
          )}
          <section className={isProfileCompletionPage ? "" : "min-w-0"}>
            {children}
          </section>
        </div>
      </div>
    </AdminGuard>
  );
}
