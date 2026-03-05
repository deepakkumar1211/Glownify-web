import React from "react";
import { useNavigate } from "react-router-dom";

// Category icon imports from assets/categoryIcons
import haircutIcon from "../../../assets/categoryIcons/haircut.svg";
import facialIcon from "../../../assets/categoryIcons/facial.svg";
import makeupIcon from "../../../assets/categoryIcons/makeup.svg";
import nailsIcon from "../../../assets/categoryIcons/nails.svg";
import waxingIcon from "../../../assets/categoryIcons/waxing.svg";
import spaIcon from "../../../assets/categoryIcons/spa.svg";
import coloringIcon from "../../../assets/categoryIcons/coloring.svg";
import massageIcon from "../../../assets/categoryIcons/massage.svg";

// Map category names to local SVG icons
const CATEGORY_ICONS = {
    Hairs: haircutIcon,
    Haircut: haircutIcon,
    Spa: spaIcon,
    Nails: nailsIcon,
    Coloring: coloringIcon,
    Wax: waxingIcon,
    Waxing: waxingIcon,
    Makeup: makeupIcon,
    "Make Up": makeupIcon,
    Facial: facialIcon,
    Massage: massageIcon,
};

const DEFAULT_ICON = haircutIcon; // fallback icon

const DEFAULT_CATEGORIES = [
    { id: 1, name: "Hairs" }, { id: 2, name: "Spa" },
    { id: 3, name: "Nails" }, { id: 4, name: "Coloring" },
    { id: 5, name: "Wax" }, { id: 6, name: "Makeup" },
];

// Service Categories — mobile only (horizontal icon scroll)
const ServiceCategories = ({ categories }) => {
    const navigate = useNavigate();
    const cats = categories?.length > 0 ? categories : DEFAULT_CATEGORIES;

    return (
        <div className="bg-white pb-3">
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
                <h2 className="text-[14px] font-semibold text-gray-800">What do you want to get?</h2>
                <button className="text-[13px] font-semibold" style={{ color: "#0d9488" }} onClick={() => navigate("/categories")}>
                    View all
                </button>
            </div>
            <div
                className="flex gap-4 overflow-x-auto px-4 pb-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {cats.map((cat) => (
                    <button key={cat.id || cat._id} className="flex flex-col items-center gap-1.5 shrink-0" onClick={() => navigate("/categories")}>
                        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: "#e0f7f5" }}>
                            <img
                                src={CATEGORY_ICONS[cat.name] || DEFAULT_ICON}
                                alt={cat.name}
                                className="w-8 h-8 object-contain"
                            />
                        </div>
                        <span className="text-[11px] text-gray-700 font-medium">{cat.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ServiceCategories;
