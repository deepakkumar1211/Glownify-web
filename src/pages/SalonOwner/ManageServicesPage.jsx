import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllCategories,
  fetchAllServiceItems,
  createServiceItem,
  editServiceItem,
  deleteServiceItem,
} from "../../redux/slice/saloonownerSlice";
import { Clock, DollarSign, Pencil, Trash2, Plus, X, Tag, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileManageServicesScreen from "./Mobile/MobileManageServicesScreen";
const initialFormState = {
  name: "",
  category: "",
  price: "",
  durationMins: "",
  discountPercent: "",
  description: "",
  image: "",
  serviceMode: "salon",
  providerType: "Salon",
};
import { toast } from "react-hot-toast";

const ManageServicesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { serviceItems = [], categories = [], loading } = useSelector((state) => state.saloonowner);

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingServiceId, setDeletingServiceId] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(fetchAllServiceItems());
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setForm(initialFormState);
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setIsEditMode(true);
    setEditingServiceId(service._id);
    setForm({
      name: service.name,
      category: service.category?._id || service.category,
      price: service.price,
      durationMins: service.durationMins,
      discountPercent: service.discountPercent || "",
      description: service.description || "",
      image: service.image || "",
      serviceMode: service.serviceMode || "salon",
      providerType: service.providerType || "Salon",
    });
    setShowModal(true);
  };

  const openDeleteModal = (serviceId) => {
    setDeletingServiceId(serviceId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const deletePromise = dispatch(
        deleteServiceItem(deletingServiceId)
      ).unwrap();

      await toast.promise(deletePromise, {
        loading: "Deleting service...",
        success: (res) =>
          res?.message || "Service deleted successfully!",
        error: (err) =>
          err?.message ||
          err?.error ||
          "Failed to delete service",
      });

      setShowDeleteModal(false);
      setDeletingServiceId(null);
    } catch (error) {
      console.error("Delete service error:", error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form:", form, "Edit Mode:", isEditMode, "Editing ID:", editingServiceId);
    try {
      const actionPromise = isEditMode
        ? dispatch(
          editServiceItem({
            serviceId: editingServiceId,
            serviceData: form,
          })
        ).unwrap()
        : dispatch(createServiceItem(form)).unwrap();

      await toast.promise(actionPromise, {
        loading: isEditMode ? "Updating service..." : "Creating service...",
        success: (res) =>
          res?.message ||
          (isEditMode
            ? "Service updated successfully!"
            : "Service created successfully!"),
        error: (err) =>
          err?.message ||
          err?.error ||
          "Operation failed. Please try again.",
      });

      setShowModal(false);
      setForm(initialFormState);
      setIsEditMode(false);
      setEditingServiceId(null);
    } catch (error) {
      console.error("Service submit error:", error);
    }
  };


  console.log("Service Items:", serviceItems);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (isMobile) {
    return <MobileManageServicesScreen />;
  }

  return (
    <div className="p-4 md:p-10 bg-[#F8FAFC] min-h-screen font-sans">
      {/* Header Section */}
      <div className="w-full mx-auto px-4 md:px-8 lg:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Services</h1>
          <p className="text-slate-500 mt-1 text-lg">Manage your salon menu</p>
        </div>

        <button onClick={() => navigate("/salon-owner/manage-add-ons")}>Add Ons</button>
        <button
          onClick={openCreateModal}
          className="group flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-purple-200 hover:-translate-y-0.5"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          Add New Service
        </button>
      </div>

      {/* Services Grid */}
      <div className="w-full mx-auto px-6 lg:px-12">
        {serviceItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="text-slate-300" size={40} />
            </div>
            <p className="text-slate-500 text-lg">Your service menu is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {serviceItems.map((service) => (
              <div
                key={service._id}
                className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300 flex flex-col relative overflow-hidden"
              >
                {/* Header: Name & Actions */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-[10px] font-bold uppercase tracking-wider mb-2">
                      {service.category?.name ? `${service.category?.name} ${service.category?.gender}` : "General"}
                    </span>
                    <h3 className="font-bold text-2xl text-slate-800 group-hover:text-purple-700 transition-colors capitalize">
                      {service.name}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(service)}
                      className="p-2.5 bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(service._id)}
                      className="p-2.5 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">
                  {service.description || "Offering high-quality professional care and attention."}
                </p>
                <p className="text-slate-400 text-xs italic mb-6">
                  Service Mode: {service.serviceMode || "salon"}
                </p>

                {/* Footer: Price & Duration */}
                <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">${service.price}</span>
                    {service.discountPercent > 0 && (
                      <span className="text-sm font-bold text-green-500 ml-2 bg-green-50 px-2 py-0.5 rounded-md">
                        {service.discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-slate-400 font-medium text-sm">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full">
                      <Clock size={16} className="text-purple-400" />
                      {service.durationMins} min
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {isEditMode ? "Edit Service" : "Add New Service"}
                </h2>
                <p className="text-sm text-slate-500">Fill in the details below to update your service menu.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body (Scrollable Area) */}
            <div className="p-8 overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Section 1: Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-purple-600 uppercase tracking-widest">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-slate-700 ml-1">Service Name</label>
                      <input
                        name="name"
                        placeholder="e.g., Luxury Haircut"
                        className="w-full border-slate-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-slate-700 ml-1">Category</label>
                      <select
                        name="category"
                        className="w-full border-slate-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all bg-white"
                        value={form.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>{cat.name} ({cat.gender})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Description</label>
                    <textarea
                      name="description"
                      placeholder="Describe the service experience..."
                      className="w-full border-slate-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all h-24 resize-none"
                      value={form.description}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Section 2: Pricing & Logistics */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold text-purple-600 uppercase tracking-widest">Pricing & Timing</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1 col-span-1">
                      <label className="text-sm font-semibold text-slate-700 ml-1">Price ($)</label>
                      <input type="number" name="price" className="w-full border-slate-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none" value={form.price} onChange={handleChange} required />
                    </div>
                    <div className="space-y-1 col-span-1">
                      <label className="text-sm font-semibold text-slate-700 ml-1">Discount (%)</label>
                      <input type="number" name="discountPercent" className="w-full border-slate-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none" value={form.discountPercent} onChange={handleChange} />
                    </div>
                    <div className="space-y-1 col-span-2">
                      <label className="text-sm font-semibold text-slate-700 ml-1">Duration (Mins)</label>
                      <input type="number" name="durationMins" className="w-full border-slate-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none" value={form.durationMins} onChange={handleChange} required />
                    </div>
                  </div>
                </div>

                {/* Section 3: Advanced Details */}
                <div className="space-y-4 pt-2">

                  <h3 className="text-xs font-bold text-purple-600 uppercase tracking-widest">Provider & Media</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-slate-700 ml-1">Service Mode</label>
                      <select name="serviceMode" className="w-full border-slate-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none bg-white" value={form.serviceMode} onChange={handleChange}>
                        <option value="salon">Salon</option>
                        <option value="home">Home</option>
                        <option value="both">Both</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-slate-700 ml-1">Provider Type</label>
                      <select name="providerType" className="w-full border-slate-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none bg-white" value={form.providerType} onChange={handleChange}>
                        <option value="Salon">Salon</option>
                        <option value="IndependentProfessional">Independent Professional</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-slate-700 ml-1">Image URL</label>
                      <input name="image" placeholder="https://..." className="w-full border-slate-200 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none" value={form.image} onChange={handleChange} />
                    </div>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 sticky bottom-0 bg-white">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-purple-200"
                  >
                    {isEditMode ? "Update Service Details" : "Publish Service"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServicesPage;