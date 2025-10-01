"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useUserStore } from "@/lib/store/userStore";
import { useKeepLogin } from "@/hooks/useKeepLogin";
import NavbarLinks from "./NavbarLinks";
import NavbarProfile from "./NavbarProfile";
import NavbarMobileMenu from "./NavbarMobile";

const hiddenRoutes = ["/auth", "/profile/complete"];

const links = [
  { href: "/explore/jobs", label: "Jobs" },
  { href: "/explore/companies", label: "Companies" },
  { href: "/subscription", label: "Subscription" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const loading = useKeepLogin();
  const [open, setOpen] = useState(false);

  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);

  const hideNavbar = hiddenRoutes.some((r) => pathname.startsWith(r));
  if (hideNavbar) return null;

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <img src="/nobg_logo.png" alt="Logo" className="h-8 w-auto" />
        </Link>

        {/* Desktop */}
        <nav className="hidden lg:flex items-center gap-6">
          <NavbarLinks links={links} pathname={pathname} />

          <div className="h-5 w-px bg-border" />

          {loading ? (
            <div className="w-34 h-10 bg-gray-200 rounded-full animate-pulse ml-2" />
          ) : user ? (
            <NavbarProfile user={user} logout={logout} router={router} />
          ) : (
            <Link
              href="/auth/signin"
              className="px-4 py-2 rounded-xl bg-[#467ec7] text-primary-foreground hover:bg-[#578BCC] text-sm shadow-sm transition-colors"
            >
              Sign in
            </Link>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-secondary"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <NavbarMobileMenu
          links={links}
          pathname={pathname}
          loading={loading}
          user={user}
          logout={logout}
          closeMenu={() => setOpen(false)}
          router={router}
        />
      )}
    </header>
  );
}