import Link from "next/link";
import { User2, LogOutIcon } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface Props {
  links: { href: string; label: string }[];
  pathname: string | null;
  loading: boolean;
  user: { id: number; name: string } | null;
  logout: () => void;
  closeMenu: () => void;
  router: AppRouterInstance;
}

export default function NavbarMobileMenu({
  links,
  pathname,
  loading,
  user,
  logout,
  closeMenu,
  router,
}: Props) {
  return (
    <div className="lg:hidden border-t bg-background">
      <div className="container mx-auto px-4 py-4 grid gap-3">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`text-sm font-medium ${
              pathname?.startsWith(l.href) ? "text-primary" : "text-foreground/80"
            }`}
            onClick={closeMenu}
          >
            {l.label}
          </Link>
        ))}

        <div className="flex gap-2 pt-2">
          {loading ? (
            <div className="flex-1 h-8 bg-gray-200 rounded-full animate-pulse" />
          ) : user ? (
            <>
              <Link
                href="/profile"
                className="flex-1 text-center items-center justify-center px-4 py-2 rounded-xl flex gap-2 border border-border text-foreground/80 hover:bg-[#F5F5F5] text-sm transition-colors"
                onClick={closeMenu}
              >
                <User2 size={18} /> Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                  router.push("/");
                }}
                className="flex-1 text-center items-center justify-center px-4 py-2 rounded-xl flex gap-2 border border-border text-red-400 hover:bg-[#F5F5F5] text-sm transition-colors"
              >
                <LogOutIcon size={18} /> Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth/signin"
              className="flex-1 text-center px-4 py-2 rounded-xl border border-border text-foreground/80 hover:bg-[#F5F5F5] text-sm transition-colors"
              onClick={closeMenu}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}