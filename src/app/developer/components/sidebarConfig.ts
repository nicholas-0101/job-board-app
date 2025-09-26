import {
  Home,
  FileText,
  Users,
  Award,
} from "lucide-react";

export const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/developer",
    description: "Developer dashboard overview",
  },
  {
    title: "Skill Assessment",
    icon: FileText,
    href: "/developer/skill-assessment",
    description: "Manage 25 MCQ tests, 75% pass rate, certificates",
    subItems: [
      { title: "All Assessments", href: "/developer/skill-assessment" },
      { title: "Create Assessment", href: "/developer/skill-assessment/create" },
    ],
  },
  {
    title: "Subscription Approval",
    icon: Users,
    href: "/developer/subscription-approval",
    description: "Approve subscription payments & manage access",
    subItems: [
      { title: "Pending Approvals", href: "/developer/subscription-approval/pending" },
      { title: "Subscription History", href: "/developer/subscription-approval/history" },
    ],
  },
  {
    title: "Badge & Certificate",
    icon: Award,
    href: "/developer/badges",
    description: "Manage achievement badges and certificates",
    subItems: [
      { title: "Badge System", href: "/developer/badges" },
      { title: "Certificate Generation", href: "/developer/badges/certificates" },
      { title: "QR Verification", href: "/developer/badges/verification" },
    ],
  },
];
