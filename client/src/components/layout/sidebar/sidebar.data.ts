import {LayoutDashboard,Users,Building2,CalendarDays,FolderOpen,ChartColumn,Settings} from "lucide-react";

export const adminSidebar = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    title: "Employees",
    icon: Users,
    href: "/employees",
  },
  {
    title: "Departments",
    icon: Building2,
    href: "/departments",
  },
  {
    title: "Leave Managements",
    icon: CalendarDays,
    href: "/leave",
  },
  {
    title: "Documents",
    icon: FolderOpen,
    href: "/documents",
  },
  {
    title: "Reports",
    icon: ChartColumn,
    href: "/reports",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];