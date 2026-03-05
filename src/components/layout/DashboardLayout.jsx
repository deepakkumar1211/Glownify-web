import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { SIDEBAR_CONFIG } from "./sidebarConfig";
import { logoutUser } from "../../redux/slice/authSlice";

const DashboardLayout = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const roleConfig = SIDEBAR_CONFIG[user?.role];

  const getPageTitle = () => {
    const path = location.pathname.split("/").pop();
    return path === "dashboard"
      ? "Dashboard Overview"
      : path.replace(/-/g, " ").toUpperCase();
  };

  const logout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {open && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 transform ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition`}>
        <Sidebar />
      </div>

      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button className="lg:hidden" onClick={() => setOpen(true)}>
              <Menu />
            </button>
            <h1 className="font-bold text-lg">{getPageTitle()}</h1>
          </div>

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

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
