import { Outlet } from "react-router-dom";

import Navbar from "@/components/layout/Navbar";
import SideBar from "@/components/layout/sidebar/SideBar";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <SideBar />

      <div className="flex flex-1 flex-col">
        <Navbar />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;