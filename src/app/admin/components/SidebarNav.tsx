"use client";
import Link from "next/link";

export type NavItem = { href: string; label: string; icon: React.ReactNode; isActive: boolean };

export function SidebarNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="space-y-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`group flex items-center gap-3 rounded-xl px-4 py-3 transition-all hover:bg-gradient-to-r hover:from-[#467EC7]/10 hover:to-[#24CFA7]/10 ${
            item.isActive ? "bg-gradient-to-r from-[#467EC7]/10 to-[#24CFA7]/10 font-semibold" : ""
          }`}
        >
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#467EC7] shadow-sm group-hover:scale-105 group-hover:shadow transition-transform">
            {item.icon}
          </span>
          <span className="font-medium text-foreground">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}


