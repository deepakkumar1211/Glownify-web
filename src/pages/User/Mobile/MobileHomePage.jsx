import React from "react";
import menImg from "../../../assets/men-women/men.png";
import womanImg from "../../../assets/men-women/woman.png";
import MobileHero from "../HomePageLayout/MobileHero";
import BookAtHomeBanner from "../HomePageLayout/BookAtHomeBanner";
import ServiceCategories from "../HomePageLayout/ServiceCategories";
import MobileHomeSaloons from "../HomePageLayout/MobileHomeSaloons";
import MobileIndependentProfessionals from "../HomePageLayout/MobileIndependentProfessionals";
import MobileUnisexSalons from "../HomePageLayout/MobileUnisexSalons";

/**
 * MobileHomePage
 * ─────────────────────────────────────────────────────────────
 * The full mobile home screen — exact clone of the React Native app.
 * Rendered only on screens < 768px via the useMobile dispatcher in HomePage.jsx.
 *
 * Props (all driven from HomePage.jsx — no local Redux or geolocation here):
 *   gender              — "women" | "men"
 *   setGender           — setter to change gender tab
 *   filteredCategories  — categories filtered by gender
 *   fallbackSalons      — featured salons filtered by gender
 *   lat, lng            — user's geolocation
 *
 * ✅ To edit mobile home UI, ONLY edit this file.
 * ❌ Do NOT add data-fetching here — keep all API calls in HomePage.jsx.
 */
const MobileHomePage = ({ gender, setGender, filteredCategories, fallbackSalons, lat, lng }) => {
    return (
        <div className="block min-h-screen pb-20 bg-white">

            {/* 1. Teal header */}
            <MobileHero />

            <div className="flex flex-col">
                {/* 2. Book at Home banner */}
                <BookAtHomeBanner />

                {/* 3. Gender toggle — sticky pill */}
                <div className="w-full px-4 py-3 bg-white sticky top-0 z-40">
                    <div className="flex rounded-full p-1.5" style={{ backgroundColor: "#e0f5f3" }}>
                        {["women", "men"].map((g) => (
                            <button
                                key={g}
                                onClick={() => setGender(g)}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full font-semibold text-sm transition-all duration-200"
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

                {/* 4. Service categories */}
                <ServiceCategories categories={filteredCategories} />

                {/* 5. Nearby Salons */}
                <MobileHomeSaloons category={gender} lat={lat} lng={lng} fallbackSalons={fallbackSalons} />

                {/* 6. Home Service / Independent Professionals */}
                <MobileIndependentProfessionals />

                {/* 7. Unisex salons */}
                <MobileUnisexSalons lat={lat} lng={lng} />
            </div>
        </div>
    );
};

export default MobileHomePage;
