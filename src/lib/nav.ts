import {
  LayoutDashboard,
  School,
  GraduationCap,
  Users,
  CreditCard,
  FileText,
  Settings,
  UserPlus,
  CheckCircle,
  Download,
  Bell,
  type LucideIcon,
} from "lucide-react";

export interface SidebarItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export const adminSidebar: SidebarItem[] = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Schools", to: "/admin/schools", icon: School },
  { label: "Teachers", to: "/admin/teachers", icon: GraduationCap },
  { label: "Students", to: "/admin/students", icon: Users },
  { label: "Templates", to: "/admin/card-templates", icon: CreditCard },
  { label: "Reports", to: "/admin/reports", icon: FileText },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export const teacherSidebar: SidebarItem[] = [
  { label: "Dashboard", to: "/teacher", icon: LayoutDashboard },
  { label: "Add Student", to: "/teacher/students", icon: UserPlus },
  { label: "Approvals", to: "/teacher/approvals", icon: CheckCircle },
  { label: "Reports", to: "/teacher/reports", icon: FileText },
];

export const parentSidebar: SidebarItem[] = [
  { label: "Dashboard", to: "/parent", icon: LayoutDashboard },
  { label: "Applications", to: "/parent/applications", icon: FileText },
  { label: "Downloads", to: "/parent/downloads", icon: Download },
  { label: "Notifications", to: "/parent/notifications", icon: Bell },
];
