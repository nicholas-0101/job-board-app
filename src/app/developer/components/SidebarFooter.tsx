import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarFooterProps {
  user: any;
  isCollapsed: boolean;
  handleLogout: () => void;
}

export default function SidebarFooter({
  user,
  isCollapsed,
  handleLogout,
}: SidebarFooterProps) {
  return (
    <div className="border-t border-gray-200 p-4">
      <div className="lg:hidden">
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-[#467EC7] to-[#24CFA7] rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-medium text-sm">
                {user?.email?.charAt(0).toUpperCase() || "D"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Developer</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || "developer@workoo.com"}</p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 justify-start"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="hidden lg:block">
        {isCollapsed ? (
          <div className="flex justify-center">
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-[#467EC7] to-[#24CFA7] rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-medium text-sm">
                  {user?.email?.charAt(0).toUpperCase() || "D"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Developer</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || "developer@workoo.com"}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
