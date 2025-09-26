"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, User2, LogOutIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useUserStore } from "@/lib/store/userStore";
import Image from "next/image";
import { useKeepLogin } from "@/hooks/useKeepLogin";

const links = [
  { href: "/explore/jobs", label: "Jobs" },
  { href: "/explore/companies", label: "Companies" },
  { href: "/cv-generator", label: "CV Generator" },
  { href: "/subscription", label: "Subscription" },
];

export default function Navbar() {
  const router = useRouter()
  const loading = useKeepLogin();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  // Hide navbar on developer pages
  if (pathname?.startsWith('/developer')) {
    return null;
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setProfileMenuOpen(false);
  }, [user]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <img src="/nobg_logo.png" alt="Logo" className="h-8 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
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

          {loading ? (
            <div className="w-34 h-10 bg-gray-200 rounded-full animate-pulse ml-2" />
          ) : user ? (
            <div className="relative" ref={profileRef}>
              <button
                className="flex items-center gap-2 rounded-full overflow-hidden border border-border pr-3 p-1 cursor-pointer"
                onClick={() => setProfileMenuOpen((v) => !v)}
              >
                {user.profilePicture ? (
                  <Image
                    src={user.profilePicture}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <User2 className="w-6 h-6" />
                )}
                <span className="hidden md:block text-sm font-medium">
                  {user.name}
                </span>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-background border border-border rounded-lg shadow-lg z-50 flex flex-col">
                  <Link
                    href="/profile"
                    className="px-4 py-2 hover:bg-secondary text-sm rounded-lg flex gap-2 items-center"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <User2 size={18}/>Profile
                  </Link>
                  <button
                    className="px-4 py-2 hover:bg-secondary text-sm text-left text-red-400 rounded-lg flex gap-2 items-center"
                    onClick={() => {
                      logout();
                      setProfileMenuOpen(false);
                      router.push("/"); 
                    }}
                  >
                    <LogOutIcon size={18}/>Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/auth/signin"
                className="px-4 py-2 rounded-xl bg-[#467ec7] text-primary-foreground hover:bg-[#578BCC] text-sm shadow-sm transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 rounded-xl border border-border text-foreground/80 hover:bg-[#F5F5F5] text-sm transition-colors"
              >
                Register
              </Link>
            </>
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
        <div className="lg:hidden border-t bg-background">
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
              {loading ? (
                <div className="flex-1 h-8 bg-gray-200 rounded-full animate-pulse" />
              ) : user ? (
                <>
                  <Link
                    href="/profile"
                    className="flex-1 text-center items-center justify-center px-4 py-2 rounded-xl flex gap-2 border border-border text-foreground/80 hover:bg-[#F5F5F5] text-sm transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <User2 size={18}/>Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setOpen(false);
                      router.push("/");
                    }}
                    className="flex-1 text-center items-center justify-center px-4 py-2 rounded-xl flex gap-2 border border-border text-red-400 hover:bg-[#F5F5F5] text-sm transition-colors"
                  >
                    <LogOutIcon size={18}/>Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="flex-1 text-center px-4 py-2 rounded-xl border border-border text-foreground/80 hover:bg-[#F5F5F5] text-sm transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="flex-1 text-center px-4 py-2 rounded-xl bg-[#467ec7] text-primary-foreground hover:bg-[#578BCC] text-sm shadow-sm transition-colors"
                  >
                    Create account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
