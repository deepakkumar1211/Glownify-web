import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Tab-icon imports (outline = inactive, fill = active)
import homeIcon from "../../assets/tab-icons/home.png";
import offerIcon from "../../assets/tab-icons/offer.png";
import offerFillIcon from "../../assets/tab-icons/offer_fill.png";
import bookingIcon from "../../assets/tab-icons/booking.png";
import bookingFillIcon from "../../assets/tab-icons/booking_fill.png";
import profileIcon from "../../assets/tab-icons/profile.png";
import profileFillIcon from "../../assets/tab-icons/profile_fill.png";

const tabs = [
    { id: "home", label: "Home", icon: homeIcon, fillIcon: homeIcon, path: "/" },
    { id: "offers", label: "Offers", icon: offerIcon, fillIcon: offerFillIcon, path: "/offers" },
    { id: "bookings", label: "Bookings", icon: bookingIcon, fillIcon: bookingFillIcon, path: "/bookings" },
    { id: "profile", label: "Profile", icon: profileIcon, fillIcon: profileFillIcon, path: "/profile" },
];

// Bottom tab nav — mobile only (hidden on md+)
const BottomTabNav = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex items-center justify-around px-2 py-2"
            style={{ boxShadow: "0 -2px 12px rgba(0,0,0,0.08)" }}
        >
            {tabs.map((tab) => {
                const isActive = pathname === tab.path || (tab.path !== "/" && pathname.startsWith(tab.path));
                return (
                    <button key={tab.id} onClick={() => navigate(tab.path)} className="flex flex-col items-center gap-0.5 py-1 px-3">
                        <img
                            src={isActive ? tab.fillIcon : tab.icon}
                            alt={tab.label}
                            className="w-6 h-6 object-contain"
                            style={isActive ? { tintColor: "#0d9488" } : { opacity: 0.5 }}
                        />
                        <span className="text-[10px] font-semibold" style={{ color: isActive ? "#0d9488" : "#9ca3af" }}>
                            {tab.label}
                        </span>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ backgroundColor: "#0d9488" }} />}
                    </button>
                );
            })}
        </div>
    );
};

export default BottomTabNav;
