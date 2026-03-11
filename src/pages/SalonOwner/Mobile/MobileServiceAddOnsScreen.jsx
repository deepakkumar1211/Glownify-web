import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllServiceItems, editServiceItem } from "../../../redux/slice/saloonownerSlice";
import { ChevronLeft, PlusCircle, Edit, Trash2, Info, CheckCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function MobileServiceAddOnsScreen() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { serviceItems = [], loading } = useSelector((state) => state.saloonowner);

    const [selectedService, setSelectedService] = useState(null);
    const [addOnModalVisible, setAddOnModalVisible] = useState(false);
    const [editingAddOn, setEditingAddOn] = useState(null);

    const [addOnForm, setAddOnForm] = useState({
        name: "",
        price: "",
        type: "optional",
    });

    useEffect(() => {
        dispatch(fetchAllServiceItems());
    }, [dispatch]);

    const openAddOnModal = (service, addOn = null) => {
        setSelectedService(service);
        if (addOn) {
            setEditingAddOn(addOn);
            setAddOnForm({
                name: addOn.name,
                price: addOn.price != null ? addOn.price.toString() : "",
                type: addOn.isRecommended ? "recommended" : "optional",
            });
        } else {
            setEditingAddOn(null);
            setAddOnForm({
                name: "",
                price: "",
                type: "optional",
            });
        }
        setAddOnModalVisible(true);
    };

    const handleSaveAddOn = async (e) => {
        e.preventDefault();
        if (!addOnForm.name.trim() || !addOnForm.price.toString().trim()) {
            toast.error("Please fill all fields");
            return;
        }

        if (isNaN(parseFloat(addOnForm.price))) {
            toast.error("Please enter a valid price");
            return;
        }

        const priceNum = parseFloat(addOnForm.price);
        const isRec = addOnForm.type === "recommended";

        let updatedAddOns = [...(selectedService.addOns || [])];

        if (editingAddOn) {
            updatedAddOns = updatedAddOns.map((addon) =>
                addon._id === editingAddOn._id || addon.id === editingAddOn.id
                    ? { ...addon, name: addOnForm.name, price: priceNum, isRecommended: isRec }
                    : addon
            );
        } else {
            updatedAddOns.push({
                id: Date.now().toString(),
                name: addOnForm.name,
                price: priceNum,
                isRecommended: isRec,
                duration: 0
            });
        }

        const serviceData = {
            addOns: updatedAddOns
        };

        try {
            await toast.promise(
                dispatch(editServiceItem({ serviceId: selectedService._id, serviceData })).unwrap(),
                {
                    loading: "Saving Add-on...",
                    success: "Add-on saved successfully",
                    error: "Failed to save add-on"
                }
            );
            setAddOnModalVisible(false);
            setAddOnForm({ name: "", price: "", type: "optional" });
            setEditingAddOn(null);
            setSelectedService(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteAddOn = async (serviceId, addOn) => {
        if (window.confirm("Are you sure you want to delete this Add-on?")) {
            const service = serviceItems.find(s => s._id === serviceId);
            if (!service) return;

            const updatedAddOns = (service.addOns || []).filter(
                a => (a._id && a._id !== addOn._id) || (a.id && a.id !== addOn.id)
            );

            try {
                await toast.promise(
                    dispatch(editServiceItem({ serviceId, serviceData: { addOns: updatedAddOns } })).unwrap(),
                    {
                        loading: "Deleting Add-on...",
                        success: "Add-on deleted successfully",
                        error: "Failed to delete add-on"
                    }
                );
            } catch (err) {
                console.error(err);
            }
        }
    };

    const getTypeColor = (type) => {
        return type === "recommended" ? "#FF9800" : "#2196F3";
    };

    const renderServiceCard = (service) => {
        const addOnsList = service.addOns || [];

        return (
            <div
                key={service._id}
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "12px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
            >
                <div style={{ marginBottom: "12px" }}>
                    <div>
                        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#333", margin: 0 }}>
                            {service.name}
                        </h3>
                        <div style={{ display: "flex", gap: "12px", marginTop: "6px", alignItems: "center" }}>
                            <span
                                style={{
                                    fontSize: "12px",
                                    color: "#156778",
                                    fontWeight: "500",
                                    backgroundColor: "#E3F2FD",
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                }}
                            >
                                {typeof service.category === "object" ? service.category?.name : "Service"}
                            </span>
                            <span style={{ fontSize: "14px", fontWeight: "700", color: "#4CAF50" }}>
                                ₹{service.price}
                            </span>
                            <span style={{ fontSize: "12px", color: "#666" }}>
                                ⏱ {service.durationMins} mins
                            </span>
                        </div>
                    </div>
                </div>

                {/* Add-ons List */}
                {addOnsList.length > 0 ? (
                    <div
                        style={{
                            backgroundColor: "#f9f9f9",
                            borderRadius: "8px",
                            padding: "10px",
                            marginBottom: "12px",
                        }}
                    >
                        <h4 style={{ fontSize: "13px", fontWeight: "600", color: "#333", marginBottom: "10px", marginTop: 0 }}>
                            Add-ons ({addOnsList.length})
                        </h4>
                        {addOnsList.map((addOn, idx) => {
                            const typeLabel = addOn.isRecommended ? "recommended" : "optional";
                            return (
                                <div
                                    key={addOn._id || addOn.id || idx}
                                    style={{
                                        backgroundColor: "#fff",
                                        borderRadius: "8px",
                                        padding: "10px",
                                        marginBottom: "8px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        borderLeft: "3px solid #156778",
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: "13px", fontWeight: "600", color: "#333" }}>
                                            {addOn.name}
                                        </div>
                                        <div style={{ display: "flex", gap: "8px", marginTop: "6px", alignItems: "center" }}>
                                            <div
                                                style={{
                                                    backgroundColor: getTypeColor(typeLabel),
                                                    padding: "3px 6px",
                                                    borderRadius: "4px",
                                                }}
                                            >
                                                <span style={{ fontSize: "9px", fontWeight: "700", color: "#fff", textTransform: "uppercase" }}>
                                                    {typeLabel}
                                                </span>
                                            </div>
                                            <span style={{ fontSize: "12px", fontWeight: "700", color: "#2196F3" }}>
                                                ₹{addOn.price}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "8px" }}>
                                        <button
                                            onClick={() => openAddOnModal(service, addOn)}
                                            style={{ background: "none", border: "none", padding: "6px", cursor: "pointer" }}
                                        >
                                            <Edit size={18} color="#156778" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteAddOn(service._id, addOn)}
                                            style={{ background: "none", border: "none", padding: "6px", cursor: "pointer" }}
                                        >
                                            <Trash2 size={18} color="#f44336" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div
                        style={{
                            backgroundColor: "#f9f9f9",
                            borderRadius: "8px",
                            padding: "12px",
                            alignItems: "center",
                            marginBottom: "12px",
                            textAlign: "center"
                        }}
                    >
                        <span style={{ fontSize: "12px", color: "#999" }}>No add-ons yet</span>
                    </div>
                )}

                {/* Add Add-on Button */}
                <button
                    style={{
                        display: "flex",
                        width: "100%",
                        backgroundColor: "#4CAF50",
                        borderRadius: "8px",
                        padding: "10px",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "6px",
                        border: "none",
                        cursor: "pointer"
                    }}
                    onClick={() => openAddOnModal(service)}
                >
                    <PlusCircle size={16} color="#fff" />
                    <span style={{ color: "#fff", fontSize: "13px", fontWeight: "600" }}>Add Add-on</span>
                </button>
            </div>
        );
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5", paddingBottom: "30px" }}>
            <div
                style={{
                    backgroundColor: "#156778",
                    padding: "12px 16px",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                }}
            >
                <button onClick={() => navigate("/salon-owner")} style={{ background: "transparent", border: "none", padding: 0, marginTop: "2px", cursor: "pointer" }}>
                    <ChevronLeft size={26} color="#ffffff" />
                </button>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#fff", margin: 0 }}>Service Add-ons</h1>
                    <p style={{ fontSize: "12px", color: "#ddd", marginTop: "2px", marginBottom: 0 }}>
                        Manage add-ons for your services
                    </p>
                </div>
            </div>

            <div style={{ padding: "12px 16px" }}>
                {loading ? (
                    <div style={{ textAlign: "center", padding: "40px" }}>
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#156778] mx-auto"></div>
                        <p style={{ marginTop: "10px", color: "#999", fontSize: "14px" }}>Loading services...</p>
                    </div>
                ) : serviceItems.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "80px 0" }}>
                        <div style={{ fontSize: "60px" }}>💆</div>
                        <p style={{ fontSize: "16px", color: "#999", marginTop: "12px" }}>No services available</p>
                    </div>
                ) : (
                    serviceItems.map(renderServiceCard)
                )}
            </div>

            {addOnModalVisible && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        zIndex: 9999,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end"
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#fff",
                            borderTopLeftRadius: "20px",
                            borderTopRightRadius: "20px",
                            height: "85vh",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                padding: "16px",
                                borderBottom: "1px solid #f0f0f0",
                                gap: "12px",
                            }}
                        >
                            <button onClick={() => setAddOnModalVisible(false)} style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer" }}>
                                <ChevronLeft size={26} color="#156778" />
                            </button>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#333", margin: 0 }}>
                                    {editingAddOn ? "Edit Add-on" : "Add New Add-on"}
                                </h2>
                                <p style={{ fontSize: "12px", color: "#999", marginTop: "4px", marginBottom: 0 }}>
                                    {selectedService?.name}
                                </p>
                            </div>
                        </div>

                        <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
                            <form onSubmit={handleSaveAddOn}>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#333", marginTop: "16px", marginBottom: "8px" }}>
                                    Add-on Name *
                                </label>
                                <input
                                    style={{
                                        width: "100%",
                                        backgroundColor: "#fff",
                                        borderRadius: "8px",
                                        border: "1px solid #e0e0e0",
                                        padding: "10px 12px",
                                        fontSize: "14px",
                                        color: "#333",
                                        boxSizing: "border-box"
                                    }}
                                    placeholder="e.g., Head Massage, Hair Wash"
                                    value={addOnForm.name}
                                    onChange={(e) => setAddOnForm({ ...addOnForm, name: e.target.value })}
                                    required
                                />

                                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#333", marginTop: "16px", marginBottom: "8px" }}>
                                    Price (₹) *
                                </label>
                                <input
                                    style={{
                                        width: "100%",
                                        backgroundColor: "#fff",
                                        borderRadius: "8px",
                                        border: "1px solid #e0e0e0",
                                        padding: "10px 12px",
                                        fontSize: "14px",
                                        color: "#333",
                                        boxSizing: "border-box"
                                    }}
                                    placeholder="e.g., 60"
                                    type="number"
                                    value={addOnForm.price}
                                    onChange={(e) => setAddOnForm({ ...addOnForm, price: e.target.value })}
                                    required
                                />

                                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#333", marginTop: "16px", marginBottom: "8px" }}>
                                    Type
                                </label>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <div
                                        style={{
                                            flex: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            backgroundColor: addOnForm.type === "optional" ? "#E3F2FD" : "#f9f9f9",
                                            borderRadius: "8px",
                                            padding: "12px 10px",
                                            border: `2px solid ${addOnForm.type === "optional" ? "#2196F3" : "#e0e0e0"}`,
                                            gap: "8px",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => setAddOnForm({ ...addOnForm, type: "optional" })}
                                    >
                                        <div
                                            style={{
                                                width: "18px",
                                                height: "18px",
                                                borderRadius: "9px",
                                                border: "2px solid",
                                                borderColor: addOnForm.type === "optional" ? "#2196F3" : "#999",
                                                backgroundColor: addOnForm.type === "optional" ? "#2196F3" : "transparent"
                                            }}
                                        />
                                        <span style={{ fontSize: "12px", fontWeight: "600", color: "#666" }}>Optional</span>
                                    </div>

                                    <div
                                        style={{
                                            flex: 1,
                                            display: "flex",
                                            alignItems: "center",
                                            backgroundColor: addOnForm.type === "recommended" ? "#E3F2FD" : "#f9f9f9",
                                            borderRadius: "8px",
                                            padding: "12px 10px",
                                            border: `2px solid ${addOnForm.type === "recommended" ? "#2196F3" : "#e0e0e0"}`,
                                            gap: "8px",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => setAddOnForm({ ...addOnForm, type: "recommended" })}
                                    >
                                        <div
                                            style={{
                                                width: "18px",
                                                height: "18px",
                                                borderRadius: "9px",
                                                border: "2px solid",
                                                borderColor: addOnForm.type === "recommended" ? "#2196F3" : "#999",
                                                backgroundColor: addOnForm.type === "recommended" ? "#2196F3" : "transparent"
                                            }}
                                        />
                                        <span style={{ fontSize: "12px", fontWeight: "600", color: "#666" }}>Recommended</span>
                                    </div>
                                </div>

                                <p style={{ fontSize: "11px", color: "#666", marginTop: "8px", fontStyle: "italic" }}>
                                    💡 Recommended add-ons will be suggested to customers
                                </p>

                                <div
                                    style={{
                                        backgroundColor: "#E3F2FD",
                                        borderRadius: "8px",
                                        padding: "12px",
                                        marginTop: "16px",
                                        display: "flex",
                                        gap: "8px",
                                        alignItems: "flex-start",
                                    }}
                                >
                                    <Info size={18} color="#2196F3" style={{ flexShrink: 0 }} />
                                    <p style={{ fontSize: "12px", color: "#1565C0", margin: 0, lineHeight: "16px", flex: 1 }}>
                                        Add-ons will appear in the service details when customers book this service
                                    </p>
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
                                        {editingAddOn ? "Update Add-on" : "Add Add-on"}
                                    </span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
