import {
  FileText,
  AlertCircle,
  Award,
  Users,
  type LucideIcon,
} from "lucide-react";

export const COLORS = {
  PRIMARY: "#467EC7",
  SECONDARY: "#24CFA7",
  ACCENT: "#A3B6CE",
  BACKGROUND: "#F0F5F9",
  BORDER: "#E1F1F3",
} as const;

export interface StatConfig {
  key: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  formatter?: (value: number) => string;
}

export const STAT_CONFIGS: StatConfig[] = [
  {
    key: "totalAssessments",
    title: "Active Assessments",
    description: "Total skill tests",
    icon: FileText,
    iconBgColor: "bg-emerald-100",
    iconColor: "text-emerald-500",
  },
  {
    key: "pendingApprovals",
    title: "Pending Approvals",
    description: "Subscription requests",
    icon: AlertCircle,
    iconBgColor: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    key: "certificatesIssued",
    title: "Certificates Issued",
    description: "Total certificates",
    icon: Award,
    iconBgColor: "bg-amber-100",
    iconColor: "text-amber-500",
    formatter: (value: number) => value.toLocaleString(),
  },
];

export interface ToolConfig {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  buttonText: string;
  route?: string;
}

export const TOOL_CONFIGS: ToolConfig[] = [
  {
    title: "Skill Assessment",
    description: "Manage skill tests, pass rate, badges, certificates",
    icon: FileText,
    iconBgColor: "bg-emerald-100",
    iconColor: "text-emerald-500",
    buttonText: "Manage",
  },
  {
    title: "Subscription Approval",
    description: "Approve subscription payments & manage access",
    icon: Users,
    iconBgColor: "bg-blue-100",
    iconColor: "text-blue-500",
    buttonText: "Review",
    route: "/developer/subscription-approval/history",
  },
  {
    title: "Badge & Certificate",
    description: "Issued certificates, badge templates, verification system",
    icon: Award,
    iconBgColor: "bg-amber-100",
    iconColor: "text-amber-500",
    buttonText: "Manage",
  },
];

