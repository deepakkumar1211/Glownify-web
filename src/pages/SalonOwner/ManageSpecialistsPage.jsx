import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllSpecialists,
  createSpecialist,
  editSpecialist,
  deleteSpecialist,
} from "../../redux/slice/saloonownerSlice";
import {
  Plus,
  X,
  Phone,
  Trash2,
  Edit3,
  Briefcase,
  Mail,
  Award,
  Calendar,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import MobileManageSpecialistsScreen from "./Mobile/MobileManageSpecialistsScreen";

const expertiseOptions = ["Hair", "Skin", "Makeup", "Massage", "Nails", "Other"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const ManageSpecialistsPage = () => {
  const dispatch = useDispatch();
  const { specialists = [], loading } = useSelector((state) => state.saloonowner);

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    experienceYears: "",
    image: "",
    expertise: [],
    certifications: "",
    availability: [],
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(fetchAllSpecialists());
  }, [dispatch]);

  const resetForm = () => {
    setForm({
      name: "",
      phone: "",
      email: "",
      experienceYears: "",
      image: "",
      expertise: [],
      certifications: "",
      availability: [],
    });
  };

  const toggleExpertise = (skill) => {
    setForm((prev) => ({
      ...prev,
      expertise: prev.expertise.includes(skill)
        ? prev.expertise.filter((e) => e !== skill)
        : [...prev.expertise, skill],
    }));
  };

  const handleAvailabilityChange = (day, field, value) => {
    setForm((prev) => {
      const exists = prev.availability.find((a) => a.day === day);
      if (exists) {
        return {
          ...prev,
          availability: prev.availability.map((a) =>
            a.day === day ? { ...a, [field]: value } : a
          ),
        };
      }
      return {
        ...prev,
        availability: [...prev.availability, { day, start: "", end: "", [field]: value }],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      expertise: form.expertise,
      experienceYears: Number(form.experienceYears),
      certifications: form.certifications
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
      image: form.image,
      availability: form.availability.filter((a) => a.start && a.end),
    };

    try {
      const actionPromise = isEdit
        ? dispatch(
          editSpecialist({
            specialistId: selectedId,
            specialistData: payload,
          })
        ).unwrap()
        : dispatch(createSpecialist(payload)).unwrap();

      await toast.promise(actionPromise, {
        loading: isEdit ? "Updating specialist..." : "Creating specialist...",
        success: (res) =>
          res?.message ||
          (isEdit
            ? "Specialist updated successfully!"
            : "Specialist added successfully!"),
        error: (err) =>
          err?.message ||
          err?.error ||
          "Operation failed. Please try again.",
      });

      setOpen(false);
      setIsEdit(false);
      setSelectedId(null);
      resetForm();

      // Optional refresh if backend doesn't auto-update list
      dispatch(fetchAllSpecialists());
    } catch (error) {
      console.error("Specialist submit error:", error);
    }
  };


  const handleEdit = (s) => {
    setIsEdit(true);
    setSelectedId(s._id);
    setForm({
      name: s.user?.name || "",
      phone: s.user?.phone || "",
      email: s.user?.email || "",
      experienceYears: s.experienceYears || "",
      image: s.image || "",
      expertise: s.expertise || [],
      certifications: (s.certifications || []).join(", "),
      availability: s.availability || [],
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this specialist?")) return;

    try {
      const deletePromise = dispatch(deleteSpecialist(id)).unwrap();

      await toast.promise(deletePromise, {
        loading: "Deleting specialist...",
        success: (res) =>
          res?.message || "Specialist deleted successfully!",
        error: (err) =>
          err?.message ||
          err?.error ||
          "Failed to delete specialist",
      });

      dispatch(fetchAllSpecialists());
    } catch (error) {
      console.error("Delete specialist error:", error);
    }
  };

  if (isMobile) {
    return <MobileManageSpecialistsScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="w-full mx-auto px-4 md:px-8 lg:px-12 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Specialists</h1>
            <p className="text-slate-500 mt-1">Onboard and manage your professional team</p>
          </div>
          <button
            onClick={() => {
              setIsEdit(false);
              setSelectedId(null);
              resetForm();
              setOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-md shadow-indigo-100"
          >
            <Plus size={20} />
            <span>Add Specialist</span>
          </button>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : specialists.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No specialists found</h3>
            <p className="text-slate-500">Get started by adding your first team member.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialists.map((s) => (
              <div key={s._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={s.image || "https://ui-avatars.com/api/?name=" + s.user?.name}
                      className="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-50"
                      alt={s.user?.name}
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 text-lg leading-tight">{s.user?.name}</h3>
                      <div className="flex items-center gap-1.5 mt-2 text-indigo-600">
                        <Award size={14} />
                        <span className="text-xs font-bold uppercase tracking-wider">{s.experienceYears} Years Exp.</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {s.expertise?.map((e, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-3 text-slate-600 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                        <Phone size={14} className="text-slate-400" />
                      </div>
                      {s.user?.phone}
                    </div>
                    <div className="flex items-center gap-3 text-slate-600 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                        <Mail size={14} className="text-slate-400" />
                      </div>
                      {s.user?.email || "No email provided"}
                    </div>
                  </div>

                  {s.availability?.length > 0 && (
                    <div className="mt-4 bg-indigo-50/50 rounded-xl p-3">
                      <p className="text-[10px] font-bold text-indigo-400 uppercase mb-2 flex items-center gap-1">
                        <Clock size={12} /> Weekly Schedule
                      </p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {s.availability.slice(0, 4).map((a) => (
                          <div key={a._id} className="flex justify-between text-[11px]">
                            <span className="text-slate-500 font-medium">{a.day}</span>
                            <span className="text-slate-900">{a.start}-{a.end}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex border-t border-slate-100 bg-slate-50/50">
                  <button
                    onClick={() => handleEdit(s)}
                    className="flex-1 py-4 text-sm font-semibold text-slate-700 flex items-center justify-center gap-2 hover:bg-white transition-colors"
                  >
                    <Edit3 size={16} /> Edit
                  </button>
                  <div className="w-px bg-slate-200 my-3"></div>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="flex-1 py-4 text-sm font-semibold text-red-600 flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL */}
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setOpen(false)}></div>

            <div className="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <div>
                  <h2 className="font-bold text-xl text-slate-900">
                    {isEdit ? "Update Specialist Profile" : "Add New Specialist"}
                  </h2>
                  <p className="text-sm text-slate-500">Fill in the details below</p>
                </div>
                <button onClick={() => setOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[75vh]">
                <div className="space-y-6">
                  {/* Personal Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                      <input required placeholder="Jane Doe" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone Number</label>
                      <input required placeholder="+1 234..." className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
                      <input required type="email" placeholder="jane@example.com" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase ml-1">Years of Experience</label>
                      <input type="number" placeholder="5" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={form.experienceYears}
                        onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Expertise Selection */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-3">Area of Expertise</label>
                    <div className="flex flex-wrap gap-2">
                      {expertiseOptions.map((e) => (
                        <button
                          key={e}
                          type="button"
                          onClick={() => toggleExpertise(e)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${form.expertise.includes(e)
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100"
                            : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                            }`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Certifications</label>
                    <input
                      placeholder="L'Oreal Masterclass, Advanced Skin Therapy..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={form.certifications}
                      onChange={(e) => setForm({ ...form, certifications: e.target.value })}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Profile Image URL</label>
                    <input
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                    />
                  </div>

                  {/* Availability Grid */}
                  <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2 text-slate-900 font-bold mb-2">
                      <Calendar size={18} className="text-indigo-600" />
                      <h4>Weekly Availability</h4>
                    </div>
                    <div className="space-y-3">
                      {days.map((day) => (
                        <div key={day} className="flex flex-col sm:flex-row gap-3 sm:items-center bg-white p-3 rounded-xl border border-slate-100">
                          <span className="w-12 font-bold text-slate-700 text-sm">{day}</span>
                          <div className="flex flex-1 gap-2">
                            <input type="time" className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                              onChange={(e) => handleAvailabilityChange(day, "start", e.target.value)}
                            />
                            <span className="text-slate-300 flex items-center">to</span>
                            <input type="time" className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                              onChange={(e) => handleAvailabilityChange(day, "end", e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8 mt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="px-6 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-lg shadow-indigo-100">
                    {isEdit ? "Update Specialist" : "Save Specialist"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSpecialistsPage;