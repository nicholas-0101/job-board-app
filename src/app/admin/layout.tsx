"use client";
import { AdminGuard } from "@/components/auth/AdminGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="container mx-auto px-4 py-8 grid gap-6 md:grid-cols-[240px_1fr]">
        <aside className="bg-white border rounded-2xl p-4 h-fit sticky top-24">
          <div className="font-semibold mb-3">Admin</div>
          <ul className="space-y-2 text-sm">
            <li><a href="/admin/jobs" className="hover:text-blue-600">Jobs</a></li>
            <li><a href="/admin/interviews" className="hover:text-blue-600">Interviews</a></li>
            <li><a href="/admin/analytics" className="hover:text-blue-600">Analytics</a></li>
          </ul>
        </aside>
        <section>{children}</section>
      </div>
    </AdminGuard>
  );
}
