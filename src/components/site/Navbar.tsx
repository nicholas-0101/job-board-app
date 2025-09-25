"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/explore/jobs", label: "Jobs" },
  { href: "/explore/companies", label: "Companies" },
  { href: "/cv-generator", label: "CV Generator" },
  { href: "/subscription", label: "Subscription" },
];

export default function NavbarPro() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <img src="/nobg_logo.png" alt="Logo" className="h-8 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors ${
                pathname?.startsWith(l.href)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="h-5 w-px bg-border" />
          <Link
            href="/signin"
            className="px-4 py-2 rounded-xl border border-border text-foreground/80 hover:bg-[#F5F5F5] text-sm transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 rounded-xl bg-[#467ec7] text-primary-foreground hover:bg-[#578BCC] text-sm shadow-sm transition-colors"
          >
            Create account
          </Link>
        </nav>
        <button
          className="md:hidden p-2 rounded-lg hover:bg-secondary"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 grid gap-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium ${
                  pathname?.startsWith(l.href)
                    ? "text-primary"
                    : "text-foreground/80"
                }`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Link
                href="/signin"
                className="flex-1 text-center px-4 py-2 rounded-xl border border-border text-foreground/80 hover:bg-[#F5F5F5] text-sm transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="flex-1 text-center px-4 py-2 rounded-xl bg-[#467ec7] text-primary-foreground hover:bg-[#578BCC] text-sm shadow-sm transition-colors"
              >
                Create account
              </Link>
            </div>
            <div className="pt-2">
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
