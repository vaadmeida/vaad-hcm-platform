import SideBarItem from "./SideBarItem";
import { adminSidebar } from "./sidebar.data";

const SidebarMenu = () => {
  return (
    <nav className="flex-1 space-y-1 p-4">
      {adminSidebar.map((item) => (
        <SideBarItem
          key={item.href}
          item={item}
        />
      ))}
    </nav>
  );
};

export default SidebarMenu;