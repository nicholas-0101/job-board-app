"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/explore/jobs", label: "Jobs" },
  { href: "/explore/companies", label: "Companies" },
  { href: "/subscription", label: "Subscription" },
];

export default function NavbarPro() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-semibold text-xl tracking-tight">
          <span className="text-[#0D6EFD]">Job</span>Board
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors ${
                pathname?.startsWith(l.href)
                  ? "text-[#0D6EFD]"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="h-5 w-px bg-gray-200" />
          <Link
            href="/signin"
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 rounded-xl bg-[#0D6EFD] text-white hover:opacity-90 text-sm shadow-sm"
          >
            Create account
          </Link>
        </nav>
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-4 grid gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium ${
                  pathname?.startsWith(l.href)
                    ? "text-[#0D6EFD]"
                    : "text-gray-700"
                }`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Link href="/signin" className="flex-1 px-4 py-2 rounded-xl border text-sm text-gray-700 text-center">
                Sign in
              </Link>
              <Link href="/signup" className="flex-1 px-4 py-2 rounded-xl bg-[#0D6EFD] text-white text-sm text-center">
                Create
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


