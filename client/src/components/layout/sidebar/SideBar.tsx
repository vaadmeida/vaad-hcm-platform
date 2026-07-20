import SideBarFooter from "./SideBarFooter";
import SideBarHeader from "./SideBarHeader";
import SideBarMenu from "./SideBarMenu";
interface SideBarProps{
  sidebarOpen: boolean
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>; 
}


const SideBar = ({ sidebarOpen,setSidebarOpen }: SideBarProps) => {
  return (
      <aside
      className={`
        fixed inset-y-0 left-0 z-50
        w-72 bg-secondary text-white
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:static md:translate-x-0
        flex flex-col
      `}
    >
      <SideBarHeader setSidebarOpen={setSidebarOpen} />

      <SideBarMenu/>

      <SideBarFooter />
    </aside>
  );
};

export default SideBar;