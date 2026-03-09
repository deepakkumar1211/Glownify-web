import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import SalonOwnerSidebar from "./SalonOwnerSidebar";

/**
 * SalonOwnerLayout
 * -------------------------------------------------------------
 * Layout wrapper specifically for the Salon Owner role.
 * Matches the reference image with a dedicated sidebar and main content area.
 */
const SalonOwnerLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-[#F5F2FE]">
            {/* Sidebar - Desktop always visible, Mobile toggleable */}
            <div
                className={`fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}
            >
                <SalonOwnerSidebar />
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Mobile Sidebar Toggle */}
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-purple-600 text-white rounded-full shadow-lg"
                >
                    <Menu size={20} />
                </button>

                {/* Scrollable Content Container */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden pt-0 lg:pt-0">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default SalonOwnerLayout;
