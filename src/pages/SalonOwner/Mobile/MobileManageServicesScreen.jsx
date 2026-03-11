import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    fetchAllCategories,
    fetchAllServiceItems,
    createServiceItem,
    editServiceItem,
    deleteServiceItem,
} from "../../../redux/slice/saloonownerSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
    PlusCircle,
    Edit,
    RefreshCcw,
    Trash2,
    XCircle,
    Info,
    Star,
    StarOff,
    Plus,
    CheckCircle,
    Building,
    Home,
    List,
    Scissors,
    ChevronLeft
} from "lucide-react";

export default function MobileManageServicesScreen() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { serviceItems = [], loading, categories = [] } = useSelector(
        (state) => state.saloonowner
    );

    const [modalVisible, setModalVisible] = useState(false);
    const [editingService, setEditingService] = useState(null);

    // Main service fields
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [durationMins, setDurationMins] = useState("30");
    const [discountPercent, setDiscountPercent] = useState("0");
    const [description, setDescription] = useState("");
    const [serviceMode, setServiceMode] = useState("salon");

    // Add-ons state
    const [addOns, setAddOns] = useState([]);
    const [showAddOnForm, setShowAddOnForm] = useState(false);

    // Gender filter states
    const [selectedGenderFilter, setSelectedGenderFilter] = useState("all");
    const [modalGenderFilter, setModalGenderFilter] = useState("all");

    useEffect(() => {
        dispatch(fetchAllServiceItems());
        dispatch(fetchAllCategories());
    }, [dispatch]);

    useEffect(() => {
        if (editingService) {
            const catId =
                typeof editingService.category === "object"
                    ? editingService.category?._id
                    : editingService.category;

            if (catId && !category) {
                setCategory(catId);
            }

            const serviceGender = editingService.gender;
            const catObj = categories.find((c) => c._id === catId);
            const derivedGender = serviceGender || catObj?.gender || "all";

            if (modalGenderFilter !== derivedGender) {
                setModalGenderFilter(derivedGender);
            }
        }
    }, [categories, editingService]);

    const getModalFilteredCategories = () => {
        if (!categories) return [];
        if (modalGenderFilter === "all") {
            return categories;
        }
        return categories.filter(
            (cat) => cat.gender === modalGenderFilter || cat.gender === "unisex"
        );
    };

    const getGenderBadgeColor = (gender) => {
        switch (gender) {
            case "men":
                return "#2196F3";
            case "women":
                return "#E91E63";
            case "unisex":
                return "#9C27B0";
            default:
                return "#757575";
        }
    };

    // Add-on management functions
    const addNewAddOn = () => {
        setAddOns([
            ...addOns,
            {
                id: Date.now().toString(), // temporary ID for UI
                name: "",
                price: "",
                duration: "0",
                isRecommended: false,
            },
        ]);
        setShowAddOnForm(true);
    };

    const updateAddOn = (index, field, value) => {
        const updated = [...addOns];
        updated[index] = { ...updated[index], [field]: value };
        setAddOns(updated);
    };

    const removeAddOn = (index) => {
        if (window.confirm("Are you sure you want to remove this add-on?")) {
            const updated = addOns.filter((_, idx) => idx !== index);
            setAddOns(updated);
            if (updated.length === 0) {
                setShowAddOnForm(false);
            }
        }
    };

    const toggleAddOnRecommended = (index) => {
        const updated = [...addOns];
        updated[index] = {
            ...updated[index],
            isRecommended: !updated[index].isRecommended,
        };
        setAddOns(updated);
    };

    const openModal = (service = null) => {
        if (service) {
            setEditingService(service);

            const catId =
                typeof service.category === "object"
                    ? service.category?._id
                    : service.category;

            setName(service.name || "");
            setCategory(catId || "");
            setPrice(service.price != null ? service.price.toString() : "");
            setDurationMins(
                service.durationMins != null ? service.durationMins.toString() : "30"
            );
            setDiscountPercent(
                service.discountPercent != null ? service.discountPercent.toString() : "0"
            );
            setDescription(service.description || "");
            setServiceMode(service.serviceMode || "salon");

            // Load existing add-ons
            if (service.addOns && service.addOns.length > 0) {
                setAddOns(
                    service.addOns.map((addon) => ({
                        id: addon._id || Date.now().toString(),
                        name: addon.name || "",
                        price: addon.price != null ? addon.price.toString() : "",
                        duration: addon.duration != null ? addon.duration.toString() : "0",
                        isRecommended: addon.isRecommended || false,
                    }))
                );
                setShowAddOnForm(true);
            } else {
                setAddOns([]);
                setShowAddOnForm(false);
            }

            const serviceGender = service.gender;
            const catObj = categories.find((c) => c._id === catId);
            setModalGenderFilter(serviceGender || catObj?.gender || "all");
        } else {
            // Reset for Add
            setEditingService(null);
            setName("");
            setCategory("");
            setPrice("");
            setDurationMins("30");
            setDiscountPercent("0");
            setDescription("");
            setServiceMode("salon");
            setAddOns([]);
            setShowAddOnForm(false);
            setModalGenderFilter("all");
        }
        setModalVisible(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!name || !category || !price) {
            toast.error("Please fill all required fields");
            return;
        }

        // Validate add-ons
        const validAddOns = addOns.filter((addon) => addon.name && addon.price);
        const invalidAddOns = addOns.filter((addon) => !addon.name || !addon.price);

        if (invalidAddOns.length > 0) {
            toast.error("Some add-ons have missing name or price. They will be excluded.");
        }

        const formattedAddOns = validAddOns.map((addon) => ({
            ...(addon._id && { _id: addon._id }),
            name: addon.name,
            price: Number(addon.price),
            duration: Number(addon.duration),
            isRecommended: addon.isRecommended,
        }));

        const serviceData = {
            name,
            category,
            price: Number(price),
            durationMins: Number(durationMins),
            discountPercent: Number(discountPercent),
            description,
            serviceMode,
            providerType: "Salon",
            addOns: formattedAddOns,
        };

        try {
            const actionPromise = editingService
                ? dispatch(
                    editServiceItem({
                        serviceId: editingService._id,
                        serviceData: serviceData,
                    })
                ).unwrap()
                : dispatch(createServiceItem(serviceData)).unwrap();

            await toast.promise(actionPromise, {
                loading: editingService ? "Updating service..." : "Creating service...",
                success: (res) =>
                    res?.message || (editingService ? "Service updated!" : "Service created!"),
                error: (err) => err?.message || err?.error || "Error saving service",
            });

            setModalVisible(false);
            setEditingService(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = (serviceId) => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            toast.promise(dispatch(deleteServiceItem(serviceId)).unwrap(), {
                loading: "Deleting service...",
                success: "Service deleted successfully!",
                error: "Failed to delete service",
            });
        }
    };

    const toggleStatus = async (service) => {
        try {
            const updatePromise = dispatch(
                editServiceItem({
                    serviceId: service._id,
                    serviceData: {
                        status: service.status === "active" ? "inactive" : "active",
                    },
                })
            ).unwrap();

            await toast.promise(updatePromise, {
                loading: "Updating status...",
                success: "Status updated!",
                error: "Failed to update status",
            });
        } catch (err) {
            console.error(err);
        }
    };

    const renderServiceCard = (service, index) => {
        const catObj =
            typeof service.category === "object"
                ? service.category
                : categories.find((c) => c._id === service.category);
        const catName = catObj ? catObj.name : "";
        const catGender = service.gender || catObj?.gender;
        const badgeColor = getGenderBadgeColor(catGender || "all");

        return (
            <div
                key={service._id || index}
                style={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    padding: "16px",
                    marginBottom: "12px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#333", margin: 0, padding: 0 }}>
                            {service.name}
                        </h3>
                        <div style={{ display: "flex", alignItems: "center", marginTop: "4px", gap: "6px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "13px", color: "#156778", fontWeight: "500" }}>
                                {catName}
                            </span>

                            {catGender && (
                                <div
                                    style={{
                                        backgroundColor: badgeColor,
                                        padding: "2px 8px",
                                        borderRadius: "12px",
                                        marginLeft: "8px",
                                    }}
                                >
                                    <span style={{ fontSize: "10px", color: "#fff", fontWeight: "600", textTransform: "uppercase" }}>
                                        {catGender.toString()}
                                    </span>
                                </div>
                            )}

                            {service.serviceMode && (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        backgroundColor:
                                            service.serviceMode === "salon"
                                                ? "#4CAF50"
                                                : service.serviceMode === "home"
                                                    ? "#FF9800"
                                                    : "#9C27B0",
                                        padding: "2px 8px",
                                        borderRadius: "12px",
                                        marginLeft: "6px",
                                        gap: "3px",
                                    }}
                                >
                                    {service.serviceMode === "salon" ? (
                                        <Building size={10} color="#fff" />
                                    ) : service.serviceMode === "home" ? (
                                        <Home size={10} color="#fff" />
                                    ) : (
                                        <List size={10} color="#fff" />
                                    )}
                                    <span style={{ fontSize: "10px", color: "#fff", fontWeight: "600", textTransform: "capitalize" }}>
                                        {service.serviceMode}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ alignItems: "flex-end" }}>
                        <span
                            style={{
                                fontSize: "13px",
                                fontWeight: "600",
                                color: service.status === "active" ? "#4CAF50" : "#f44336",
                            }}
                        >
                            {service.status === "active" ? "Active" : "Inactive"}
                        </span>
                    </div>
                </div>

                <div style={{ margin: "8px 0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "15px", fontWeight: "700", color: "#333" }}>₹{service.price}</span>
                        <span style={{ fontSize: "13px", color: "#666" }}>⏱ {service.durationMins} mins</span>
                    </div>
                    {service.discountPercent > 0 && (
                        <div style={{ fontSize: "12px", color: "#4CAF50", marginTop: "4px" }}>
                            💸 {service.discountPercent}% off
                        </div>
                    )}
                </div>

                {service.addOns && service.addOns.length > 0 && (
                    <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #f0f0f0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "6px" }}>
                            <PlusCircle size={14} color="#156778" />
                            <span style={{ fontSize: "12px", fontWeight: "600", color: "#156778" }}>
                                {service.addOns.length} Add-on{service.addOns.length > 1 ? "s" : ""}
                            </span>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
                            {service.addOns.slice(0, 2).map((addon, idx) => (
                                <div key={idx} style={{ display: "flex", alignItems: "center", backgroundColor: "#E3F2FD", padding: "4px 8px", borderRadius: "12px", gap: "4px" }}>
                                    <span style={{ fontSize: "11px", color: "#156778", fontWeight: "500" }}>
                                        {addon.name} (+₹{addon.price})
                                    </span>
                                    {addon.isRecommended && <Star size={10} color="#FFD700" fill="#FFD700" />}
                                </div>
                            ))}
                            {service.addOns.length > 2 && (
                                <span style={{ fontSize: "11px", color: "#999", fontStyle: "italic" }}>
                                    +{service.addOns.length - 2} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {service.description && (
                    <p style={{ fontSize: "12px", color: "#555", margin: "8px 0", lineHeight: "18px" }}>
                        {service.description}
                    </p>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", marginTop: "10px" }}>
                    <button
                        style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#156778", borderRadius: "8px", padding: "8px", gap: "4px", border: "none" }}
                        onClick={() => openModal(service)}
                    >
                        <Edit size={16} color="#fff" />
                        <span style={{ color: "#fff", fontWeight: "600", fontSize: "13px" }}>Edit</span>
                    </button>

                    <button
                        style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#4CAF50", borderRadius: "8px", padding: "8px", gap: "4px", border: "none" }}
                        onClick={() => toggleStatus(service)}
                    >
                        <RefreshCcw size={16} color="#fff" />
                        <span style={{ color: "#fff", fontWeight: "600", fontSize: "13px" }}>Toggle</span>
                    </button>

                    <button
                        style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f44336", borderRadius: "8px", padding: "8px", gap: "4px", border: "none" }}
                        onClick={() => handleDelete(service._id)}
                    >
                        <Trash2 size={16} color="#fff" />
                        <span style={{ color: "#fff", fontWeight: "600", fontSize: "13px" }}>Delete</span>
                    </button>
                </div>
            </div>
        );
    };

    const filteredServices = () => {
        if (selectedGenderFilter === "all") {
            return serviceItems;
        }
        return serviceItems.filter((service) => {
            const catObj =
                typeof service.category === "object"
                    ? service.category
                    : categories.find((c) => c._id === service.category);
            const serviceGender = service.gender || catObj?.gender;
            return serviceGender === selectedGenderFilter || serviceGender === "unisex";
        });
    };

    const displayedServices = filteredServices();

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5", paddingBottom: "30px" }}>
            <div style={{ backgroundColor: "#156778", padding: "16px", paddingTop: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <button onClick={() => navigate(-1)} style={{ background: "transparent", border: "none", padding: 0, marginTop: "2px", cursor: "pointer" }}>
                        <ChevronLeft size={26} color="#ffffff" />
                    </button>
                    <div>
                        <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#fff", margin: 0 }}>Services</h1>
                        <p style={{ fontSize: "12px", color: "#ddd", marginTop: "4px", marginBottom: 0 }}>
                            {serviceItems.length} Total
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: "#fff", padding: "12px 16px", borderBottom: "1px solid #e0e0e0" }}>
                <p style={{ fontSize: "13px", fontWeight: "600", color: "#666", marginBottom: "8px", marginTop: 0 }}>
                    Filter by Gender:
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                    {["all", "men", "women", "unisex"].map((gender) => (
                        <button
                            key={gender}
                            style={{
                                flex: 1,
                                padding: "8px 12px",
                                borderRadius: "8px",
                                border: "1px solid #156778",
                                backgroundColor: selectedGenderFilter === gender ? "#156778" : "#fff",
                                alignItems: "center",
                                textAlign: "center",
                                cursor: "pointer",
                            }}
                            onClick={() => setSelectedGenderFilter(gender)}
                        >
                            <span
                                style={{
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    color: selectedGenderFilter === gender ? "#fff" : "#156778",
                                    textTransform: "capitalize",
                                }}
                            >
                                {gender}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ padding: "16px" }}>
                <button
                    style={{
                        display: "flex",
                        width: "100%",
                        backgroundColor: "#156778",
                        borderRadius: "8px",
                        padding: "10px",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "12px",
                        gap: "6px",
                        border: "none",
                        cursor: "pointer",
                    }}
                    onClick={() => openModal(null)}
                >
                    <PlusCircle size={18} color="#fff" />
                    <span style={{ color: "#fff", fontWeight: "600", fontSize: "14px" }}>Add Service</span>
                </button>

                {loading ? (
                    <div style={{ textAlign: "center", padding: "40px 0" }}>
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#156778] mx-auto"></div>
                    </div>
                ) : displayedServices.length === 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "60px 0" }}>
                        <Scissors size={50} color="#ccc" />
                        <p style={{ fontSize: "16px", color: "#999", marginTop: "10px", textAlign: "center" }}>
                            {selectedGenderFilter === "all" ? "No services yet" : `No ${selectedGenderFilter} services found`}
                        </p>
                    </div>
                ) : (
                    displayedServices.map((s, i) => renderServiceCard(s, i))
                )}
            </div>

            {modalVisible && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "#fff", zIndex: 9999, overflowY: "auto" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px", paddingTop: "40px", borderBottom: "1px solid #e0e0e0" }}>
                        <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#156778", margin: 0 }}>
                            {editingService ? "Edit Service" : "Add Service"}
                        </h2>
                        <button style={{ background: "none", border: "none", padding: "4px" }} onClick={() => { setModalVisible(false); setEditingService(null); }}>
                            <XCircle size={28} color="#f44336" />
                        </button>
                    </div>

                    <form onSubmit={handleSave} style={{ padding: "0" }}>
                        <div style={{ padding: "20px", borderBottom: "1px solid #f0f0f0" }}>
                            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#333", margin: "0 0 16px 0" }}>Basic Information</h3>

                            <input
                                placeholder="Service Name *"
                                style={{ width: "100%", borderWidth: "1px", borderColor: "#ccc", borderRadius: "8px", padding: "12px", marginBottom: "12px", fontSize: "14px", boxSizing: "border-box" }}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />

                            <div style={{ marginBottom: "12px" }}>
                                <label style={{ display: "block", fontSize: "14px", color: "#666", marginBottom: "6px", fontWeight: "600" }}>Select Category *</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    style={{ width: "100%", borderWidth: "1px", borderColor: "#ccc", borderRadius: "8px", backgroundColor: "#f9f9f9", padding: "12px", fontSize: "14px", boxSizing: "border-box" }}
                                    required
                                >
                                    <option value="">-- Select Category --</option>
                                    {getModalFilteredCategories().map((cat) => (
                                        <option key={cat._id} value={cat._id}>{cat.name} ({cat.gender})</option>
                                    ))}
                                </select>
                            </div>

                            {category && (
                                <div style={{ display: "flex", alignItems: "center", marginBottom: "16px", padding: "10px 12px", backgroundColor: "#E3F2FD", borderRadius: "8px", gap: "6px" }}>
                                    <Info size={16} color="#156778" />
                                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#666" }}>Selected:</span>
                                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#156778" }}>
                                        {categories.find((c) => c._id === category)?.name || ""}
                                    </span>
                                    <div style={{ backgroundColor: getGenderBadgeColor(categories.find((c) => c._id === category)?.gender || "all"), marginLeft: "8px", padding: "2px 8px", borderRadius: "12px" }}>
                                        <span style={{ fontSize: "10px", color: "#fff", fontWeight: "600", textTransform: "uppercase" }}>
                                            {categories.find((c) => c._id === category)?.gender || "all"}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                                <input
                                    placeholder="Price (₹) *"
                                    type="number"
                                    style={{ flex: 1, borderWidth: "1px", borderColor: "#ccc", borderRadius: "8px", padding: "12px", fontSize: "14px", boxSizing: "border-box" }}
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                                <input
                                    placeholder="Duration (mins) *"
                                    type="number"
                                    style={{ flex: 1, borderWidth: "1px", borderColor: "#ccc", borderRadius: "8px", padding: "12px", fontSize: "14px", boxSizing: "border-box" }}
                                    value={durationMins}
                                    onChange={(e) => setDurationMins(e.target.value)}
                                    required
                                />
                            </div>

                            <input
                                placeholder="Discount %"
                                type="number"
                                style={{ width: "100%", borderWidth: "1px", borderColor: "#ccc", borderRadius: "8px", padding: "12px", marginBottom: "12px", fontSize: "14px", boxSizing: "border-box" }}
                                value={discountPercent}
                                onChange={(e) => setDiscountPercent(e.target.value)}
                            />

                            <textarea
                                placeholder="Description"
                                style={{ width: "100%", borderWidth: "1px", borderColor: "#ccc", borderRadius: "8px", padding: "12px", marginBottom: "12px", fontSize: "14px", boxSizing: "border-box", height: "80px", resize: "none" }}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />

                            <div style={{ marginBottom: "12px" }}>
                                <label style={{ display: "block", fontSize: "14px", color: "#666", marginBottom: "6px", fontWeight: "600" }}>Service Mode *</label>
                                <div style={{ display: "flex", gap: "8px" }}>
                                    {["salon", "home", "both"].map((mode) => (
                                        <div
                                            key={mode}
                                            onClick={() => setServiceMode(mode)}
                                            style={{
                                                flex: 1,
                                                padding: "10px 0",
                                                borderRadius: "8px",
                                                border: "1px solid #156778",
                                                alignItems: "center",
                                                textAlign: "center",
                                                backgroundColor: serviceMode === mode ? "#156778" : "#fff",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <span style={{ fontSize: "13px", fontWeight: "600", color: serviceMode === mode ? "#fff" : "#156778", textTransform: "capitalize" }}>
                                                {mode}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Add-ons Section */}
                        <div style={{ padding: "20px", borderBottom: "1px solid #f0f0f0" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                                    <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#333", margin: 0 }}>Add-ons</h3>
                                    <span style={{ fontSize: "13px", color: "#999", fontStyle: "italic" }}>(Optional)</span>
                                </div>
                                {!showAddOnForm && (
                                    <button
                                        type="button"
                                        style={{ display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px", borderRadius: "6px", border: "1px dashed #156778", background: "none", cursor: "pointer" }}
                                        onClick={() => setShowAddOnForm(true)}
                                    >
                                        <PlusCircle size={20} color="#156778" />
                                        <span style={{ fontSize: "13px", fontWeight: "600", color: "#156778" }}>Add Add-ons</span>
                                    </button>
                                )}
                            </div>

                            {showAddOnForm && (
                                <>
                                    {addOns.map((addon, index) => (
                                        <div key={addon.id || index} style={{ backgroundColor: "#f9f9f9", borderRadius: "10px", padding: "14px", marginBottom: "12px", border: "1px solid #e0e0e0" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                                <span style={{ fontSize: "14px", fontWeight: "700", color: "#156778" }}>Add-on #{index + 1}</span>
                                                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                                    <button type="button" style={{ background: "none", border: "none", padding: "4px", cursor: "pointer" }} onClick={() => toggleAddOnRecommended(index)}>
                                                        {addon.isRecommended ? <Star size={20} color="#FFD700" fill="#FFD700" /> : <StarOff size={20} color="#999" />}
                                                    </button>
                                                    <button type="button" style={{ background: "none", border: "none", padding: "0", cursor: "pointer" }} onClick={() => removeAddOn(index)}>
                                                        <Trash2 size={20} color="#f44336" />
                                                    </button>
                                                </div>
                                            </div>

                                            <input
                                                placeholder="Add-on Name *"
                                                style={{ width: "100%", borderWidth: "1px", borderColor: "#ccc", borderRadius: "8px", padding: "12px", marginBottom: "12px", fontSize: "14px", boxSizing: "border-box" }}
                                                value={addon.name}
                                                onChange={(e) => updateAddOn(index, "name", e.target.value)}
                                            />

                                            <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                                                <input
                                                    placeholder="Price (₹) *"
                                                    type="number"
                                                    style={{ flex: 1, borderWidth: "1px", borderColor: "#ccc", borderRadius: "8px", padding: "12px", fontSize: "14px", boxSizing: "border-box" }}
                                                    value={addon.price}
                                                    onChange={(e) => updateAddOn(index, "price", e.target.value)}
                                                />
                                                <input
                                                    placeholder="Duration (mins)"
                                                    type="number"
                                                    style={{ flex: 1, borderWidth: "1px", borderColor: "#ccc", borderRadius: "8px", padding: "12px", fontSize: "14px", boxSizing: "border-box" }}
                                                    value={addon.duration}
                                                    onChange={(e) => updateAddOn(index, "duration", e.target.value)}
                                                />
                                            </div>

                                            {addon.isRecommended && (
                                                <div style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#FFF9E6", padding: "4px 8px", borderRadius: "12px", alignSelf: "flex-start", marginTop: "4px", width: "max-content" }}>
                                                    <Star size={12} color="#FFD700" fill="#FFD700" />
                                                    <span style={{ fontSize: "11px", color: "#F57C00", fontWeight: "600" }}>Recommended Add-on</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center", gap: "6px", padding: "12px", borderRadius: "8px", border: "1px dashed #156778", backgroundColor: "#fff", cursor: "pointer" }}
                                        onClick={addNewAddOn}
                                    >
                                        <Plus size={18} color="#156778" />
                                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#156778" }}>Add Another Add-on</span>
                                    </button>
                                </>
                            )}
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", padding: "20px", gap: "10px", marginBottom: "20px" }}>
                            <button
                                type="submit"
                                style={{ flex: 1, display: "flex", borderRadius: "8px", padding: "14px", alignItems: "center", justifyContent: "center", gap: "6px", backgroundColor: "#156778", border: "none", cursor: "pointer" }}
                            >
                                <CheckCircle size={20} color="#fff" />
                                <span style={{ color: "#fff", fontWeight: "bold", fontSize: "15px" }}>{editingService ? "Update Service" : "Add Service"}</span>
                            </button>

                            <button
                                type="button"
                                style={{ flex: 1, display: "flex", borderRadius: "8px", padding: "14px", alignItems: "center", justifyContent: "center", gap: "6px", backgroundColor: "#f44336", border: "none", cursor: "pointer" }}
                                onClick={() => { setModalVisible(false); setEditingService(null); }}
                            >
                                <XCircle size={20} color="#fff" />
                                <span style={{ color: "#fff", fontWeight: "bold", fontSize: "15px" }}>Cancel</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
