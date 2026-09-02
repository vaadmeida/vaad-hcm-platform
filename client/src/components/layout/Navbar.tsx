import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth.store";
import QuickActionDropdown from "../common/QuickActionDropdown";
import MobileMenu from "./sidebar/MobileMenu";
import { Breadcrumb } from "../breadcrumb/BreadCrumb";
import { useState } from "react";

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}



const Navbar = ({ setSidebarOpen }: NavbarProps) => {

  const [avatarError, setAvatarError] = useState(false);

  const user = useAuthStore((state) => state.user);

  console.log("NAV USER:", user);
console.log("NAV AVATAR:", user?.avatar_url);

  const initials = `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`;

  const hasAvatar = Boolean(user?.avatar_url) && !avatarError;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-surface px-4 md:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <div className="md:hidden">
          <MobileMenu onClick={() => setSidebarOpen(true)} />
        </div>

        <h1 className="text-sm font-semibold text-foreground md:text-base">
          <Breadcrumb />
        </h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Search */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

          <Input
            placeholder="Search..."
            className="h-9 w-56 rounded-lg border border-slate-300 bg-slate-100 pl-9 text-sm shadow-none transition-all focus:bg-white focus:ring-2 focus:ring-primary/15"
          />
        </div>

        {/* Notification */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted-light">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Quick Action */}
        <div className="hidden sm:block">
          <QuickActionDropdown />
        </div>

        {/* Avatar */}
        <button className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-semibold text-white">
          {hasAvatar ? (
            <img
              src={user?.avatar_url ?? ""}
              alt={`${user?.first_name ?? ""} ${user?.last_name ?? ""}`}
              className="h-full w-full object-cover"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <span>{initials}</span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Navbar;