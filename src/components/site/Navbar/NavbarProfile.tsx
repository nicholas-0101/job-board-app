"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User2, LogOutIcon } from "lucide-react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface Props {
  user: { id: number; name: string; profilePicture?: string | null | undefined };
  logout: () => void;
  router: AppRouterInstance;
}

export default function NavbarProfile({ user, logout, router }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => setOpen(false), [user]);

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-2 rounded-full overflow-hidden border border-border pr-3 p-1 cursor-pointer"
        onClick={() => setOpen((v) => !v)}
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
        <span className="hidden md:block text-sm font-medium">{user.name}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-background border border-border rounded-lg shadow-lg z-50 flex flex-col">
          <Link
            href="/profile"
            className="px-4 py-2 hover:bg-secondary text-sm rounded-lg flex gap-2 items-center"
            onClick={() => setOpen(false)}
          >
            <User2 size={18} /> Profile
          </Link>
          <button
            className="px-4 py-2 hover:bg-secondary text-sm text-left text-red-400 rounded-lg flex gap-2 items-center"
            onClick={() => {
              logout();
              setOpen(false);
              router.push("/");
            }}
          >
            <LogOutIcon size={18} /> Logout
          </button>
        </div>
      )}
    </div>
  );
}