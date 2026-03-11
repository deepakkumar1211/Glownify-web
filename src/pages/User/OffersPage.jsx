import MobileOffersPage from "./Mobile/MobileOffersPage";

/**
 * OffersPage — dispatcher
 * ─────────────────────────────────────────
 * This file's import path is referenced by AllRoutes.jsx — DO NOT rename or move it.
 *
 * ✅ Edit mobile offers UI  → src/pages/User/Mobile/MobileOffersPage.jsx
 * 🔲 Desktop offers page    → src/pages/User/Desktop/DesktopOffersPage.jsx (add when designed)
 */
const OffersPage = () => {
    // Both mobile and desktop show the mobile offers page for now.
    // When desktop version is ready, import useMobile and swap:
    //   const isMobile = useMobile();
    //   return isMobile ? <MobileOffersPage /> : <DesktopOffersPage />;
    return <MobileOffersPage />;
};

export default OffersPage;
