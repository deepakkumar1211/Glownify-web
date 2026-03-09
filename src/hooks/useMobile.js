import { useState, useEffect } from "react";

/**
 * useMobile
 * ─────────────────────────────────────────
 * Returns `true` when the viewport width is below the given breakpoint (default 768px).
 * Updates reactively on window resize with cleanup to prevent memory leaks.
 *
 * Usage:
 *   const isMobile = useMobile();
 *   return isMobile ? <MobilePage /> : <DesktopPage />;
 */
const useMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);

    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth < breakpoint);
        window.addEventListener("resize", handler);
        // Cleanup on unmount or breakpoint change
        return () => window.removeEventListener("resize", handler);
    }, [breakpoint]);

    return isMobile;
};

export default useMobile;
