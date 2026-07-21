import { useAuthStore } from "@/store/auth.store";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SideBarFooter = () => { 
   

   const user = useAuthStore((state)=>state.user)
   const logout  = useAuthStore((state)=> state.logout)

   const navigate = useNavigate()

   const handleLogout = ()=>{
       logout()
       navigate('/login' , {replace: true})
   }


  return (
    <div className="border-t border-white/10 p-3">
      <div className="flex items-center justify-between rounded-lg p-2 transition-colors border border-white/10 hover:bg-white/5">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-semibold text-white">
             {user?.first_name.charAt(0)}
          </div>

          {/* User Info */}
          <div>
            <h4 className="text-xs font-semibold text-white">
              {user?.first_name} {user?.last_name}
            </h4>
            <p className="text-xs text-gray-400">
               {user?.role.toLocaleUpperCase()}
            </p>
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