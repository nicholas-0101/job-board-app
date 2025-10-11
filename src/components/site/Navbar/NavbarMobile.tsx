import Link from "next/link";
import {
  User2,
  LogOutIcon,
  FileEditIcon,
  Award,
  Trophy,
  FolderOpen,
  Bookmark,
  Shield,
  Loader,
  Medal,
} from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { motion } from "framer-motion";

interface Props {
  links: { href: string; label: string }[];
  pathname: string | null;
  loading: boolean;
  user: { id: number; name: string; role?: string } | null;
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
    <div className="lg:hidden border-t bg-background/80 backdrop-blur">
      <div className="container mx-auto px-4 py-4 grid gap-3">
        {/* Hide public links for ADMIN users */}
        {user
          ? user?.role === "ADMIN"
            ? null
            : links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`text-sm font-medium ${
                    pathname?.startsWith(l.href)
                      ? "text-primary"
                      : "text-foreground/80"
                  }`}
                  onClick={closeMenu}
                >
                  {l.label}
                </Link>
              ))
          : links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium ${
                  pathname?.startsWith(l.href)
                    ? "text-primary"
                    : "text-foreground/80"
                }`}
                onClick={closeMenu}
              >
                {l.label}
              </Link>
            ))}

        <div className="flex flex-col gap-2 bg-[#F0F5F9] rounded-xl">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader className="w-8 h-8 text-[#24CFA7]" />
              </motion.div>
            </div>
          ) : user ? (
            <>
              <Link
                href="/cv-generator"
                className="px-4 pb-2 pt-4 hover:bg-secondary text-sm rounded-lg flex gap-2 items-center"
                onClick={closeMenu}
              >
                <FileEditIcon size={18} /> CV Generator
              </Link>
              <Link
                href="/skill-assessments"
                className="px-4 py-2 hover:bg-secondary text-sm rounded-lg flex gap-2 items-center"
                onClick={closeMenu}
              >
                <Award size={18} /> Skill Assessments
              </Link>
              <Link
                href="/skill-assessments/dashboard"
                className="px-4 py-2 hover:bg-secondary text-sm rounded-lg flex gap-2 items-center"
                onClick={closeMenu}
              >
                <Trophy size={18} /> My Results
              </Link>
              <Link
                href="/badges"
                className="px-4 py-2 hover:bg-[#467EC7]/10 text-sm flex gap-2 items-center"
                onClick={closeMenu}
              >
                <Medal size={18} /> My Badges
              </Link>
              <Link
                href="/verify-certificate"
                className="px-4 py-2 hover:bg-secondary text-sm rounded-lg flex gap-2 items-center"
                onClick={closeMenu}
              >
                <Shield size={18} /> Verify Certificate
              </Link>
              <Link
                href="/my-applications"
                className="px-4 py-2 hover:bg-secondary text-sm rounded-lg flex gap-2 items-center"
                onClick={closeMenu}
              >
                <FolderOpen size={18} /> My Applications
              </Link>
              <Link
                href="/saved-jobs"
                className="px-4 py-2 hover:bg-secondary text-sm rounded-lg flex gap-2 items-center"
                onClick={closeMenu}
              >
                <Bookmark size={18} /> Saved Jobs
              </Link>
              <Link
                href="/profile/edit"
                className="px-4 py-2 hover:bg-secondary text-sm rounded-lg flex gap-2 items-center"
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
                className="px-4 py-2 hover:bg-secondary text-sm rounded-b-lg flex gap-2 items-center bg-red-50 text-red-400"
              >
                <LogOutIcon size={18} /> Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth/signin"
              className="flex-1 text-center px-4 py-2 rounded-xl font-semibold text-white bg-[#467ec7] hover:bg-[#467ec7] text-sm transition-colors"
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
