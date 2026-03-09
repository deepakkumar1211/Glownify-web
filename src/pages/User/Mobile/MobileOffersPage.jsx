import React from "react";
import { useNavigate } from "react-router-dom";
import referImg from "../../../assets/offer/refer.png";
import offerImg from "../../../assets/offer/offer.png";

/**
 * MobileOffersPage — mobile-only styled Offers page.
 * Linked from the "Offers" tab in BottomTabNav (/offers).
 *
 * Location: pages/User/Mobile/MobileOffersPage.jsx
 */
const MobileOffersPage = () => {
    const navigate = useNavigate();

    return (
        <div className="mobile-page">
            {/* Teal header */}
            <div className="mobile-header">
                <h1 className="mobile-header-title">Offers</h1>
            </div>

            <div className="px-4 pt-4 flex flex-col gap-4">

                {/* Coupon + Wallet row */}
                <div className="flex gap-3">
                    {/* Coupons card */}
                    <div
                        className="flex-1 flex items-center gap-3 bg-white rounded-2xl px-4 py-3"
                        style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.07)", border: "1px solid #e5e7eb" }}
                    >
                        <span className="text-xl">🏷️</span>
                        <div>
                            <p className="font-bold text-[14px] text-gray-800">3 Coupons</p>
                        </div>
                    </div>

                    {/* Wallet card */}
                    <div
                        className="flex-1 flex items-center gap-3 bg-white rounded-2xl px-4 py-3"
                        style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.07)", border: "1px solid #e5e7eb" }}
                    >
                        <span className="text-xl">💳</span>
                        <div>
                            <p className="font-bold text-[14px] text-gray-800">₹299 Wallet</p>
                        </div>
                    </div>
                </div>

                {/* Refer & Earn banner */}
                <div
                    className="relative rounded-2xl overflow-hidden flex items-center justify-between"
                    style={{ backgroundColor: "#dce8f8", minHeight: 160 }}
                >
                    <div className="flex-1 px-5 py-5 z-10">
                        <p className="font-extrabold text-[20px] text-gray-800 leading-snug">
                            Refer &amp; Earn<br />Free Services
                        </p>
                        <button
                            className="mt-4 px-4 py-2 rounded-full text-[12px] font-black text-gray-900 uppercase tracking-wide"
                            style={{ backgroundColor: "#f5c518" }}
                        >
                            Know More
                        </button>
                    </div>
                    <img src={referImg} alt="Refer & Earn" className="h-36 object-contain mr-3" />
                </div>

                {/* 10% OFF banner */}
                <div
                    className="relative rounded-2xl overflow-hidden flex items-center justify-between"
                    style={{ backgroundColor: "#fef9c3", minHeight: 160 }}
                >
                    <div className="flex-1 px-5 py-5 z-10">
                        <p className="font-extrabold text-[20px] text-gray-800 leading-snug">
                            Get<br />
                            <span className="text-[26px]">10% OFF</span>
                        </p>
                        <p className="text-[12px] text-gray-600 mt-0.5">on every booking!</p>
                        <button
                            className="mt-3 px-4 py-2 rounded-full text-[12px] font-black text-white uppercase tracking-wide"
                            style={{ backgroundColor: "#1a1a1a" }}
                        >
                            View Benefits
                        </button>
                    </div>
                    <img src={offerImg} alt="10% Off" className="h-36 object-contain mr-3" />
                </div>

            </div>
        </div>
    );
};

export default MobileOffersPage;
