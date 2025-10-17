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
  formatter?: (value: number) => string;
}

export const STAT_CONFIGS: StatConfig[] = [
  {
    key: "totalAssessments",
    title: "Active Assessments",
    description: "Total skill tests",
    icon: FileText,
    iconBgColor: COLORS.SECONDARY,
  },
  {
    key: "pendingApprovals",
    title: "Pending Approvals",
    description: "Subscription requests",
    icon: AlertCircle,
    iconBgColor: COLORS.ACCENT,
  },
  {
    key: "certificatesIssued",
    title: "Certificates Issued",
    description: "Total certificates",
    icon: Award,
    iconBgColor: COLORS.SECONDARY,
    formatter: (value: number) => value.toLocaleString(),
  },
];

export interface ToolConfig {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBgColor: string;
  buttonText: string;
  route?: string;
}

export const TOOL_CONFIGS: ToolConfig[] = [
  {
    title: "Skill Assessment",
    description: "Manage skill tests, pass rate, badges, certificates",
    icon: FileText,
    iconBgColor: COLORS.SECONDARY,
    buttonText: "Manage",
  },
  {
    title: "Subscription Approval",
    description: "Approve subscription payments & manage access",
    icon: Users,
    iconBgColor: COLORS.ACCENT,
    buttonText: "Review",
    route: "/developer/subscription-approval/history",
  },
  {
    title: "Badge & Certificate",
    description: "Issued certificates, badge templates, verification system",
    icon: Award,
    iconBgColor: COLORS.SECONDARY,
    buttonText: "Manage",
  },
];

