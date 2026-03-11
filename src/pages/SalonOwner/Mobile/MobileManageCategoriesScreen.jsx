import React, { useState } from "react";
import { ChevronLeft, PlusCircle, CheckCircle, Info, XCircle, Scissors, Droplet, Smile, Sparkles, Flame, Users, Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

// Mock data for categories
const MOCK_CATEGORIES = [
    {
        _id: "1",
        name: "Haircut",
        icon: "cut",
        gender: "unisex",
        subcategories: ["Men", "Women", "Kids"],
        description: "Hair cutting services",
    },
    {
        _id: "2",
        name: "Hair Spa",
        icon: "water",
        gender: "unisex",
        subcategories: ["Oil Treatment", "Protein Treatment"],
        description: "Relaxing hair spa treatments",
    },
    {
        _id: "3",
        name: "Facial",
        icon: "face",
        gender: "women",
        subcategories: ["Hydrating", "Brightening", "Anti-Aging"],
        description: "Professional facial treatments",
    },
];

export default function MobileManageCategoriesScreen() {
    const navigate = useNavigate();

    const [displayCategories, setDisplayCategories] = useState(MOCK_CATEGORIES);
    const [modalVisible, setModalVisible] = useState(false);
    const [subcategoryModalVisible, setSubcategoryModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [selectedCategoryForSubcategory, setSelectedCategoryForSubcategory] = useState(null);

    const [categoryForm, setCategoryForm] = useState({
        name: "",
        icon: "cut",
        gender: "unisex",
        description: "",
    });

    const [newSubcategory, setNewSubcategory] = useState("");

    const genderOptions = [
        { label: "Men", value: "men" },
        { label: "Women", value: "women" },
        { label: "Unisex", value: "unisex" },
    ];

    const iconOptions = [
        { label: "Cut", value: "cut", IconComponent: Scissors },
        { label: "Water", value: "water", IconComponent: Droplet },
        { label: "Face", value: "face", IconComponent: Smile },
        { label: "Sparkles", value: "sparkles", IconComponent: Sparkles },
        { label: "Flame", value: "flame", IconComponent: Flame },
        { label: "People", value: "people", IconComponent: Users },
    ];

    const getIconComponent = (iconName) => {
        const option = iconOptions.find(opt => opt.value === iconName);
        return option ? option.IconComponent : Scissors;
    };

    const openAddCategoryModal = () => {
        setEditingCategory(null);
        setCategoryForm({
            name: "",
            icon: "cut",
            gender: "unisex",
            description: "",
        });
        setModalVisible(true);
    };

    const openEditCategoryModal = (category) => {
        setEditingCategory(category);
        setCategoryForm({
            name: category.name,
            icon: category.icon,
            gender: category.gender,
            description: category.description,
        });
        setModalVisible(true);
    };

    const handleSaveCategory = (e) => {
        e.preventDefault();
        if (!categoryForm.name.trim()) {
            toast.error("Please enter category name");
            return;
        }

        if (editingCategory) {
            setDisplayCategories(displayCategories.map(cat =>
                cat._id === editingCategory._id ? { ...cat, ...categoryForm } : cat
            ));
            toast.success("Category updated successfully");
        } else {
            const newCategory = {
                _id: Date.now().toString(),
                ...categoryForm,
                subcategories: [],
            };
            setDisplayCategories([...displayCategories, newCategory]);
            toast.success("Category added successfully");
        }

        setModalVisible(false);
    };

    const handleDeleteCategory = (categoryId) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            setDisplayCategories(displayCategories.filter(cat => cat._id !== categoryId));
            toast.success("Category deleted");
        }
    };

    const openSubcategoryModal = (category) => {
        setSelectedCategoryForSubcategory(category);
        setNewSubcategory("");
        setSubcategoryModalVisible(true);
    };

    const handleAddSubcategory = (e) => {
        e.preventDefault();
        if (!newSubcategory.trim()) {
            toast.error("Please enter subcategory name");
            return;
        }

        if (selectedCategoryForSubcategory.subcategories.includes(newSubcategory)) {
            toast.error("Subcategory already exists");
            return;
        }

        setDisplayCategories(displayCategories.map(cat =>
            cat._id === selectedCategoryForSubcategory._id
                ? { ...cat, subcategories: [...cat.subcategories, newSubcategory] }
                : cat
        ));

        toast.success("Subcategory added");
        setSubcategoryModalVisible(false);
    };

    const handleDeleteSubcategory = (categoryId, subcategoryName) => {
        if (window.confirm("Are you sure you want to delete this subcategory?")) {
            setDisplayCategories(displayCategories.map(cat =>
                cat._id === categoryId
                    ? { ...cat, subcategories: cat.subcategories.filter(sub => sub !== subcategoryName) }
                    : cat
            ));
            toast.success("Subcategory deleted");
        }
    };

    const getGenderColor = (gender) => {
        switch (gender) {
            case "men": return "#2196F3";
            case "women": return "#E91E63";
            case "unisex": return "#9C27B0";
            default: return "#757575";
        }
    };

    const renderCategoryCard = (category) => {
        const CategoryIcon = getIconComponent(category.icon);

        return (
            <div key={category._id} style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "16px", marginBottom: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", marginBottom: "12px", gap: "12px" }}>
                    <div style={{ width: "50px", height: "50px", borderRadius: "8px", backgroundColor: "#f0f0f0", display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0 }}>
                        <CategoryIcon size={32} color="#156778" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#333", margin: 0 }}>{category.name}</h3>
                        <div style={{ display: "flex", alignItems: "center", marginTop: "6px", gap: "8px" }}>
                            <div style={{ padding: "4px 8px", borderRadius: "6px", backgroundColor: getGenderColor(category.gender) }}>
                                <span style={{ fontSize: "10px", fontWeight: "600", color: "#fff", textTransform: "uppercase" }}>{category.gender}</span>
                            </div>
                            <span style={{ fontSize: "11px", color: "#999", fontWeight: "500" }}>{category.subcategories.length} subcategories</span>
                        </div>
                    </div>
                </div>

                {category.description && (
                    <p style={{ fontSize: "12px", color: "#666", marginBottom: "12px", lineHeight: "18px", marginTop: 0 }}>{category.description}</p>
                )}

                {category.subcategories.length > 0 && (
                    <div style={{ backgroundColor: "#f9f9f9", borderRadius: "8px", padding: "10px", marginBottom: "12px", borderLeft: "3px solid #156778" }}>
                        <h4 style={{ fontSize: "12px", fontWeight: "600", color: "#333", marginBottom: "8px", marginTop: 0 }}>Subcategories:</h4>
                        {category.subcategories.map((sub, idx) => (
                            <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px" }}>
                                <span style={{ fontSize: "12px", color: "#555" }}>• {sub}</span>
                                <button onClick={() => handleDeleteSubcategory(category._id, sub)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
                                    <XCircle size={18} color="#f44336" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                    <button
                        onClick={() => openSubcategoryModal(category)}
                        style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "10px", borderRadius: "6px", backgroundColor: "#4CAF50", color: "#fff", border: "none", gap: "4px", cursor: "pointer" }}
                    >
                        <PlusCircle size={16} color="#fff" />
                        <span style={{ fontSize: "12px", fontWeight: "600" }}>Add Sub</span>
                    </button>
                    <button
                        onClick={() => openEditCategoryModal(category)}
                        style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "10px", borderRadius: "6px", backgroundColor: "#156778", color: "#fff", border: "none", gap: "4px", cursor: "pointer" }}
                    >
                        <Edit2 size={16} color="#fff" />
                        <span style={{ fontSize: "12px", fontWeight: "600" }}>Edit</span>
                    </button>
                    <button
                        onClick={() => handleDeleteCategory(category._id)}
                        style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "10px", borderRadius: "6px", backgroundColor: "#f44336", color: "#fff", border: "none", gap: "4px", cursor: "pointer" }}
                    >
                        <Trash2 size={16} color="#fff" />
                        <span style={{ fontSize: "12px", fontWeight: "600" }}>Delete</span>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5", paddingBottom: "30px" }}>
            <div style={{ backgroundColor: "#156778", padding: "16px", display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <button onClick={() => navigate("/salon-owner")} style={{ background: "transparent", border: "none", padding: 0, marginTop: "2px", cursor: "pointer" }}>
                    <ChevronLeft size={26} color="#ffffff" />
                </button>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#fff", margin: 0 }}>Service Category</h1>
                    <p style={{ fontSize: "12px", color: "#ddd", marginTop: "4px", marginBottom: 0 }}>Manage your service categories</p>
                </div>
            </div>

            <button
                onClick={openAddCategoryModal}
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
                <span style={{ color: "#fff", fontSize: "14px", fontWeight: "600" }}>Add New Category</span>
            </button>

            <div style={{ padding: "0 16px", paddingBottom: "20px" }}>
                {displayCategories.length === 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "60px 0" }}>
                        <div style={{ marginBottom: "12px" }}>📁</div>
                        <span style={{ fontSize: "16px", color: "#999" }}>No categories yet</span>
                    </div>
                ) : (
                    displayCategories.map(renderCategoryCard)
                )}
            </div>

            {modalVisible && (
                <div style={modalOverlayStyle}>
                    <div style={modalBoxStyle}>
                        <div style={modalHeaderStyle}>
                            <button onClick={() => setModalVisible(false)} style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer" }}>
                                <ChevronLeft size={26} color="#156778" />
                            </button>
                            <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#333", margin: 0 }}>
                                {editingCategory ? "Edit Category" : "Add Category"}
                            </h2>
                            <div style={{ width: "24px" }} />
                        </div>

                        <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
                            <form onSubmit={handleSaveCategory}>
                                <label style={labelStyle}>Category Name *</label>
                                <input
                                    style={inputStyle}
                                    placeholder="e.g., Haircut, Facial"
                                    value={categoryForm.name}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                    required
                                />

                                <label style={labelStyle}>Icon</label>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                                    {iconOptions.map((opt) => (
                                        <div
                                            key={opt.value}
                                            onClick={() => setCategoryForm({ ...categoryForm, icon: opt.value })}
                                            style={{
                                                flex: "1 1 30%",
                                                backgroundColor: categoryForm.icon === opt.value ? "#156778" : "#f9f9f9",
                                                borderRadius: "8px",
                                                padding: "12px 0",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                border: "2px solid",
                                                borderColor: categoryForm.icon === opt.value ? "#156778" : "#e0e0e0",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <opt.IconComponent size={24} color={categoryForm.icon === opt.value ? "#fff" : "#156778"} />
                                            <span style={{ fontSize: "11px", color: categoryForm.icon === opt.value ? "#fff" : "#666", marginTop: "6px" }}>{opt.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <label style={labelStyle}>Gender</label>
                                <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                                    {genderOptions.map((opt) => (
                                        <div
                                            key={opt.value}
                                            onClick={() => setCategoryForm({ ...categoryForm, gender: opt.value })}
                                            style={{
                                                flex: 1,
                                                backgroundColor: categoryForm.gender === opt.value ? "#156778" : "#f9f9f9",
                                                borderRadius: "8px",
                                                padding: "12px 0",
                                                textAlign: "center",
                                                border: "2px solid",
                                                borderColor: categoryForm.gender === opt.value ? "#156778" : "#e0e0e0",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <span style={{ fontSize: "13px", fontWeight: "600", color: categoryForm.gender === opt.value ? "#fff" : "#666" }}>{opt.label}</span>
                                        </div>
                                    ))}
                                </div>

                                <label style={labelStyle}>Description</label>
                                <textarea
                                    style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
                                    placeholder="Describe this category"
                                    value={categoryForm.description}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                />

                                <button
                                    type="submit"
                                    style={{
                                        width: "100%",
                                        backgroundColor: "#156778",
                                        borderRadius: "8px",
                                        padding: "14px",
                                        marginTop: "20px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: "8px",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    <CheckCircle size={20} color="#fff" />
                                    <span style={{ fontSize: "15px", fontWeight: "700", color: "#fff" }}>Save Category</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {subcategoryModalVisible && (
                <div style={modalOverlayStyle}>
                    <div style={modalBoxStyle}>
                        <div style={modalHeaderStyle}>
                            <button onClick={() => setSubcategoryModalVisible(false)} style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer" }}>
                                <ChevronLeft size={26} color="#156778" />
                            </button>
                            <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#333", margin: 0 }}>
                                Add Subcategory
                            </h2>
                            <div style={{ width: "24px" }} />
                        </div>

                        <div style={{ padding: "16px", flex: 1 }}>
                            <form onSubmit={handleAddSubcategory}>
                                <label style={labelStyle}>Subcategory Name *</label>
                                <input
                                    style={inputStyle}
                                    placeholder="e.g., Men, Women, Kids"
                                    value={newSubcategory}
                                    onChange={(e) => setNewSubcategory(e.target.value)}
                                    required
                                />

                                <button
                                    type="submit"
                                    style={{
                                        width: "100%",
                                        backgroundColor: "#156778",
                                        borderRadius: "8px",
                                        padding: "14px",
                                        marginTop: "20px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: "8px",
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    <PlusCircle size={20} color="#fff" />
                                    <span style={{ fontSize: "15px", fontWeight: "700", color: "#fff" }}>Add Subcategory</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const modalOverlayStyle = { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "#f5f5f5", zIndex: 9999, display: "flex", flexDirection: "column" };
const modalBoxStyle = { flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#f5f5f5" };
const modalHeaderStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", backgroundColor: "#fff", borderBottom: "1px solid #f0f0f0" };
const labelStyle = { fontSize: "13px", fontWeight: "600", color: "#333", marginTop: "16px", marginBottom: "8px", display: "block" };
const inputStyle = { width: "100%", backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e0e0e0", padding: "10px 12px", fontSize: "14px", color: "#333", marginBottom: "12px", boxSizing: "border-box" };
