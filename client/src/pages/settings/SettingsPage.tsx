import SettingsHeader from "@/features/settings/components/settings/SettingsHeader";
import SettingsSidebar from "@/features/settings/components/settings/SettingsSidebar";
import { Outlet } from "react-router-dom";


const SettingsPage = () => {
  return (
    <div className="space-y-8">
      <SettingsHeader />

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-60">
          <SettingsSidebar />
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;