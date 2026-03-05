import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BottomTabNav from "./BottomTabNav";
import { ChevronLeft } from "lucide-react";

// Pages where the back button should NOT show
const NO_BACK_PAGES = ["/", "/offers", "/salons", "/bookings", "/profile"];

/**
 * MobileFloatingBackButton
 * A fixed circular floating button at the top-left.
 * Uses backdrop-blur + semi-transparent dark style so it looks good
 * over any background (images, teal headers, white pages, etc.).
 * Hidden on home and main tab pages.
 */
const MobileFloatingBackButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const shouldHide =
    NO_BACK_PAGES.includes(location.pathname) ||
    location.pathname === "/";

  if (shouldHide) return null;

  return (
    <button
      onClick={() => navigate(-1)}
      aria-label="Go back"
      className="mobile-back-btn"
    >
      <ChevronLeft size={22} color="#ffffff" strokeWidth={2.5} />
    </button>
  );
};

const UserLayout = () => {
  return (
    <>
      <Navbar />
      {/* Mobile floating back button — overlays page content, desktop hidden */}
      <MobileFloatingBackButton />
      <main className="md:pt-4">
        <Outlet />
      </main>
      <Footer />
      {/* Mobile bottom tab nav — fixed, visible on all user pages on mobile */}
      <div className="block md:hidden">
        <BottomTabNav />
      </div>
    </>
  );
};

export default UserLayout;
