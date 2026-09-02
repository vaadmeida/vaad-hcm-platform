import { useAuthStore } from "@/store/auth.store";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SideBarFooter = () => {

  const [avatarError, setAvatarError] = useState(false);
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const navigate = useNavigate()

  const queryClient = useQueryClient();

  const handleLogout = () => {
    logout()
    queryClient.clear()
    navigate('/login', { replace: true })
  }


  const initials = `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`;

  const hasAvatar = Boolean(user?.avatar_url) && !avatarError;

  return (
    <div className="border-t border-white/10 p-3">
      <div className="flex items-center justify-between rounded-lg p-2 transition-colors border border-white/10 hover:bg-white/5">
        <div className="flex items-center gap-3">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0">
              {hasAvatar ? (
                <img
                  src={user?.avatar_url ?? ""}
                  alt={`${user?.first_name ?? ""} ${user?.last_name ?? ""}`}
                  className="h-10 w-10 rounded-full object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                  {initials}
                </div>
              )}

              {/* Online indicator */}
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
            </div>

            <div>

              <h4 className="text-xs font-semibold text-white">
                {user?.first_name} {user?.last_name}
              </h4>

              <p className="text-xs text-gray-400">
                {user?.role.toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button onClick={handleLogout} className="rounded-md p-2 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400 cursor-pointer"
          aria-label="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default SideBarFooter;