import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../../redux/slice/authSlice";
import {
    User, Calendar, Heart, Briefcase, Gift, Tag,
    Wallet, Info, Lock, Bell, Phone, ChevronRight, LogOut, Pencil
} from "lucide-react";

const TEAL = "#156778";

/** A single menu row */
function MenuItem({ icon: Icon, label, sub, badge, onPress }) {
    return (
        <button
            onClick={onPress}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
        >
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#e8f4f5" }}>
                <Icon size={18} style={{ color: TEAL }} />
            </div>
            <div className="flex-1 text-left">
                <p className="text-[14px] font-semibold text-gray-800">{label}</p>
                <p className="text-[11px] text-gray-400">{sub}</p>
            </div>
            {badge && (
                <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded-sm mr-1" style={{ backgroundColor: "#22c55e" }}>
                    {badge}
                </span>
            )}
            <ChevronRight size={16} color="#9ca3af" />
        </button>
    );
}

/** A group of menu items in a white card */
function MenuCard({ children }) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden divide-y divide-gray-100" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
            {children}
        </div>
    );
}

/** Section label above a card group */
function SectionLabel({ text }) {
    return <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">{text}</p>;
}

/**
 * MobileProfilePage — mobile-only Your Profile page.
 * Route: /profile  (linked from BottomTabNav)
 *
 * Location: pages/User/Mobile/MobileProfilePage.jsx
 */
const MobileProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate("/");
    };

    return (
        <div className="mobile-page">
            {/* Teal header */}
            <div className="mobile-header">
                <h1 className="mobile-header-title">Your Profile</h1>
            </div>

            <div className="px-4 pt-4 flex flex-col gap-4">

                {/* ── User Card ── */}
                <div className="bg-white rounded-2xl px-4 py-4 flex items-center gap-4" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.07)" }}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#e0e0e0" }}>
                        {user?.name ? (
                            <span className="text-2xl font-black text-gray-500">{user.name[0].toUpperCase()}</span>
                        ) : (
                            <User size={28} color="#9ca3af" />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-[16px] text-gray-800">{user?.name || "User"}</p>
                        <p className="text-[12px] text-gray-400 truncate">{user?.email || "email@example.com"}</p>
                        <p className="text-[12px] text-gray-400">+91 XXXXX XXXXX</p>
                    </div>
                    <button onClick={() => navigate("/editprofile")} className="p-2">
                        <Pencil size={18} style={{ color: TEAL }} />
                    </button>
                </div>

                {/* ── Account ── */}
                <MenuCard>
                    <MenuItem icon={User} label="My Profile" sub="View and edit profile" onPress={() => navigate("/editprofile")} />
                    <MenuItem icon={Calendar} label="Bookings" sub="View your bookings" onPress={() => navigate("/bookings")} />
                    <MenuItem icon={Heart} label="Saved Salons" sub="Your favorite salons" onPress={() => { }} />
                </MenuCard>

                {/* ── Earn With Us ── */}
                <div>
                    <SectionLabel text="Earn With Us" />
                    <MenuCard>
                        <MenuItem icon={Briefcase} label="Earn With Us" sub="Become a partner" onPress={() => navigate("/partner-with-us")} />
                    </MenuCard>
                </div>

                {/* ── Rewards ── */}
                <div>
                    <SectionLabel text="Rewards" />
                    <MenuCard>
                        <MenuItem icon={Gift} label="Refer & Earn" sub="Earn rewards with referral" badge="New" onPress={() => { }} />
                        <MenuItem icon={Tag} label="Promotions" sub="Active deals & offers" onPress={() => navigate("/offers")} />
                        <MenuItem icon={Wallet} label="Wallet" sub="Check your balance" onPress={() => { }} />
                    </MenuCard>
                </div>

                {/* ── Other Information ── */}
                <div>
                    <SectionLabel text="Other Information" />
                    <MenuCard>
                        <MenuItem icon={Info} label="About Us" sub="Learn more about us" onPress={() => { }} />
                        <MenuItem icon={Lock} label="Privacy Policy" sub="Terms & conditions" onPress={() => { }} />
                        <MenuItem icon={Bell} label="Notification Preferences" sub="Manage notifications" onPress={() => { }} />
                        <MenuItem icon={Phone} label="Contact Us" sub="Get in touch" onPress={() => { }} />
                    </MenuCard>
                </div>

                {/* ── Logout ── */}
                <button onClick={handleLogout} className="btn-danger-outline">
                    <LogOut size={18} />
                    Logout
                </button>

            </div>
        </div>
    );
};

export default MobileProfilePage;
