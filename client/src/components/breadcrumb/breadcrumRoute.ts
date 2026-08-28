export const breadcrumbRoutes = [
  {
    match: /^\/admin\/dashboard$/,
    breadcrumbs: [{ label: "Dashboard" }],
  },

  {
    match: /^\/hr\/dashboard$/,
    breadcrumbs: [{ label: "Dashboard" }],
  },

  {
    match: /^\/employee\/dashboard$/,
    breadcrumbs: [{ label: "Dashboard" }],
  },
  {
    match: /^\/manager\/dashboard$/,
    breadcrumbs: [{ label: "Dashboard" }],
  },
  {
    match: /^\/employees$/,
    breadcrumbs: [
      { label: "Employees", path: "/employees" },
    ],
  },
  {
    match: /^\/departments$/,
    breadcrumbs: [
      { label: "Departments", path: "/departments" },
    ],
  },
  {
    match: /^\/departments\/([^/]+)$/,
    breadcrumbs: [
      { label: "Departments", path: "/departments" },
      { label: "Department Details" },
    ],
  },
  {
    match: /^\/leave$/,
    breadcrumbs: [
      { label: "Leave Management", path: "/leave" },
    ],
  },
  {
    match: /^\/documents$/,
    breadcrumbs: [
      { label: "Documents", path: "/documents" },
    ],
  },
  {
    match: /^\/reports$/,
    breadcrumbs: [
      { label: "Reports", path: "/reports" },
    ],
  },
  {
    match: /^\/settings$/,
    breadcrumbs: [
      { label: "Settings", path: "/settings" },
    ],
  },

  {
    match: /^\/employees\/([^/]+)$/,
    breadcrumbs: [
      { label: "Employees", path: "/employees" },
      { label: "Employee Profile" },
    ],
  },
  {
    match: /^\/employees\/([^/]+)\/documents$/,
    breadcrumbs: [
      { label: "Employees", path: "/employees" },
      { label: "Employee Profile" },
      { label: "Documents" },
    ],
  },
  {
    match: /^\/employees\/([^/]+)\/activity$/,
    breadcrumbs: [
      { label: "Employees", path: "/employees" },
      { label: "Employee Profile" },
      { label: "Activity" },
    ],
  },
  {
    match: /^\/my-documents$/,
    breadcrumbs: [
      { label: "My Documents", path: "/my-documents" },
    ],
  },
  {
    match: /^\/profile$/,
    breadcrumbs: [
      { label: "My Profile", path: "/profile" },
    ],
  },
];