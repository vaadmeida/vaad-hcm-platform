import { Bell, PlusIcon, Search } from "lucide-react";
import { useLocation } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "../ui/button";

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/employees": "Employees",
  "/departments": "Departments",
  "/leave": "Leave Management",
  "/reports": "Reports",
  "/settings": "Settings",
};

const Navbar = () => {
  const { pathname } = useLocation();
  const user = useAuthStore((state) => state.user);

  const title = pageTitles[pathname] || "Dashboard";

  const initials = `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface px-6">
      {/* Left */}
      <div>
        <h1 className="text-md font-semibold text-foreground">
          {title}
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <Input
            placeholder="Search..."
            className="h-9 w-56 rounded-lg border border-slate-300 bg-slate-100 pl-9 text-sm shadow-none transition-all focus:bg-white focus:ring-2 focus:ring-primary/15"
          />
        </div>

        {/* Notifications */}
        <button
          className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted-light"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Quick Action */}
        <Button className="h-9 gap-2 rounded-lg px-3 text-sm text-white">
          <PlusIcon className="h-4 w-4" />
          Quick Action
        </Button>

        {/* User */}
        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
          {initials}
        </button>
      </div>

    </header>
  );
};

export default Navbar;