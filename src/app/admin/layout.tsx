"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const onLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("verifiedToken");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");
      localStorage.removeItem("companyId");
    } catch {}
    router.replace("/");
  };
  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-6 md:py-8 grid gap-4 md:gap-6 md:grid-cols-[240px_1fr]">
        <aside className="h-fit md:sticky md:top-24">
          <Card>
            <CardHeader className="pb-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base">Admin</CardTitle>
              <Button size="sm" variant="outline" onClick={onLogout}>Logout</Button>
            </CardHeader>
            <CardContent className="pt-0">
              <nav className="space-y-1 text-sm">
                <Link href="/admin/jobs" className="block rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors truncate">
                  Jobs
                </Link>
                <Link href="/admin/interviews" className="block rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors truncate">
                  Interviews
                </Link>
                <Link href="/admin/analytics" className="block rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors truncate">
                  Analytics
                </Link>
              </nav>
            </CardContent>
          </Card>
        </aside>
        <section className="min-w-0">{children}</section>
      </div>
    </AdminGuard>
  );
}
