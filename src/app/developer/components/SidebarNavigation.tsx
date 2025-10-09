import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { menuItems } from "./sidebarConfig";

interface SidebarNavigationProps {
  isCollapsed: boolean;
  expandedMenu: string | null;
  pathname: string;
  toggleMenu: (title: string) => void;
  handleNavigation: (href: string) => void;
  isActive: (href: string) => boolean;
  isSubItemActive: (subItem: { href: string }) => boolean;
}

export default function SidebarNavigation({
  isCollapsed,
  expandedMenu,
  pathname,
  toggleMenu,
  handleNavigation,
  isActive,
  isSubItemActive,
}: SidebarNavigationProps) {
  return (
    <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isMenuActive = isActive(item.href);
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isExpanded = expandedMenu === item.title;

        return (
          <div key={item.title}>
            <button
              onClick={() => {
                if (hasSubItems) {
                  toggleMenu(item.title);
                } else {
                  handleNavigation(item.href);
                }
              }}
              className={cn(
                "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                isMenuActive
                  ? "bg-[#24CFA7]/10 text-[#467EC7] border-r-2 border-[#467EC7]"
                  : "text-gray-700 hover:bg-[#24CFA7]/10 hover:text-[#467EC7]",
                isCollapsed && "lg:justify-center"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  "mr-3 lg:mr-0",
                  !isCollapsed && "lg:mr-3"
                )}
              />
              <span
                className={cn(
                  "flex-1 text-left",
                  "lg:hidden",
                  !isCollapsed && "lg:block"
                )}
              >
                {item.title}
              </span>
              {hasSubItems && (
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isExpanded && "rotate-90"
                  )}
                />
              )}
            </button>

            {/* Sub Menu Items */}
            {hasSubItems && isExpanded && (
              <div
                className={cn(
                  "ml-4 mt-1 space-y-1",
                  "lg:hidden",
                  !isCollapsed && "lg:block"
                )}
              >
                {item.subItems?.map((subItem) => (
                  <button
                    key={`${subItem.href}-${subItem.title}`}
                    onClick={() => handleNavigation(subItem.href)}
                    className={cn(
                      "w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                      isSubItemActive(subItem)
                        ? "bg-[#467EC7] text-white"
                        : "text-gray-600 hover:bg-[#24CFA7]/10 hover:text-[#467EC7]"
                    )}
                  >
                    <div className="w-2 h-2 bg-[#467EC7] rounded-full mr-3" />
                    {subItem.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
