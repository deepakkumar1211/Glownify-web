import React from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    PlusSquare,
    Store,
    ClipboardList,
    TrendingUp,
    BarChart3,
    Headphones,
    ChevronRight,
    Plus
} from "lucide-react";

/**
 * SalonOwnerSidebar
 * -------------------------------------------------------------
 * A specialized sidebar for the Salon Owner role matching the screenshot.
 * Features a purple gradient, user profile cards, and specialized nav items.
 */
const SalonOwnerSidebar = () => {
    const mainNavItems = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/salon-owner/dashboard" },
        { name: "Register New Salon", icon: PlusSquare, path: "/salon-owner/register-salon" },
        { name: "My Registered Salons", icon: Store, path: "/salon-owner/manage-salons" },
        { name: "Visits Log", icon: ClipboardList, path: "/salon-owner/manage-bookings" },
        { name: "My Performance", icon: TrendingUp, path: "/salon-owner/manage-analytics" },
        { name: "Reports", icon: BarChart3, path: "/salon-owner/reports" },
        { name: "Support", icon: Headphones, path: "/salon-owner/support" },
    ];

    return (
        <aside className="w-[240px] h-screen bg-gradient-to-b from-[#6D28D9] to-[#4C1D95] text-white flex flex-col shadow-2xl relative z-50">
            {/* 1. Glownify Logo */}
            <div className="p-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-xl font-bold">🦋</span>
                </div>
                <span className="text-xl font-bold tracking-tight">Glownify</span>
            </div>

            {/* 2. Top User Card (Ravi Jain) */}
            <div className="px-4 mb-4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3 border border-white/10 hover:bg-white/15 transition-colors cursor-pointer group">
                    <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi"
                        alt="Avatar"
                        className="w-10 h-10 rounded-full border border-white/20 bg-white/40"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">Ravi Jain</p>
                        <p className="text-[10px] text-purple-200 truncate flex items-center gap-1">
                            Jayanagar <span className="opacity-50">•</span> SP-BLR-101
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. Navigation Menu */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {mainNavItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all group
                             ${isActive
                                ? "bg-white/10 text-white shadow-sm ring-1 ring-white/20"
                                : "text-purple-100/60 hover:bg-white/5 hover:text-white"}`
                        }
                    >
                        <item.icon className={`w-5 h-5 mr-3 transition-colors ${item.name === 'Dashboard' ? 'group-hover:text-white' : ''}`} />
                        <span className="flex-1">{item.name}</span>
                        {item.name === "Visits Log" || item.name === "My Performance" || item.name === "Reports" ? (
                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        ) : null}
                    </NavLink>
                ))}
            </nav>

            {/* 4. Bottom Section */}
            <div className="p-4 space-y-4">
                {/* Decorative Illustration Area Placeholder */}
                <div className="relative overflow-hidden h-32 bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col justify-end">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-purple-400/20 rounded-full -mr-8 -mt-8 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-pink-400/20 rounded-full -ml-8 -mb-8 blur-2xl"></div>
                    <div className="relative z-10">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya"
                            alt="Aditya"
                            className="w-8 h-8 rounded-full border border-white/20 mb-2 bg-white/40 shadow-sm"
                        />
                        <p className="text-xs font-bold text-white leading-none">Aditya Kumar</p>
                        <p className="text-[9px] text-purple-300 font-medium">Super Admin ist item</p>
                    </div>
                </div>

                {/* + Add New Salon Button */}
                <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all shadow-lg active:scale-95 group">
                    <Plus size={18} className="transition-transform group-hover:rotate-90" />
                    Add New Salon
                </button>

                {/* Bottom Footer Info */}
                <div className="flex items-center justify-between text-[10px] text-purple-300/50 px-2">
                    <div className="flex items-center gap-1">
                        <Check size={10} className="text-emerald-400" />
                        Support
                    </div>
                    <span>© 2022 Glownify</span>
                </div>
            </div>
        </aside>
    );
};

export default SalonOwnerSidebar;
