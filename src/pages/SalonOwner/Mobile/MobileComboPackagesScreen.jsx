import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllServiceItems } from "../../../redux/slice/saloonownerSlice";
import { ChevronLeft, Gift, PlusCircle, CheckCircle, Clock, Trash2, Edit2, Info, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// Using Mock Data since there's no combo API in web yet
const MOCK_COMBO_PACKAGES = [
    {
        _id: "1",
        name: "Complete Hair Package",
        description: "Haircut + Head Massage + Hair Wash",
        services: ["1", "2"],
        originalPrice: 250,
        comboPrice: 200,
        discount: 20,
        duration: 60,
    },
    {
        _id: "2",
        name: "Facial + Threading",
        description: "Facial treatment with Threading",
        services: ["3"],
        originalPrice: 300,
        comboPrice: 250,
        discount: 17,
        duration: 75,
    },
];

export default function MobileComboPackagesScreen() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { serviceItems = [] } = useSelector((state) => state.saloonowner);

    const [displayCombos, setDisplayCombos] = useState(MOCK_COMBO_PACKAGES);
    const [comboModalVisible, setComboModalVisible] = useState(false);
    const [editingCombo, setEditingCombo] = useState(null);

    const [comboForm, setComboForm] = useState({
        name: "",
        description: "",
        serviceIds: [],
        originalPrice: "",
        comboPrice: "",
    });

    useEffect(() => {
        dispatch(fetchAllServiceItems());
    }, [dispatch]);

    const openAddComboModal = () => {
        setEditingCombo(null);
        setComboForm({
            name: "",
            description: "",
            serviceIds: [],
            originalPrice: "",
            comboPrice: "",
        });
        setComboModalVisible(true);
    };

    const openEditComboModal = (combo) => {
        setEditingCombo(combo);
        setComboForm({
            name: combo.name,
            description: combo.description,
            serviceIds: combo.services,
            originalPrice: combo.originalPrice.toString(),
            comboPrice: combo.comboPrice.toString(),
        });
        setComboModalVisible(true);
    };

    const calculateDiscount = (original, combo) => {
        if (!original || !combo) return 0;
        return Math.round(((original - combo) / original) * 100);
    };

    const handleSaveCombo = (e) => {
        e.preventDefault();
        if (
            !comboForm.name.trim() ||
            !comboForm.description.trim() ||
            comboForm.serviceIds.length === 0 ||
            !comboForm.originalPrice ||
            !comboForm.comboPrice
        ) {
            toast.error("Please fill all fields and select at least one service");
            return;
        }

        const originalPrice = parseFloat(comboForm.originalPrice);
        const comboPrice = parseFloat(comboForm.comboPrice);

        if (comboPrice >= originalPrice) {
            toast.error("Combo price must be less than original price");
            return;
        }

        const discount = calculateDiscount(originalPrice, comboPrice);

        if (editingCombo) {
            // Update combo (mock)
            setDisplayCombos(
                displayCombos.map((combo) =>
                    combo._id === editingCombo._id
                        ? {
                            ...combo,
                            name: comboForm.name,
                            description: comboForm.description,
                            services: comboForm.serviceIds,
                            originalPrice,
                            comboPrice,
                            discount,
                        }
                        : combo
                )
            );
            toast.success("Combo package updated");
        } else {
            // Add new combo (mock)
            const newCombo = {
                _id: Date.now().toString(),
                name: comboForm.name,
                description: comboForm.description,
                services: comboForm.serviceIds,
                originalPrice,
                comboPrice,
                discount,
                duration: 60,
            };
            setDisplayCombos([...displayCombos, newCombo]);
            toast.success("Combo package created");
        }

        setComboModalVisible(false);
    };

    const handleDeleteCombo = (comboId) => {
        if (window.confirm("Are you sure you want to delete this combo?")) {
            setDisplayCombos(displayCombos.filter((c) => c._id !== comboId));
            toast.success("Combo deleted");
        }
    };

    const toggleServiceSelection = (serviceId) => {
        setComboForm((prev) => ({
            ...prev,
            serviceIds: prev.serviceIds.includes(serviceId)
                ? prev.serviceIds.filter((id) => id !== serviceId)
                : [...prev.serviceIds, serviceId],
        }));
    };

    const getServiceName = (serviceId) => {
        return serviceItems.find((s) => s._id === serviceId)?.name || `Service ID: ${serviceId}`;
    };

    const renderComboCard = (combo) => (
        <div
            key={combo._id}
            style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "12px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                borderTop: "3px solid #4CAF50"
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#333", margin: 0 }}>{combo.name}</h3>
                    <p style={{ fontSize: "12px", color: "#666", marginTop: "4px", marginBottom: 0 }}>{combo.description}</p>
                </div>
                <div
                    style={{
                        backgroundColor: "#FF5722",
                        borderRadius: "8px",
                        padding: "8px 10px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                >
                    <span style={{ fontSize: "16px", fontWeight: "700", color: "#fff" }}>{combo.discount}%</span>
                    <span style={{ fontSize: "10px", fontWeight: "600", color: "#fff" }}>OFF</span>
                </div>
            </div>

            {/* Services List */}
            <div style={{ backgroundColor: "#f9f9f9", borderRadius: "8px", padding: "10px", marginBottom: "12px" }}>
                <h4 style={{ fontSize: "12px", fontWeight: "600", color: "#333", marginBottom: "8px", marginTop: 0 }}>Services Included:</h4>
                {combo.services.map((serviceId) => (
                    <div key={serviceId} style={{ display: "flex", alignItems: "center", padding: "4px 8px", backgroundColor: "#E8F5E9", borderRadius: "6px", marginBottom: "6px", gap: "6px" }}>
                        <CheckCircle size={14} color="#4CAF50" />
                        <span style={{ fontSize: "12px", color: "#2E7D32", fontWeight: "500" }}>{getServiceName(serviceId)}</span>
                    </div>
                ))}
            </div>

            {/* Pricing */}
            <div style={{ backgroundColor: "#f5f5f5", borderRadius: "8px", padding: "12px", marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", paddingBottom: "8px", borderBottom: "1px solid #e0e0e0" }}>
                    <span style={{ fontSize: "12px", color: "#666", fontWeight: "500" }}>Original Price:</span>
                    <span style={{ fontSize: "12px", color: "#999", textDecoration: "line-through", fontWeight: "500" }}>₹{combo.originalPrice}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "12px", color: "#666", fontWeight: "500" }}>Combo Price:</span>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#4CAF50" }}>₹{combo.comboPrice}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                    <span style={{ fontSize: "12px", color: "#333", fontWeight: "600" }}>You Save:</span>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#FF5722" }}>₹{combo.originalPrice - combo.comboPrice}</span>
                </div>
            </div>

            {/* Duration */}
            <div style={{ display: "flex", alignItems: "center", backgroundColor: "#E3F2FD", borderRadius: "8px", padding: "8px 10px", marginBottom: "12px", gap: "8px" }}>
                <Clock size={16} color="#156778" />
                <span style={{ fontSize: "12px", color: "#1565C0", fontWeight: "500" }}>Approx. {combo.duration} minutes</span>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "8px" }}>
                <button
                    onClick={() => openEditComboModal(combo)}
                    style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "10px", borderRadius: "6px", backgroundColor: "#156778", color: "#fff", border: "none", gap: "4px", cursor: "pointer" }}
                >
                    <Edit2 size={16} color="#fff" />
                    <span style={{ fontSize: "12px", fontWeight: "600" }}>Edit</span>
                </button>
                <button
                    onClick={() => handleDeleteCombo(combo._id)}
                    style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "10px", borderRadius: "6px", backgroundColor: "#f44336", color: "#fff", border: "none", gap: "4px", cursor: "pointer" }}
                >
                    <Trash2 size={16} color="#fff" />
                    <span style={{ fontSize: "12px", fontWeight: "600" }}>Delete</span>
                </button>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5", paddingBottom: "30px" }}>
            {/* Header */}
            <div style={{ backgroundColor: "#156778", padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <button onClick={() => navigate("/salon-owner")} style={{ background: "transparent", border: "none", padding: 0, marginTop: "2px", cursor: "pointer" }}>
                    <ChevronLeft size={26} color="#ffffff" />
                </button>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#fff", margin: 0 }}>Combo Packages</h1>
                    <p style={{ fontSize: "12px", color: "#ddd", marginTop: "2px", marginBottom: 0 }}>Create special offers & packages</p>
                </div>
            </div>

            {/* Add Button */}
            <button
                onClick={openAddComboModal}
                style={{
                    display: "flex",
                    backgroundColor: "#4CAF50",
                    margin: "12px 16px",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    width: "calc(100% - 32px)",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                <PlusCircle size={20} color="#fff" />
                <span style={{ color: "#fff", fontSize: "14px", fontWeight: "600" }}>Create New Package</span>
            </button>

            {/* Combos List */}
            <div style={{ padding: "0 16px", paddingBottom: "20px" }}>
                {displayCombos.length === 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "80px 0" }}>
                        <Gift size={60} color="#ccc" />
                        <span style={{ fontSize: "16px", color: "#999", marginTop: "12px" }}>No combo packages yet</span>
                        <span style={{ fontSize: "12px", color: "#bbb", marginTop: "6px" }}>Create a combo to attract more customers!</span>
                    </div>
                ) : (
                    displayCombos.map(renderComboCard)
                )}
            </div>

            {/* Add/Edit Modal */}
            {comboModalVisible && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "#fff", zIndex: 9999, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", backgroundColor: "#fff", borderBottom: "1px solid #f0f0f0" }}>
                        <button onClick={() => setComboModalVisible(false)} style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", display: "flex", alignItems: "center" }}>
                            <ChevronLeft size={26} color="#156778" />
                        </button>
                        <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#333", margin: 0 }}>
                            {editingCombo ? "Edit Package" : "Create Package"}
                        </h2>
                        <div style={{ width: "24px" }} />
                    </div>

                    <div style={{ flex: 1, overflowY: "auto", padding: "16px", backgroundColor: "#f5f5f5" }}>
                        <form onSubmit={handleSaveCombo}>
                            <label style={labelStyle}>Package Name *</label>
                            <input
                                style={inputStyle}
                                placeholder="e.g., Complete Hair Package"
                                value={comboForm.name}
                                onChange={(e) => setComboForm({ ...comboForm, name: e.target.value })}
                                required
                            />

                            <label style={labelStyle}>Description *</label>
                            <textarea
                                style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }}
                                placeholder="e.g., Haircut + Head Massage + Hair Wash"
                                value={comboForm.description}
                                onChange={(e) => setComboForm({ ...comboForm, description: e.target.value })}
                                required
                            />

                            <label style={labelStyle}>Select Services *</label>
                            <div style={{ marginBottom: "12px" }}>
                                {serviceItems.length === 0 ? (
                                    <div style={{ fontSize: "12px", color: "#999", padding: "10px", backgroundColor: "#fff", borderRadius: "8px", textAlign: "center" }}>
                                        No services available to select.
                                    </div>
                                ) : serviceItems.map((service) => (
                                    <div
                                        key={service._id}
                                        onClick={() => toggleServiceSelection(service._id)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            backgroundColor: comboForm.serviceIds.includes(service._id) ? "#E8F5E9" : "#f9f9f9",
                                            borderRadius: "8px",
                                            padding: "12px",
                                            marginBottom: "8px",
                                            border: "2px solid",
                                            borderColor: comboForm.serviceIds.includes(service._id) ? "#4CAF50" : "#e0e0e0",
                                            gap: "10px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: "13px", fontWeight: "600", color: "#333" }}>{service.name}</div>
                                            <div style={{ fontSize: "11px", color: "#999", marginTop: "2px" }}>₹{service.price}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <label style={labelStyle}>Original Total Price (₹) *</label>
                            <input
                                style={inputStyle}
                                type="number"
                                placeholder="e.g., 250"
                                value={comboForm.originalPrice}
                                onChange={(e) => setComboForm({ ...comboForm, originalPrice: e.target.value })}
                                required
                            />

                            <label style={labelStyle}>Combo Price (₹) *</label>
                            <input
                                style={inputStyle}
                                type="number"
                                placeholder="e.g., 200"
                                value={comboForm.comboPrice}
                                onChange={(e) => setComboForm({ ...comboForm, comboPrice: e.target.value })}
                                required
                            />

                            {comboForm.originalPrice && comboForm.comboPrice && (
                                <div style={{ backgroundColor: "#FFF3E0", borderRadius: "8px", padding: "12px", marginTop: "12px", marginBottom: "12px" }}>
                                    <span style={{ fontSize: "12px", fontWeight: "600", color: "#E65100" }}>Discount:</span>
                                    <div style={{ fontSize: "14px", fontWeight: "700", color: "#FF5722", marginTop: "4px" }}>
                                        {calculateDiscount(parseFloat(comboForm.originalPrice), parseFloat(comboForm.comboPrice))}% OFF
                                        (Save ₹{parseFloat(comboForm.originalPrice) - parseFloat(comboForm.comboPrice)})
                                    </div>
                                </div>
                            )}

                            <div style={{ backgroundColor: "#E3F2FD", borderRadius: "8px", padding: "12px", marginTop: "16px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                                <Info size={18} color="#2196F3" style={{ flexShrink: 0 }} />
                                <span style={{ fontSize: "12px", color: "#1565C0", flex: 1, lineHeight: "16px" }}>
                                    Combo packages help increase average booking value and customer satisfaction
                                </span>
                            </div>

                            <button
                                type="submit"
                                style={{
                                    width: "100%",
                                    backgroundColor: "#156778",
                                    borderRadius: "8px",
                                    padding: "14px",
                                    marginTop: "24px",
                                    marginBottom: "20px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "8px",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                <CheckCircle size={20} color="#fff" />
                                <span style={{ fontSize: "15px", fontWeight: "700", color: "#fff" }}>
                                    {editingCombo ? "Update Package" : "Create Package"}
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const labelStyle = { fontSize: "13px", fontWeight: "600", color: "#333", marginTop: "16px", marginBottom: "8px", display: "block" };
const inputStyle = { width: "100%", backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e0e0e0", padding: "10px 12px", fontSize: "14px", color: "#333", marginBottom: "12px", boxSizing: "border-box" };
