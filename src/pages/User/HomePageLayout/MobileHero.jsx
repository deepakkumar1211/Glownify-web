import React, { useEffect, useState } from "react";
import { MapPin, Search, ChevronDown } from "lucide-react";

/**
 * MobileHero — mobile-only teal header (shown only when viewport < md).
 * Desktop keeps the original Hero.jsx (Swiper carousel).
 */
const MobileHero = () => {
    const [locationLabel, setLocationLabel] = useState("Detecting location...");

    useEffect(() => {
        const lat = localStorage.getItem("lat");
        const lng = localStorage.getItem("lng");
        if (lat && lng) {
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
                .then((r) => r.json())
                .then((data) => {
                    const suburb = data.address?.suburb || data.address?.neighbourhood || data.address?.village || "";
                    const city = data.address?.city || data.address?.town || data.address?.county || "";
                    setLocationLabel(suburb ? `${suburb}, ${city}` : city || "Your Location");
                })
                .catch(() => setLocationLabel("Your Location"));
        }
    }, []);

    return (
        <div style={{ backgroundColor: "#156778" }} className="w-full px-4 pt-5 pb-4">
            {/* Row: Glownify + search button */}
            <div className="flex items-center justify-between mb-1">
                <div>
                    <h1 className="text-white text-2xl font-extrabold tracking-tight leading-tight">Glownify</h1>
                    <p className="text-white/75 text-xs mt-0.5">Find the service you want, and book now!</p>
                </div>
                <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Search size={18} className="text-white" />
                </button>
            </div>
            {/* Location pill */}
            <div className="mt-3 flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-3 py-2">
                <MapPin size={14} className="text-white shrink-0" />
                <span className="text-white text-xs flex-1 truncate">{locationLabel}</span>
                <ChevronDown size={14} className="text-white shrink-0" />
            </div>
        </div>
    );
};

export default MobileHero;
