"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export function SidebarActions({ onLogout }: { onLogout: () => void }) {
  return (
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
  );
}


