import type { LucideIcon } from "lucide-react";
import { NavLink } from "react-router-dom";

interface SettingsNavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  description: string;
}

const SettingsNavItem = ({
  to,
  icon: Icon,
  label,
  description,
}: SettingsNavItemProps) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        [
          "group flex items-start gap-3 rounded-lg px-3 py-3",
          "transition-all duration-200",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-gray-600 hover:bg-primary/5 hover:text-primary",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          {/* Icon */}
          <Icon
            size={18}
            strokeWidth={isActive ? 2 : 1.8}
            className={`mt-0.5 shrink-0 transition-colors ${isActive
                ? "text-primary"
                : "text-gray-400 group-hover:text-primary"
              }`}
          />

          {/* Text */}
          <div className="min-w-0">
            <p className={`text-sm font-medium transition-colors ${isActive
                ? "text-primary"
                : "text-gray-700 group-hover:text-primary"
              }`}
            >
              {label}
            </p>

            <p
              className={`mt-0.5 text-xs transition-colors ${isActive
                  ? "text-primary/70"
                  : "text-gray-500 group-hover:text-gray-600"
                }`}
            >
              {description}
            </p>
          </div>
        </>
      )}
    </NavLink>
  );
};

export default SettingsNavItem;