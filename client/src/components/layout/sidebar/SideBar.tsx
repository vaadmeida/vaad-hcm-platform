import SideBarFooter from "./SideBarFooter";
import SideBarHeader from "./SideBarHeader";
import SideBarMenu from "./SideBarMenu";

interface SideBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideBar = ({ sidebarOpen, setSidebarOpen }: SideBarProps) => {
  
  const closeSidebar = () => { setSidebarOpen(false) };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50
        h-screen w-72
        bg-secondary text-white
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:static md:translate-x-0
        flex shrink-0 flex-col
      `}
    >
      <SideBarHeader setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 overflow-y-auto">
        <SideBarMenu onItemClick={closeSidebar} />
      </div>

      <SideBarFooter />
    </aside>
  );
};

export default SideBar;