import React from "react";
import menImg from "../../../assets/men-women/men.png";
import womanImg from "../../../assets/men-women/woman.png";
import Hero from "../HomePageLayout/Hero";
import Services from "../HomePageLayout/Services";
import ServicesBanner from "../HomePageLayout/ServicesBanner";
import {
    DesktopServiceCategories,
    DesktopNearbySalons,
    DesktopHomeService,
    DesktopUnisexSalons,
} from "../HomePageLayout/DesktopAppSections";

/**
 * DesktopHomePage
 * ─────────────────────────────────────────────────────────────
 * The full desktop home screen.
 * Rendered only on screens ≥ 768px via the useMobile dispatcher in HomePage.jsx.
 *
 * Props (all driven from HomePage.jsx — no local Redux or geolocation here):
 *   gender              — "women" | "men"
 *   setGender           — setter to change gender tab
 *   filteredCategories  — categories filtered by gender
 *   fallbackSalons      — featured salons filtered by gender
 *   lat, lng            — user's geolocation
 *
 * ✅ To edit desktop home UI, ONLY edit this file.
 * ❌ Do NOT add data-fetching here — keep all API calls in HomePage.jsx.
 */
const DesktopHomePage = ({ gender, setGender, filteredCategories, fallbackSalons, lat, lng }) => {
    return (
        <div className="min-h-screen bg-linear-to-r from-[#FFF7F1] to-[#FFEDE2] pb-20">
            <Hero />
            <Services />
            <ServicesBanner />

            {/* ── Desktop app-style sections ── */}
            <div className="bg-white mt-8">
                {/* Gender toggle — centered */}
                <div className="px-10 lg:px-16 py-5 bg-white border-b border-gray-100 flex flex-col items-center">
                    <div
                        className="flex rounded-full p-1.5 w-full max-w-md"
                        style={{ backgroundColor: "#e0f5f3" }}
                    >
                        {["women", "men"].map((g) => (
                            <button
                                key={g}
                                onClick={() => setGender(g)}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-semibold text-sm transition-all duration-200"
                                style={
                                    gender === g
                                        ? { backgroundColor: "#0d9488", color: "#ffffff" }
                                        : { backgroundColor: "transparent", color: "#374151" }
                                }
                            >
                                <img
                                    src={g === "women" ? womanImg : menImg}
                                    alt={g}
                                    className="w-5 h-5 object-contain rounded-full"
                                />
                                {g.charAt(0).toUpperCase() + g.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Service categories — desktop (larger, centered) */}
                <DesktopServiceCategories categories={filteredCategories} />

                {/* Nearby Salons — desktop (3-col grid) */}
                <DesktopNearbySalons
                    category={gender}
                    lat={lat}
                    lng={lng}
                    fallbackSalons={fallbackSalons}
                />

                {/* Home Service — desktop (horizontal scroll, larger cards) */}
                <DesktopHomeService />

                {/* Unisex Salons — desktop (3-col grid) */}
                <DesktopUnisexSalons lat={lat} lng={lng} />
            </div>
        </div>
    );
};

export default DesktopHomePage;
