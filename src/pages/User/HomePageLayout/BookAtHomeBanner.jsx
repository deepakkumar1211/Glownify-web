import React from "react";
import { useNavigate } from "react-router-dom";

// Book at Home Banner — mobile only (hidden on md+)
const BookAtHomeBanner = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-white px-4 pt-5 pb-2">
            <p className="text-center text-[15px] font-bold text-gray-900 mb-3">
                Book a Beautician/Barber at Home
            </p>
            <button
                onClick={() => navigate("/independentprofessionaldetailspage")}
                className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-left"
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
            >
                <div className="flex items-start gap-3">
                    <div
                        className="rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: "#f0faf8", width: 52, height: 52 }}
                    >
                        <span className="text-2xl">👩</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: "#0d9488" }}>
                            STEP 1
                        </p>
                        <p className="text-[15px] font-bold text-gray-900 mb-1">Choose Your Beautician</p>
                        <p className="text-[12px] text-gray-500 leading-relaxed">
                            Browse available beauticians and pick your favorite one.
                        </p>
                    </div>
                </div>
            </button>
        </div>
    );
};

export default BookAtHomeBanner;
