import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    fetchHomeSaloonsByCategory,
    fetchIndependentProfessionals,
    fetchAllUnisexSalonServices,
} from "../../../redux/slice/userSlice";

// ── Category icons ──────────────────────────────────────────
import haircutIcon from "../../../assets/categoryIcons/haircut.svg";
import facialIcon from "../../../assets/categoryIcons/facial.svg";
import makeupIcon from "../../../assets/categoryIcons/makeup.svg";
import nailsIcon from "../../../assets/categoryIcons/nails.svg";
import waxingIcon from "../../../assets/categoryIcons/waxing.svg";
import spaIcon from "../../../assets/categoryIcons/spa.svg";
import coloringIcon from "../../../assets/categoryIcons/coloring.svg";
import massageIcon from "../../../assets/categoryIcons/massage.svg";

// ── Salon placeholder images ────────────────────────────────
import salonImg from "../../../assets/salon.png";
import haircutImg from "../../../assets/haircut.png";
import facialImg from "../../../assets/facial.png";
import makeupImg from "../../../assets/makeup.png";

// ── Pro placeholder images ───────────────────────────────────
import aishaImg from "../../../assets/aisha.jpg";
import gitaImg from "../../../assets/gita.jpg";
import menImg from "../../../assets/men.png";

// ────────────────────────────────────────────────────────────
// 1. DESKTOP SERVICE CATEGORIES
// ────────────────────────────────────────────────────────────
const CATEGORY_ICONS = {
    Hairs: haircutIcon, Haircut: haircutIcon, Spa: spaIcon,
    Nails: nailsIcon, Coloring: coloringIcon, Wax: waxingIcon,
    Waxing: waxingIcon, Makeup: makeupIcon, "Make Up": makeupIcon,
    Facial: facialIcon, Massage: massageIcon,
};
const DEFAULT_ICON = haircutIcon;
const DEFAULT_CATEGORIES = [
    { id: 1, name: "Hairs" }, { id: 2, name: "Spa" },
    { id: 3, name: "Nails" }, { id: 4, name: "Coloring" },
    { id: 5, name: "Wax" }, { id: 6, name: "Makeup" },
];

export function DesktopServiceCategories({ categories }) {
    const navigate = useNavigate();
    const cats = categories?.length > 0 ? categories : DEFAULT_CATEGORIES;

    return (
        <div className="bg-white pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between px-10 lg:px-16 pt-5 pb-4">
                <h2 className="text-[17px] font-semibold text-gray-800">What do you want to get?</h2>
                <button className="text-[14px] font-semibold" style={{ color: "#0d9488" }} onClick={() => navigate("/categories")}>
                    View all
                </button>
            </div>
            <div
                className="flex justify-center gap-10 lg:gap-14 overflow-x-auto px-10 lg:px-16 pb-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {cats.map((cat) => (
                    <button key={cat.id || cat._id} className="flex flex-col items-center gap-2 shrink-0" onClick={() => navigate("/categories")}>
                        <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: "#e0f7f5" }}>
                            <img src={CATEGORY_ICONS[cat.name] || DEFAULT_ICON} alt={cat.name} className="w-11 h-11 object-contain" />
                        </div>
                        <span className="text-[14px] text-teal-600 font-semibold">{cat.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

// ────────────────────────────────────────────────────────────
// 2. DESKTOP NEARBY SALONS (3-col grid, large cards)
// ────────────────────────────────────────────────────────────
const SALON_PLACEHOLDERS = [
    { _id: "p1", shopName: "Evita Beauty Parlour", galleryImages: [salonImg], distance: "321.7", rating: "4.8", reviewCount: "200", gender: "women", categories: ["Haircut", "Massage", "Facial"] },
    { _id: "p2", shopName: "Refine Glo Salon", galleryImages: [haircutImg], distance: "321.7", rating: "4.6", reviewCount: "150", gender: "women", categories: ["Colour", "Wax", "Spa"] },
    { _id: "p3", shopName: "Glamour Studio", galleryImages: [facialImg], distance: "500.0", rating: "4.7", reviewCount: "320", gender: "women", categories: ["Makeup", "Bridal", "Facial"] },
    { _id: "p4", shopName: "Royal Cuts", galleryImages: [makeupImg], distance: "8.5", rating: "4.9", reviewCount: "320", gender: "men", categories: ["Haircut", "Beard", "Spa"] },
    { _id: "p5", shopName: "Urban Style Barbers", galleryImages: [salonImg], distance: "12.3", rating: "4.7", reviewCount: "180", gender: "men", categories: ["Haircut", "Shave", "Grooming"] },
];

function DesktopSalonCard({ salon, category, onClick }) {
    const [fav, setFav] = useState(false);
    const img = salon.galleryImages?.[0] || salonImg;
    const tags = salon.categories?.length > 0 ? salon.categories : [];

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl overflow-hidden cursor-pointer border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
        >
            <div className="relative h-52 lg:h-56 overflow-hidden">
                <img src={img} alt={salon.shopName} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <button
                    onClick={(e) => { e.stopPropagation(); setFav(p => !p); }}
                    className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md"
                >
                    <span className="text-base leading-none">{fav ? "❤️" : "🤍"}</span>
                </button>
                <div
                    className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.70) 0%, transparent 100%)" }}
                >
                    <span className="text-white text-xs font-semibold">📍 {salon.distance ? `${salon.distance} km` : "N/A"}</span>
                    <span className="text-white text-xs font-semibold">⭐ {salon.rating || "4.8"} ({salon.reviewCount || "200"})</span>
                </div>
            </div>
            <div className="px-5 lg:px-6 pt-4 pb-5">
                <p className="text-xs font-bold text-teal-500 uppercase tracking-wide mb-1">{category}</p>
                <h3 className="font-bold text-gray-900 text-base lg:text-lg truncate mb-1">{salon.shopName}</h3>
                <p className="text-gray-400 text-sm mb-3">{salon.salonCategory || "No categories available"}</p>
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-xs text-gray-600 bg-gray-100 rounded-full px-2.5 py-0.5 font-medium">{tag}</span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export function DesktopNearbySalons({ category, lat, lng, fallbackSalons = [] }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { homeSaloonsByCategory = [] } = useSelector((state) => state.user);

    const apiOrFallback = homeSaloonsByCategory?.length > 0 ? homeSaloonsByCategory : fallbackSalons;
    const salonsToShow = apiOrFallback?.length > 0
        ? apiOrFallback
        : SALON_PLACEHOLDERS.filter((s) => s.gender === category || s.gender === "unisex");

    useEffect(() => {
        if (category) dispatch(fetchHomeSaloonsByCategory({ category, lat, lng }));
    }, [dispatch, category, lat, lng]);

    return (
        <div className="bg-white pb-8 border-b border-gray-100">
            <div className="flex items-center justify-between px-10 lg:px-16 pt-6 pb-5">
                <h2 className="text-[18px] font-extrabold text-gray-900 uppercase tracking-wide">Nearby Salons</h2>
                <button onClick={() => navigate("/salons")} className="text-[14px] font-semibold" style={{ color: "#0d9488" }}>View all</button>
            </div>
            <div className="grid grid-cols-3 gap-6 px-10 lg:px-16">
                {salonsToShow.slice(0, 3).map((salon) => (
                    <DesktopSalonCard key={salon._id} salon={salon} category={category} onClick={() => navigate(`/salon/${salon._id}`)} />
                ))}
            </div>
        </div>
    );
}

// ────────────────────────────────────────────────────────────
// 3. DESKTOP HOME SERVICE (horizontal scroll, larger cards)
// ────────────────────────────────────────────────────────────
const DUMMY_PROS = [
    { _id: "d1", user: { name: "Abhishek" }, profilePhoto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=350&fit=crop&crop=faces", availability: "Not available", experienceYears: 4, specializations: ["Hairs"], gender: "MALE", rating: "4.5", isAvailable: false },
    { _id: "d2", user: { name: "Priya Sharma" }, profilePhoto: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=350&fit=crop&crop=faces", availability: "Available now", experienceYears: 6, specializations: ["Makeup"], gender: "FEMALE", rating: "4.8", isAvailable: true },
    { _id: "d3", user: { name: "Gita Rao" }, profilePhoto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=350&fit=crop&crop=faces", availability: "Not available", experienceYears: 3, specializations: ["Facial"], gender: "FEMALE", rating: "4.3", isAvailable: false },
    { _id: "d4", user: { name: "Rahul Mehta" }, profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=350&fit=crop&crop=faces", availability: "Available now", experienceYears: 5, specializations: ["Haircut"], gender: "MALE", rating: "4.6", isAvailable: true },
    { _id: "d5", user: { name: "Sneha Patel" }, profilePhoto: "https://images.unsplash.com/photo-1502767089025-6572583495f9?w=300&h=350&fit=crop&crop=faces", availability: "Available now", experienceYears: 7, specializations: ["Waxing"], gender: "FEMALE", rating: "4.9", isAvailable: true },
    { _id: "d6", user: { name: "Arjun Singh" }, profilePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=350&fit=crop&crop=faces", availability: "Not available", experienceYears: 2, specializations: ["Beard"], gender: "MALE", rating: "4.1", isAvailable: false },
];

function DesktopProCard({ pro, onPress }) {
    const isAvail = pro.isAvailable || pro.availability?.toLowerCase().includes("available now");
    const name = pro.user?.name || "Professional";
    const exp = pro.experienceYears ? `${pro.experienceYears} yrs Exp` : "N/A";
    const spec = typeof pro.specializations?.[0] === "string" ? pro.specializations[0] : pro.specializations?.[0]?.name || "";

    return (
        <div
            className="bg-white rounded-2xl overflow-hidden shrink-0 cursor-pointer border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            style={{ width: 210, boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}
            onClick={onPress}
        >
            <div className="relative w-full" style={{ height: 220 }}>
                <img src={pro.profilePhoto} alt={name} className="w-full h-full object-cover object-center" />
                <div className="absolute top-2 right-2 rounded-full px-2 py-0.5" style={{ backgroundColor: isAvail ? "#16a34a" : "#6b7280" }}>
                    <span className="text-white text-[10px] font-bold">{isAvail ? "● Available" : "● Busy"}</span>
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full px-2 py-0.5" style={{ backgroundColor: "#16a34a" }}>
                    <span className="text-white text-[11px] font-bold">{pro.rating || "4.5"}</span>
                    <span className="text-[11px]">⭐</span>
                </div>
                <div className="absolute bottom-2 right-2 rounded-full px-2 py-0.5" style={{ backgroundColor: "rgba(0,0,0,0.55)" }}>
                    <span className="text-white text-[10px] font-bold">{pro.gender}</span>
                </div>
            </div>
            <div className="px-4 pt-3 pb-4">
                <p className="font-bold text-[15px] truncate mb-0.5" style={{ color: "#0d9488" }}>{name}</p>
                <p className="text-[12px] text-gray-500 flex items-center gap-1">🧳 {exp}</p>
                <p className="text-[12px] text-gray-500 mt-0.5 flex items-center gap-1">✂️ {spec}</p>
                <button
                    className="mt-3 w-full py-2 rounded-full text-[13px] font-bold border"
                    style={{ borderColor: "#0d9488", color: "#0d9488" }}
                    onClick={(e) => { e.stopPropagation(); onPress(); }}
                >
                    Book Now
                </button>
            </div>
        </div>
    );
}

export function DesktopHomeService() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { independentProfessionals, loading } = useSelector((state) => state.user);

    useEffect(() => { dispatch(fetchIndependentProfessionals()); }, [dispatch]);

    const goToDetail = (pro) => {
        localStorage.setItem("selectedSalon", JSON.stringify(pro));
        navigate("/independentprofessionaldetailspage");
    };

    const prosToShow = independentProfessionals?.length > 0 ? independentProfessionals : DUMMY_PROS;
    if (loading) return null;

    return (
        <div className="bg-white pb-8 border-b border-gray-100">
            <div className="flex items-center justify-between px-10 lg:px-16 pt-6 pb-1">
                <div>
                    <h2 className="text-[18px] font-extrabold text-gray-900 uppercase tracking-wide">Home Service</h2>
                    <p className="text-[12px] text-gray-400 mt-0.5">{prosToShow.length} professionals nearby</p>
                </div>
                <button
                    className="text-[14px] font-semibold border rounded-full px-4 py-1.5"
                    style={{ color: "#0d9488", borderColor: "#0d9488" }}
                    onClick={() => navigate("/independentprofessionaldetailspage")}
                >
                    View all &gt;
                </button>
            </div>
            <div
                className="flex gap-4 px-10 lg:px-16 pt-4 overflow-x-auto"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {prosToShow.map((pro) => (
                    <DesktopProCard key={pro._id} pro={pro} onPress={() => goToDetail(pro)} />
                ))}
            </div>
        </div>
    );
}

// ────────────────────────────────────────────────────────────
// 4. DESKTOP UNISEX SALONS (3-col grid, large cards)
// ────────────────────────────────────────────────────────────
const UNISEX_PLACEHOLDERS = [
    { _id: "u1", shopName: "Evita Beauty Parlour", galleryImages: [salonImg], distance: "321.7", rating: "4.8", reviewCount: "200", categories: ["Haircut", "Massage", "Facial"] },
    { _id: "u2", shopName: "Refine Glo Salon", galleryImages: [haircutImg], distance: "321.7", rating: "4.6", reviewCount: "150", categories: ["Haircut", "Massage", "Facial"] },
    { _id: "u3", shopName: "Glamour Studio", galleryImages: [facialImg], distance: "500.0", rating: "4.7", reviewCount: "320", categories: ["Makeup", "Facial", "Wax"] },
];

export function DesktopUnisexSalons({ lat, lng }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { unisexSalonServices = [], loading } = useSelector((state) => state.user);

    useEffect(() => { dispatch(fetchAllUnisexSalonServices({ lat, lng })); }, [dispatch, lat, lng]);

    const salonsToShow = unisexSalonServices?.length > 0 ? unisexSalonServices : UNISEX_PLACEHOLDERS;
    if (loading) return null;

    return (
        <div className="bg-white pb-8">
            <div className="flex items-center justify-between px-10 lg:px-16 pt-6 pb-5">
                <h2 className="text-[18px] font-extrabold text-gray-900 uppercase tracking-wide">Unisex</h2>
                <button onClick={() => navigate("/salons")} className="text-[14px] font-semibold" style={{ color: "#0d9488" }}>View all</button>
            </div>
            <div className="grid grid-cols-3 gap-6 px-10 lg:px-16">
                {salonsToShow.slice(0, 3).map((salon) => (
                    <DesktopSalonCard key={salon._id} salon={salon} category="UNISEX" onClick={() => navigate(`/salon/${salon._id}`)} />
                ))}
            </div>
        </div>
    );
}
