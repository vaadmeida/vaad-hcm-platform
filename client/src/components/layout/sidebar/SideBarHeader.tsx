import logo from "@/assets/vaad_icon.jpeg";
import { XIcon } from "lucide-react";

interface SidebarHeaderProps {
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideBarHeader = ({ setSidebarOpen }: SidebarHeaderProps) => {
  return (
    <div className="flex items-center border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5">
      <img
        src={logo}
        alt="VAAD HR"
        className="h-9 w-9 rounded-full object-cover sm:h-10 sm:w-10"
      />

      <div className="ml-3 min-w-0">
        <h1 className="truncate text-sm font-semibold tracking-wide text-white sm:text-base">
          VAAD HR
        </h1>

        <p className="truncate text-xs text-gray-400">
          Human Resource Platform
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={() => setSidebarOpen(false)}
        className="ml-auto flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/10 hover:text-white md:hidden"
      >
        <XIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default SideBarHeader;