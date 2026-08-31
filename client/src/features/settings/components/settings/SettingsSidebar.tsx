import {
  Bell,
  Building2,
  Link2,
  LockKeyhole,
  UserRound,
} from "lucide-react";
import SettingsNavItem from "./SettingsNavItem";



const SettingsSidebar = () => {
  return (
    <nav className="space-y-1">
      <SettingsNavItem
        to="/settings"
        icon={UserRound}
        label="Profile"
        description="Personal info & preferences"
      />

      <SettingsNavItem
        to="/settings/organization"
        icon={Building2}
        label="Organization"
        description="Company-wide settings"
      />

      <SettingsNavItem
        to="/settings/notifications"
        icon={Bell}
        label="Notifications"
        description="Alerts and reminders"
      />

      <SettingsNavItem
        to="/settings/security"
        icon={LockKeyhole}
        label="Security"
        description="Password & 2FA"
      />

      <SettingsNavItem
        to="/settings/integrations"
        icon={Link2}
        label="Integrations"
        description="Connected apps"
      />
    </nav>
  );
};

export default SettingsSidebar;