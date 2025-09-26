import React from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function SidebarHeader({
  isCollapsed,
  setIsCollapsed,
}: SidebarHeaderProps) {
  return (
    <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
      <div className={cn(
        "flex items-center justify-start flex-1",
        "lg:hidden",
        !isCollapsed && "lg:flex"
      )}>
        <img 
          src="/nobg_logo.png" 
          alt="Logo" 
          className="h-14 w-auto object-contain"
        />
      </div>
      
      {/* Desktop collapse button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden lg:flex"
      >
        {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
      </Button>
    </div>
  );
}
