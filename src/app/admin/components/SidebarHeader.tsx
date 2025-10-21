"use client";

export function SidebarHeader({ userName }: { userName?: string | null }) {
  return (
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
      <h1 className="text-base font-semibold">Admin Dashboard</h1>
    </div>
  );
}


