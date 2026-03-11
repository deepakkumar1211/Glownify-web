import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { SIDEBAR_CONFIG } from "./sidebarConfig";
import { logoutUser } from "../../redux/slice/authSlice";
import useMobile from "../../hooks/useMobile";

/**
 * DashboardLayout
 * ─────────────────────────────────────────────────────────────
 * Shared layout wrapper for all role-based dashboards.
 *
 * 📱 Mobile (< 768px): renders ONLY <Outlet /> — no sidebar, no header.
 *    The child page (e.g. MobileSuperAdminDashboard) owns its own layout.
 *
 * 🖥  Desktop (≥ 768px): collapsible sidebar + sticky header + content area.
 *
 * Used by: Super Admin, Sales Executive, Salon Owner, Salesman, etc.
 */
const DashboardLayout = () => {
  // ── State ─────────────────────────────────────────────────
  const [open, setOpen] = useState(false); // sidebar open/close on mobile

  // ── Hooks ─────────────────────────────────────────────────
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isMobile = useMobile();

  // Sidebar config for the logged-in user's role (avatar, menu items, etc.)
  const roleConfig = SIDEBAR_CONFIG[user?.role];

  /**
   * Derives a human-readable page title from the current URL path.
   * e.g. "/super-admin/manage-salons" → "MANAGE SALONS"
   */
  const getPageTitle = () => {
    const path = location.pathname.split("/").pop();
    return path === "dashboard"
      ? "Dashboard Overview"
      : path.replace(/-/g, " ").toUpperCase();
  };

  /** Dispatches logout and redirects to the home page. */
  const logout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  // ── Mobile: let the page render full-screen with its own layout ──
  if (isMobile) {
    return <Outlet />;
  }

  // ── Desktop: sidebar + header wrapper ──────────────────────────
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* Mobile overlay — closes sidebar when tapped outside */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar — hidden off-screen on mobile, always visible on lg+ */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform ${open ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 transition`}
      >
        <Sidebar />
      </div>

      {/* Main content area (header + page outlet) */}
      <div className="flex-1 p-5 flex flex-col">

        {/* ── Top Header ── */}
        <header className="h-16 bg-white border-b px-6 flex justify-between items-center">
          {/* Left: hamburger (mobile) + page title */}
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setOpen(true)}>
              <Menu />
            </button>
            <h1 className="font-bold text-lg">{getPageTitle()}</h1>
          </div>

          {/* Right: role avatar + logout button */}
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
              {roleConfig?.avatar}
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1 text-red-600"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </header>

        {/* ── Page Content (rendered by child route) ── */}
        <main className="flex-1 p-5 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
