import { useAuthStore } from "@/store/auth.store";
import SideBarItem from "./SideBarItem";
import { adminSidebar, employeeSidebar, hrSidebar, managerSidebar } from "./sidebar.data";

interface SideBarMenuProps {
  onItemClick: () => void;
}



const SidebarMenu = ({onItemClick}: SideBarMenuProps) => {

  const user = useAuthStore((state) => state.user)

  let sidebarItems = employeeSidebar;

  switch (user?.role) {
    case "admin":
      sidebarItems = adminSidebar;
      break;
    case "hr":
      sidebarItems = hrSidebar;
      break;
    case "manager":
      sidebarItems = managerSidebar;
      break;
    case "employee":
      sidebarItems = employeeSidebar;
      break;
    default:
      break;
  }


  return (
    <nav className="space-y-1 p-4">
      {sidebarItems.map((item) => (
        <SideBarItem
          key={item.href}
          item={item}
          onItemClick={onItemClick}
        />
      ))}
    </nav>
  );
};

export default SidebarMenu;