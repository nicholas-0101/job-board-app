"use client";
import DeveloperSidebar from "./DeveloperSidebar";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import { cn } from "@/lib/utils";

interface DeveloperLayoutProps {
  children: React.ReactNode;
}

function DeveloperLayoutContent({ children }: DeveloperLayoutProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-white">
      <DeveloperSidebar />
      {/* Content area that automatically adjusts to sidebar width */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out min-h-screen",
          // On mobile, no margin. On desktop, adjust based on sidebar state
          "ml-0 lg:ml-16",
          !isCollapsed && "lg:ml-64"
        )}
      >
        <div className="flex justify-center">
          <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DeveloperLayout({ children }: DeveloperLayoutProps) {
  return (
    <SidebarProvider>
      <DeveloperLayoutContent>{children}</DeveloperLayoutContent>
    </SidebarProvider>
  );
}
