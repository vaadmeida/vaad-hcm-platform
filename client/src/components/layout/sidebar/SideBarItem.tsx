import { NavLink } from "react-router-dom";

interface SidebarItemProps {
  item: {
    title: string;
    href: string;
    icon: React.ElementType;
  };
  onItemClick: () => void;
}

const SidebarItem = ({ item, onItemClick }: SidebarItemProps) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.href}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
          isActive
            ? "bg-primary text-white"
            : "text-gray-300 hover:bg-white/10"
        }`
      }
      onClick={onItemClick}
    >
      <Icon size={15} />

      <span className="text-sm">{item.title}</span>
    </NavLink>
  );
};

export default SidebarItem;