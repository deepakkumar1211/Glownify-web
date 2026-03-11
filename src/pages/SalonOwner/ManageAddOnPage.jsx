import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Edit2, Trash2, Clock, IndianRupee, Image as ImageIcon, CheckCircle2, X, Loader2 } from "lucide-react";
import {
  fetchAllAddOns,
  createAddOn,
  editAddOn,
  deleteAddOn,
} from "../../redux/slice/saloonownerSlice";
import MobileServiceAddOnsScreen from "./Mobile/MobileServiceAddOnsScreen";

const emptyForm = {
  name: "",
  price: "",
  duration: "",
  imageURL: "",
  providerType: "salon",
  isRecommended: false,
};

const ManageAddOnPage = () => {
  const dispatch = useDispatch();
  const { addOns = [], loading } = useSelector((state) => state.saloonowner);

  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(fetchAllAddOns());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingId) {
        await dispatch(editAddOn({ addOnId: editingId, addOnData: formData })).unwrap();
      } else {
        await dispatch(createAddOn(formData)).unwrap();
      }
      resetForm();
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (addon) => {
    setEditingId(addon._id);
    setFormData({
      name: addon.name,
      price: addon.price,
      duration: addon.duration,
      imageURL: addon.imageURL,
      providerType: addon.providerType,
      isRecommended: addon.isRecommended,
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this add-on?")) {
      dispatch(deleteAddOn(id));
    }
  };

  if (isMobile) {
    return <MobileServiceAddOnsScreen />;
  }

  return (
    <div className="w-full mx-auto px-4 md:px-8 lg:px-12 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Add-Ons</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage additional services for your salon.</p>
        </div>
        <button
          onClick={() => {
            setFormData(emptyForm);
            setEditingId(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add New Service
        </button>
      </div>

      {/* MODAL POPUP */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={resetForm}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-lg text-gray-800">
                {editingId ? "Edit Add-On Details" : "Create New Add-On"}
              </h3>
              <button onClick={resetForm} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Service Name</label>
                  <input
                    name="name"
                    placeholder="e.g. Head Massage"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Price (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="price"
                      type="number"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Duration (mins)</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="duration"
                      type="number"
                      placeholder="30"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Provider Category</label>
                  <select
                    name="providerType"
                    value={formData.providerType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white transition-all"
                    required
                  >
                    <option value="salon">Salon Only</option>
                    <option value="freelancer">Freelancer</option>
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Image URL</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="imageURL"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.imageURL}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 bg-indigo-50 p-4 rounded-xl flex items-center gap-3 border border-indigo-100">
                  <input
                    type="checkbox"
                    id="isRecommended"
                    name="isRecommended"
                    checked={formData.isRecommended}
                    onChange={handleChange}
                    className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 cursor-pointer"
                  />
                  <label htmlFor="isRecommended" className="text-sm font-medium text-indigo-900 cursor-pointer">
                    Feature this add-on as "Recommended" to customers
                  </label>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? "Update Service" : "Save Service"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-xl font-bold text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid Display */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Fetching your add-ons...</p>
        </div>
      ) : addOns.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="text-gray-400 w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No add-ons yet</h3>
          <p className="text-gray-500 mb-6">Start by adding a new service to your salon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addOns.map((addon) => (
            <div
              key={addon._id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 relative"
            >
              <div className="relative h-48">
                <img
                  src={addon?.imageURL || "https://placehold.co/600x400?text=Service+Image"}
                  alt={addon.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {addon.isRecommended && (
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur shadow-sm px-3 py-1 rounded-full flex items-center gap-1.5 border border-green-100">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Recommended</span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 text-lg">{addon.name}</h3>
                  <span className="text-indigo-600 font-black text-lg">₹{addon.price}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {addon.duration} mins
                  </div>
                  <div className="px-2 py-0.5 bg-gray-100 rounded text-xs capitalize font-medium">
                    {addon.providerType}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(addon)}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 py-2 rounded-lg font-bold hover:bg-indigo-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addon._id)}
                    className="flex items-center justify-center w-10 h-10 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageAddOnPage;