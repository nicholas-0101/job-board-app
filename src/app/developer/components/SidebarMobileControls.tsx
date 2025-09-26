import React from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarMobileControlsProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function SidebarMobileControls({
  isMobileOpen,
  setIsMobileOpen,
}: SidebarMobileControlsProps) {
  return (
    <>
      {/* Mobile Menu Button */}
      {!isMobileOpen && (
        <div className="lg:hidden fixed top-4 left-4 z-[60]">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMobileOpen(true)}
            className="bg-white shadow-md"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Mobile Close Button */}
      {isMobileOpen && (
        <div className="lg:hidden fixed top-4 right-4 z-[60]">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileOpen(false)}
            className="text-white hover:text-gray-300 hover:bg-black/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[45]"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
