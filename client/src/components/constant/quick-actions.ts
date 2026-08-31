import {
  Building2,
  CalendarPlus,
  FileText,
  Plus,
  UserPlus,
  Users,
  ClipboardCheck,
  User,
} from "lucide-react";

export const quickActions = {
  admin: [
    {
      label: "Add Employee",
      icon: UserPlus,
      path: "/admin/employees",
      color: "action-icon-blue",
    },
    {
      label: "Create Department",
      icon: Building2,
      path: "/admin/departments/new",
      color: "action-icon-green",
    },
    {
      label: "Upload Document",
      icon: FileText,
      path: "/admin/documents/upload",
      color: "action-icon-amber",
    },
    {
      label: "Create Leave Type",
      icon: Plus,
      path: "/admin/leave-types/new",
      color: "action-icon-purple",
    },
  ],

  hr: [
    {
      label: "Add Employee",
      icon: UserPlus,
      path: "/employees",
      color: "action-icon-blue",
    },
    {
      label: "Upload Document",
      icon: FileText,
      path: "/documents",
      color: "action-icon-amber",
    },
    {
      label: "Approve Leave",
      icon: ClipboardCheck,
      path: "/leave",
      color: "action-icon-purple",
    },
  ],
  manager: [
    {
      label: "Approve Leave",
      icon: ClipboardCheck,
      path: "/manager/leave-requests",
      color: "action-icon-purple",
    },
    {
      label: "Upload Document",
      icon: FileText,
      path: "/manager/documents/upload",
      color: "action-icon-amber",
    },
    {
      label: "View Team",
      icon: Users,
      path: "/manager/team",
      color: "action-icon-green",
    },
  ],

  employee: [
    {
      label: "Request Leave",
      icon: CalendarPlus,
      path: "/employee/leave-request",
      color: "action-icon-purple",
    },
    {
      label: "Upload Document",
      icon: FileText,
      path: "/employee/documents/upload",
      color: "action-icon-amber",
    },
    {
      label: "My Profile",
      icon: User,
      path: "/employee/profile",
      color: "action-icon-blue",
    },
  ],
} as const;