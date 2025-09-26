"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";
import SidebarMobileControls from "./SidebarMobileControls";
import SidebarHeader from "./SidebarHeader";
import SidebarNavigation from "./SidebarNavigation";
import SidebarFooter from "./SidebarFooter";

interface SidebarProps {
  className?: string;
}

export default function DeveloperSidebar({ className }: SidebarProps) {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/developer/signin");
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMobileOpen(false);
  };

  const toggleMenu = (title: string) => {
    setExpandedMenu(expandedMenu === title ? null : title);
  };

  const isActive = (href: string) => {
    if (href === "/developer") return pathname === href;
    return pathname.startsWith(href);
  };

  const isSubItemActive = (subItem: { href: string }) => pathname === subItem.href;

  return (
    <>
      <SidebarMobileControls
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-[50] h-screen transition-transform duration-300 ease-in-out lg:translate-x-0 lg:z-30",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div
          className={cn(
            "flex h-full flex-col bg-white border-r border-gray-200 shadow-lg",
            "w-64 lg:w-16",
            !isCollapsed && "lg:w-64"
          )}
        >
          <SidebarHeader
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />

          <SidebarNavigation
            isCollapsed={isCollapsed}
            expandedMenu={expandedMenu}
            pathname={pathname}
            toggleMenu={toggleMenu}
            handleNavigation={handleNavigation}
            isActive={isActive}
            isSubItemActive={isSubItemActive}
          />

          <SidebarFooter
            user={user}
            isCollapsed={isCollapsed}
            handleLogout={handleLogout}
          />
        </div>
      </div>
    </>
  );
}