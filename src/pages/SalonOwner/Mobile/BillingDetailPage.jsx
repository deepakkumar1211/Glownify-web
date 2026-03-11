import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, MoreVertical, Printer, Share2, Plus, Minus, Trash2, Calendar, Scissors, Leaf, Smile } from "lucide-react";

// ─── Colors ────────────────────────────────────────────────────────────────────
const PINK = "#e91e63";
const TEAL = "#14b8a6";

// ─── Mock data ────────────────────────────────────────────────────────────────
const INITIAL_SERVICES = [
    { id: 1, name: "Full Arm Waxing", price: 600, qty: 1, Icon: Scissors },
    { id: 2, name: "Leg Waxing", price: 700, qty: 1, Icon: Leaf },
    { id: 3, name: "Acne Facial", price: 500, qty: 1, Icon: Smile },
];

const TIP_OPTIONS = [20, 50, 100, 200];
const DISCOUNT_LABEL = "First Visit";
const DISCOUNT_AMOUNT = 280;

const CUSTOMER = {
    name: "Ayesha", invoiceNo: "INV-8829", date: "Oct 24, 2023", time: "10:30 AM",
    initials: "AY", avatarColor: "#fecdd3",
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ initials, color, size = 56 }) => (
    <div className="rounded-full flex items-center justify-center shrink-0 font-bold"
        style={{ width: size, height: size, backgroundColor: color, fontSize: size * 0.3, color: "#9f1239" }}>
        {initials}
    </div>
);

// ─── Service row ──────────────────────────────────────────────────────────────
const ServiceRow = ({ service, onIncrement, onDecrement, onDelete }) => {
    const { Icon } = service;
    return (
        <div className="bg-white rounded-2xl flex items-center px-4 py-3.5 mb-3"
            style={{ boxShadow: "0 1px 8px rgba(244,63,94,0.08)" }}>
            {/* Icon */}
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mr-3"
                style={{ backgroundColor: "#fff1f2" }}>
                <Icon size={20} color={PINK} />
            </div>
            {/* Name + price */}
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-[14px] text-gray-900">{service.name}</p>
                <p className="font-bold text-[13px] mt-0.5" style={{ color: TEAL }}>
                    ₹{(service.price * service.qty).toLocaleString("en-IN")}
                </p>
            </div>
            {/* Qty controls */}
            <div className="flex items-center gap-2.5">
                <button onClick={() => onDecrement(service.id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ border: "1px solid #e5e7eb", backgroundColor: "#f9fafb" }}>
                    <Minus size={13} color="#374151" />
                </button>
                <span className="font-bold text-[15px] text-gray-900 w-4 text-center">{service.qty}</span>
                <button onClick={() => onIncrement(service.id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ border: "1px solid #e5e7eb", backgroundColor: "#f9fafb" }}>
                    <Plus size={13} color="#374151" />
                </button>
            </div>
            {/* Delete */}
            <button onClick={() => onDelete(service.id)}
                className="w-8 h-8 rounded-full flex items-center justify-center ml-3 bg-gray-50">
                <Trash2 size={15} color="#9ca3af" />
            </button>
        </div>
    );
};

// ─── Main screen ──────────────────────────────────────────────────────────────
const BillingDetailPage = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState(INITIAL_SERVICES);
    const [selectedTip, setSelectedTip] = useState(50); // matches screenshot ₹50 selected

    const increment = (id) =>
        setServices((p) => p.map((s) => s.id === id ? { ...s, qty: s.qty + 1 } : s));
    const decrement = (id) =>
        setServices((p) => p.map((s) => s.id === id ? { ...s, qty: Math.max(1, s.qty - 1) } : s));
    const deleteService = (id) => {
        if (window.confirm("Remove this service from the bill?"))
            setServices((p) => p.filter((s) => s.id !== id));
    };

    const subtotal = services.reduce((sum, s) => sum + s.price * s.qty, 0);
    const grandTotal = subtotal + selectedTip - DISCOUNT_AMOUNT;

    return (
        <div className="min-h-screen bg-white pb-36 overflow-y-auto">

            {/* ── Top Nav ── */}
            <div className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-10"
                style={{ borderBottom: "1px solid #f3f4f6" }}>
                <button onClick={() => navigate(-1)}
                    className="w-9 h-9 flex items-center justify-center bg-transparent">
                    <ChevronLeft size={26} color={PINK} />
                </button>
                <p className="font-bold text-[17px] text-gray-900">Create Bill</p>
                <button className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50">
                    <MoreVertical size={19} color="#1f2937" />
                </button>
            </div>

            {/* ── Customer Info Card ── */}
            <div className="mx-4 mt-4 mb-5 bg-white rounded-2xl px-4 py-4 flex items-center gap-4"
                style={{ border: "1px solid #f3f4f6", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                <Avatar initials={CUSTOMER.initials} color={CUSTOMER.avatarColor} size={56} />
                <div>
                    <p className="font-bold text-[20px] text-gray-900">{CUSTOMER.name}</p>
                    <p className="font-bold text-[13px] mt-0.5" style={{ color: PINK }}>Bill #{CUSTOMER.invoiceNo}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                        <Calendar size={12} color="#9ca3af" />
                        <span className="text-[12px] text-gray-400">{CUSTOMER.date} • {CUSTOMER.time}</span>
                    </div>
                </div>
            </div>

            {/* ── Services ── */}
            <div className="px-4">
                <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-[20px] text-gray-900">Services</p>
                    <span className="px-3 py-1 rounded-full text-[12px] font-bold"
                        style={{ color: TEAL, backgroundColor: "#e0f7fa" }}>
                        {services.length} ITEMS
                    </span>
                </div>

                {services.map((s) => (
                    <ServiceRow key={s.id} service={s}
                        onIncrement={increment} onDecrement={decrement} onDelete={deleteService} />
                ))}

                {/* Add Service dashed */}
                <button
                    className="w-full flex items-center justify-center gap-2 rounded-2xl py-4 mb-6"
                    style={{ border: "1.5px dashed #f48fb1", backgroundColor: "#fff" }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: PINK }}>
                        <Plus size={15} color="#fff" />
                    </div>
                    <span className="font-bold text-[15px]" style={{ color: PINK }}>Add Service</span>
                </button>
            </div>

            {/* ── Add a Tip ── */}
            <div className="px-4 mb-6">
                <p className="font-bold text-[16px] text-gray-900 mb-3">Add a Tip</p>
                <div className="flex gap-2.5">
                    {TIP_OPTIONS.map((tip) => {
                        const active = selectedTip === tip;
                        return (
                            <button key={tip} onClick={() => setSelectedTip(tip)}
                                className="flex-1 py-3 rounded-full font-bold text-[14px] transition-all"
                                style={active
                                    ? { border: `2px solid ${PINK}`, color: PINK, backgroundColor: "#fff" }
                                    : { border: "1px solid #e5e7eb", color: "#374151", backgroundColor: "#fff" }}>
                                ₹{tip}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Bill Summary Card ── */}
            <div className="mx-4 rounded-2xl p-5 bg-white"
                style={{ border: "1px solid #f3f4f6", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>

                {/* Subtotal row with PAID badge */}
                <div className="flex justify-between items-center py-3" style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <p className="text-[14px] text-gray-500">Subtotal</p>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold tracking-wide text-white"
                            style={{ backgroundColor: TEAL }}>PAID</span>
                        <span className="font-semibold text-[14px] text-gray-900">₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                </div>

                {/* Tip row */}
                <div className="flex justify-between items-center py-3" style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <p className="text-[14px] text-gray-500">Tip Amount</p>
                    <span className="font-semibold text-[14px] text-gray-900">₹{selectedTip}</span>
                </div>

                {/* Discount row */}
                <div className="flex justify-between items-center py-3" style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <div className="flex items-center gap-2">
                        <p className="text-[14px] text-gray-500">Discount</p>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                            style={{ backgroundColor: "#fff1f2", border: "1px solid #fecdd3", color: PINK }}>
                            {DISCOUNT_LABEL}
                        </span>
                    </div>
                    <span className="font-bold text-[14px]" style={{ color: PINK }}>- ₹{DISCOUNT_AMOUNT}</span>
                </div>

                {/* Grand total */}
                <div className="flex justify-between items-center pt-4">
                    <p className="font-bold text-[18px] text-gray-900">Grand Total</p>
                    <p className="font-extrabold text-[26px]" style={{ color: TEAL }}>₹{grandTotal.toLocaleString("en-IN")}</p>
                </div>
            </div>

            {/* ── Sticky Bottom ── */}
            <div className="fixed bottom-0 left-0 right-0 bg-white px-4 pb-8 pt-4"
                style={{ borderTop: "1px solid #f3f4f6", boxShadow: "0 -4px 12px rgba(0,0,0,0.07)" }}>
                <button
                    className="w-full flex items-center justify-center gap-2.5 rounded-full py-4 text-white font-bold text-[16px] mb-2"
                    style={{ backgroundColor: PINK }}>
                    <Printer size={20} color="#fff" />Print Bill
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-2 font-semibold text-[14px] text-gray-400">
                    <Share2 size={16} color="#9ca3af" />Share Invoice
                </button>
            </div>
        </div>
    );
};

export default BillingDetailPage;
