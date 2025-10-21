import { type ReactNode } from "react";

export type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  isActive: boolean;
};

type NavDefinition = {
  href: string;
  label: string;
  matcher: (pathname?: string | null) => boolean;
  icon: ReactNode;
};

const iconBase = "text-[#467EC7] transition-transform";

const createIcon = (children: ReactNode) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={iconBase}
    aria-hidden
  >
    {children}
  </svg>
);

const definitions: NavDefinition[] = [
  {
    href: "/admin",
    label: "Overview",
    matcher: (pathname) => pathname === "/admin",
    icon: createIcon([
      <path key="p1" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
      <polyline key="p2" points="9 22 9 12 15 12 15 22" />,
    ]),
  },
  {
    href: "/admin/jobs",
    label: "Jobs",
    matcher: (pathname) => pathname?.startsWith("/admin/jobs") ?? false,
    icon: createIcon([
      <path
        key="p1"
        d="M3 4a2 2 0 0 1 2-2h3.5l1 2H19a2 2 0 0 1 2 2v11"
      />,
      <rect key="p2" width="18" height="8" x="3" y="13" rx="2" />,
    ]),
  },
  {
    href: "/admin/interviews",
    label: "Interviews",
    matcher: (pathname) => pathname?.startsWith("/admin/interviews") ?? false,
    icon: createIcon([
      <path key="p1" d="M8 2v4" />,
      <path key="p2" d="M16 2v4" />,
      <rect key="p3" width="18" height="18" x="3" y="4" rx="2" />,
      <path key="p4" d="M3 10h18" />,
    ]),
  },
  {
    href: "/admin/applicants",
    label: "Applicants",
    matcher: (pathname) => pathname?.startsWith("/admin/applicants") ?? false,
    icon: createIcon([
      <path key="p1" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />,
      <circle key="p2" cx="9" cy="7" r="4" />,
      <path key="p3" d="M22 21v-2a4 4 0 0 0-3-3.87" />,
      <path key="p4" d="M16 3.13a4 4 0 0 1 0 7.75" />,
    ]),
  },
  {
    href: "/admin/preselection",
    label: "Pre-Selection",
    matcher: (pathname) => pathname?.startsWith("/admin/preselection") ?? false,
    icon: createIcon([
      <path
        key="p1"
        d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
      />,
      <polyline key="p2" points="14 2 14 8 20 8" />,
      <line key="p3" x1="9" x2="15" y1="15" y2="15" />,
    ]),
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    matcher: (pathname) => pathname?.startsWith("/admin/analytics") ?? false,
    icon: createIcon([
      <line key="p1" x1="12" x2="12" y1="20" y2="10" />,
      <line key="p2" x1="18" x2="18" y1="20" y2="4" />,
      <line key="p3" x1="6" x2="6" y1="20" y2="16" />,
    ]),
  },
];

export const getNavigationItems = (pathname?: string | null): NavItem[] =>
  definitions.map(({ href, label, matcher, icon }) => ({
    href,
    label,
    icon,
    isActive: matcher(pathname),
  }));
