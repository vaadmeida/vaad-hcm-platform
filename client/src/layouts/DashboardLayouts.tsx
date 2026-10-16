import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import SideBar from "@/components/layout/sidebar/SideBar";
import { useState } from "react";
import ProfileSync from "@/components/common/ProfileSync";
import { useNotificationSound } from "@/features/notifications/hooks/useNotificationSound";

const DashboardLayout = () => {
        console.log("DASHBOARD LAYOUT RENDERED");

    const [sidebarOpen, setSidebarOpen] = useState(false);

      useNotificationSound();

    return (
        <div className="flex h-screen min-h-0 overflow-hidden bg-background">
            <ProfileSync />
            <SideBar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                <Navbar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                <main className="min-h-0 min-w-0 flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
export default DashboardLayout;