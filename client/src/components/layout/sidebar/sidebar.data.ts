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
export const hrSidebar = [
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
    title: "My Leave",
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
export const managerSidebar = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    title: "My Team",
    icon: Users,
    href: "/employees",
  },
  {
    title: "Team Leave",
    icon: CalendarDays,
    href: "/leave",
  },
  {
    title: "My Leave",
    icon: CalendarDays,
    href: "/leave",
  },
  {
    title: "Documents",
    icon: FolderOpen,
    href: "/documents",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];
export const employeeSidebar = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    title: "My Leave",
    icon: Building2,
    href: "/departments",
  },
  {
    title: "My Documents",
    icon: FolderOpen,
    href: "/documents",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

