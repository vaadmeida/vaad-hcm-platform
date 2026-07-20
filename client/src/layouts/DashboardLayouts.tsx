import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import SideBar from "@/components/layout/sidebar/SideBar";
import { useState } from "react";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <SideBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

      <div className="flex flex-1 flex-col">
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;