import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllSpecialists,
  createSpecialist,
  deleteSpecialist,
  editSpecialist
} from '../../../redux/slice/saloonownerSlice';
import {
  ArrowLeft,
  UserPlus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Briefcase,
  CheckCircle2,
  Camera,
  Plus,
  X,
  Clock,
  ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// ─── TIME PICKER ─────────────────────────────────────────────────────────────
function TimePicker({ label, value, onSelect }) {
  const [open, setOpen] = useState(false);
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = ["00", "30"];
  const periods = ["AM", "PM"];

  return (
    <div className="mb-3 relative">
      <label className="block text-xs font-bold text-[#156778] mb-1.5">{label}</label>

      <button
        type="button"
        className="w-full flex justify-between items-center border border-gray-200 rounded-xl px-4 py-3 bg-white text-sm shadow-sm active:bg-gray-50 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className={value ? "text-gray-900 font-medium" : "text-gray-400"}>
          {value || "Select Time"}
        </span>
        <Clock size={16} color="#156778" />
      </button>

      {open && (
        <div className="absolute z-10 w-full mt-1 border border-gray-100 rounded-xl bg-white overflow-hidden shadow-xl max-h-[160px] overflow-y-auto">
          {periods.map((p) =>
            hours.map((h) =>
              minutes.map((m) => {
                const time = `${h}:${m} ${p}`;
                return (
                  <div
                    key={time}
                    className="py-2.5 px-4 border-b border-gray-50 cursor-pointer hover:bg-teal-50"
                    onClick={() => {
                      onSelect(time);
                      setOpen(false);
                    }}
                  >
                    <span className="text-[13px] font-medium text-[#156778]">{time}</span>
                  </div>
                );
              })
            )
          )}
        </div>
      )}
    </div>
  );
}

// ─── EXPERTISE PICKER ────────────────────────────────────────────────────────
function ExpertisePicker({ selectedExpertise, onSelect }) {
  const expertiseList = ["Hair", "Skin", "Makeup", "Massage", "Nails", "Other"];

  const toggle = (exp, e) => {
    e.preventDefault();
    if (selectedExpertise.includes(exp))
      onSelect(selectedExpertise.filter((item) => item !== exp));
    else onSelect([...selectedExpertise, exp]);
  };

  return (
    <div className="mb-4">
      <label className="block text-xs font-bold text-[#156778] mb-2 uppercase tracking-wide">Expertise</label>
      <div className="flex flex-wrap gap-2">
        {expertiseList.map((exp) => {
          const selected = selectedExpertise.includes(exp);
          return (
            <button
              key={exp}
              onClick={(e) => toggle(exp, e)}
              className={`border rounded-full px-4 py-1.5 transition-colors shadow-sm ${selected
                  ? "bg-[#156778] border-[#156778] text-white"
                  : "bg-white border-gray-200 text-gray-600"
                }`}
            >
              <span className="text-[13px] font-medium">{exp}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── DAY PICKER ──────────────────────────────────────────────────────────────
function DayPicker({ selectedDays, onSelect }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const toggle = (day, e) => {
    e.preventDefault();
    if (selectedDays.includes(day))
      onSelect(selectedDays.filter((d) => d !== day));
    else onSelect([...selectedDays, day]);
  };

  return (
    <div className="mb-4">
      <label className="block text-xs font-bold text-[#156778] mb-2 uppercase tracking-wide">Available Days</label>
      <div className="flex flex-wrap gap-2">
        {days.map((day) => {
          const selected = selectedDays.includes(day);
          return (
            <button
              key={day}
              onClick={(e) => toggle(day, e)}
              className={`border border-gray-200 rounded-full px-[14px] py-1 transition-colors shadow-sm bg-white ${selected
                  ? "border-[#156778] ring-1 ring-[#156778]"
                  : "border-gray-200"
                }`}
            >
              <span className={`text-[13px] font-medium ${selected ? "text-[#156778]" : "text-gray-600"}`}>
                {day}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const DUMMY_SPECIALISTS = [
  {
    _id: '1',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    user: { name: 'Sophia Laurent', phone: '+1 (555) 012-3456' },
    expertise: ['Hair Coloring', 'Balayage', 'Keratin'],
    experienceYears: 8,
    certifications: ["L'Oréal Pro Certified", 'Wella Color Master', 'Redken Ambassador'],
    availability: [
      { day: 'Monday', start: '09:00', end: '17:00' },
      { day: 'Wednesday', start: '10:00', end: '18:00' },
      { day: 'Friday', start: '09:00', end: '15:00' },
      { day: 'Saturday', start: '10:00', end: '16:00' },
    ],
  },
  {
    _id: '2',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    user: { name: 'Marco Ricci', phone: '+1 (555) 987-6543' },
    expertise: ["Men's Cuts", 'Beard Styling', 'Hot Towel Shave'],
    experienceYears: 5,
    certifications: ['Barber Guild Certified', 'Schwarzkopf Pro'],
    availability: [
      { day: 'Tuesday', start: '11:00', end: '19:00' },
      { day: 'Thursday', start: '11:00', end: '19:00' },
      { day: 'Saturday', start: '09:00', end: '17:00' },
    ],
  },
  {
    _id: '3',
    image: '',
    user: { name: 'Aisha Nkemdi', phone: '+1 (555) 234-5678' },
    expertise: ['Braiding', 'Natural Hair', 'Protective Styles'],
    experienceYears: 12,
    certifications: [],
    availability: [
      { day: 'Monday', start: '08:00', end: '16:00' },
      { day: 'Tuesday', start: '08:00', end: '16:00' },
      { day: 'Friday', start: '08:00', end: '14:00' },
    ],
  },
];

export default function MobileManageSpecialistsScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { specialists = [], loading, error } = useSelector((state) => state.saloonowner);
  
  const specialists = DUMMY_SPECIALISTS;
  const loading = false;
  const error = null;

  const [expandedId, setExpandedId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const emptyForm = {
    name: '',
    phone: '',
    email: '',
    expertise: [],
    experienceYears: '',
    image: '',
    certifications: [],
    certificateInput: '',
    availabilityDays: [],
    startTime: '',
    endTime: '',
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    dispatch(fetchAllSpecialists());
  }, [dispatch]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this specialist?')) {
      try {
        await toast.promise(
          dispatch(deleteSpecialist(id)).unwrap(),
          {
            loading: 'Deleting...',
            success: 'Specialist removed',
            error: 'Failed to delete specialist'
          }
        );
        dispatch(fetchAllSpecialists());
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleAddCertificate = (e) => {
    e.preventDefault();
    if (!form.certificateInput.trim()) return;
    setForm({
      ...form,
      certifications: [...form.certifications, form.certificateInput.trim()],
      certificateInput: '',
    });
  };

  const handleRemoveCertificate = (index, e) => {
    e.preventDefault();
    const updated = [...form.certifications];
    updated.splice(index, 1);
    setForm({ ...form, certifications: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.email || form.expertise.length === 0) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!form.startTime || !form.endTime || form.availabilityDays.length === 0) {
      toast.error('Please select days and time');
      return;
    }

    const availability = form.availabilityDays.map(day => ({
      day,
      start: form.startTime,
      end: form.endTime,
    }));

    const newSpecialist = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      expertise: form.expertise,
      experienceYears: Number(form.experienceYears) || 0,
      image: form.image || '',
      certifications: form.certifications,
      availability,
    };

    try {
      await toast.promise(
        dispatch(createSpecialist(newSpecialist)).unwrap(),
        {
          loading: 'Adding Specialist...',
          success: 'Specialist added successfully.',
          error: 'Failed to add specialist'
        }
      );
      setShowAddModal(false);
      setForm(emptyForm);
      dispatch(fetchAllSpecialists());
    } catch (err) {
      console.error(err);
    }
  };

  // ── Availability Row ──────────────────────────────────────────────────────
  const renderAvailabilityDay = (day, idx) => (
    <div
      key={idx}
      className={`flex justify-between items-center py-2.5 ${idx !== 0 ? 'border-t border-gray-100' : ''}`}
    >
      <span className="text-[13px] font-semibold text-gray-700 w-24 px-1">
        {day.day}
      </span>
      <span className="text-[12px] font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
        {day.start} – {day.end}
      </span>
    </div>
  );

  // ── Specialist Card ───────────────────────────────────────────────────────
  const renderSpecialistCard = (specialist) => (
    <div
      key={specialist._id}
      className="bg-white rounded-3xl p-5 mb-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-gray-100/50 relative overflow-hidden"
    >
      {/* Card Header */}
      <div className="flex mb-5">
        <img
          src={specialist.image && specialist.image.trim() !== '' ? specialist.image : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}
          className="w-[84px] h-[84px] rounded-full bg-gray-50 object-cover"
          style={{ borderWidth: 2.5, borderColor: '#A3DBE3' }}
          alt="Avatar"
        />

        <div className="flex-1 ml-4 pt-1 flex flex-col justify-start">
          <h3 className="text-[17px] font-bold text-gray-900 leading-tight mb-0.5">
            {specialist.user?.name || 'Unnamed Specialist'}
          </h3>
          <p className="text-[13px] font-medium text-[#156778] mb-0.5">
            {specialist.user?.phone || 'N/A'}
          </p>
          <p className="text-[12px] font-medium" style={{ color: '#2dd4bf' }}>
            {specialist.expertise?.join(' · ') || 'No expertise'}
          </p>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Briefcase size={12} color="#6b7280" />
            <span className="text-[12px] text-gray-500 font-medium">
              {specialist.experienceYears || 0} yrs exp
            </span>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="mb-5">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
          Certifications
        </p>

        {(!specialist.certifications || specialist.certifications.length === 0) ? (
          <p className="text-xs text-gray-300">None on file</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {specialist.certifications.map((cert, idx) => (
              <div
                key={idx}
                className="flex items-center bg-[#f0fdfa] border border-[#ccfbf1] px-2.5 py-1.5 rounded-full gap-1.5 shadow-sm"
              >
                <div className="bg-[#156778] rounded-full flex items-center justify-center p-[2px]">
                  <CheckCircle2 size={10} color="#ffffff" fill="#156778" />
                </div>
                <span className="text-[11px] font-bold text-[#156778]">
                  {cert}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Availability Toggle */}
      <button
        className="w-full flex justify-between items-center py-3.5 border-t border-b border-gray-100 my-2"
        onClick={() => toggleExpand(specialist._id)}
      >
        <span className="text-[13px] font-bold text-[#156778]">
          {expandedId === specialist._id ? 'Hide' : 'Show'} Availability
        </span>
        <div className="flex items-center gap-1">
          <span className="text-[12px] font-medium text-gray-400 mr-1">
            {specialist.availability?.length || 0} days
          </span>
          {expandedId === specialist._id ? (
            <ChevronUp size={16} color="#156778" />
          ) : (
            <ChevronDown size={16} color="#156778" />
          )}
        </div>
      </button>

      {/* Availability Expanded */}
      {expandedId === specialist._id && (
        <div className="bg-gray-50/80 rounded-2xl p-4 mb-4 border border-gray-100/60 mt-2">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 pl-1">
            Weekly Schedule
          </p>
          {(!specialist.availability || specialist.availability.length === 0) ? (
            <p className="text-xs text-gray-300">No schedule set</p>
          ) : (
            <div className="flex flex-col">
              {specialist.availability.map((day, idx) => renderAvailabilityDay(day, idx))}
            </div>
          )}
        </div>
      )}

      {/* Remove Button */}
      <button
        className="w-full flex justify-center items-center bg-[#f43f5e] hover:bg-rose-600 active:bg-rose-700 py-3.5 rounded-2xl gap-2 mt-3 shadow-sm transition-colors"
        onClick={() => handleDelete(specialist._id)}
      >
        <Trash2 size={16} color="#ffffff" />
        <span className="text-[14px] font-bold text-white tracking-wide">
          Remove Specialist
        </span>
      </button>
    </div>
  );

  // ── Screen ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#fff1f2] pb-24 relative font-sans">
      {/* Header */}
      <div className="bg-[#f43f5e] px-5 pt-7 pb-6 relative shadow-sm z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="bg-transparent border-none p-0 cursor-pointer">
              <ChevronLeft size={26} color="#ffffff" />
            </button>
            <div>
              <h1 className="text-[26px] font-bold text-white leading-tight mb-0.5">Specialists</h1>
              <p className="text-[13px] font-medium text-rose-100/90 tracking-wide">
                {specialists.length} team members
              </p>
            </div>
          </div>

          {!error && !loading && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center bg-white/20 border border-white/30 rounded-full px-4 py-[7px] gap-1.5 active:bg-white/30 transition-colors shadow-sm"
            >
              <div className="bg-white/90 rounded-full flex items-center justify-center p-[1px]">
                <Plus size={14} color="#f43f5e" strokeWidth={3} />
              </div>
              <span className="text-white font-bold text-[14px]">Add</span>
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 pt-5">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#f43f5e]"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center py-20">
            <span className="text-[#ef4444] text-center text-sm font-medium">{error}</span>
          </div>
        ) : specialists.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-24 bg-white/50 rounded-3xl mx-2 border border-white">
            <div className="bg-rose-100/50 p-4 rounded-full mb-3">
              <UserPlus size={40} className="text-rose-300" />
            </div>
            <p className="text-gray-500 font-medium text-base">No specialists yet</p>
            <p className="text-gray-400 text-xs mt-1 text-center max-w-[200px]">Tap 'Add' to onboard your first team member.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {specialists.map((specialist) => (
              <div key={specialist._id}>{renderSpecialistCard(specialist)}</div>
            ))}
          </div>
        )}
      </div>

      {/* Add Specialist Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/50 px-4 backdrop-blur-sm">
          <div
            className="bg-[#fff1f2] rounded-3xl p-5 w-full max-h-[88vh] flex flex-col shadow-2xl relative animate-in fade-in zoom-in duration-200"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5 pb-2 border-b border-rose-100/50">
              <h2 className="text-[19px] font-bold text-[#156778]">Add Specialist</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-full hover:bg-rose-50 active:bg-rose-100 transition-colors">
                <X size={22} className="text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-2 px-1">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <div
                      className="w-[100px] h-[100px] rounded-full border-[2px] border-[#156778] bg-white flex justify-center items-center overflow-hidden shadow-sm"
                    >
                      {form.image ? (
                        <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center mt-1">
                          <Camera size={26} color="#156778" className="mb-1" />
                          <span className="text-[#156778] text-[10px] font-bold uppercase tracking-wider">Photo</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full mt-4">
                     <input
                      placeholder="Paste Image URL here..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[13px] bg-white text-gray-700 shadow-sm focus:border-[#156778] focus:ring-1 focus:ring-[#156778] outline-none transition-all"
                      value={form.image}
                      onChange={(e) => handleChange('image', e.target.value)}
                    />
                  </div>
                </div>

                {/* Info Inputs */}
                <div className="space-y-3">
                  <input
                    placeholder="Full Name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] bg-white placeholder-gray-400 font-medium text-gray-800 shadow-sm focus:border-[#156778] focus:ring-1 focus:ring-[#156778] outline-none transition-all"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                  />
                  <input
                    placeholder="Phone Number"
                    type="tel"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] bg-white placeholder-gray-400 font-medium text-gray-800 shadow-sm focus:border-[#156778] focus:ring-1 focus:ring-[#156778] outline-none transition-all"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    required
                  />
                  <input
                    placeholder="Email Address"
                    type="email"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] bg-white placeholder-gray-400 font-medium text-gray-800 shadow-sm focus:border-[#156778] focus:ring-1 focus:ring-[#156778] outline-none transition-all"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                  />
                </div>

                <div className="h-px bg-rose-100/60 my-5 w-full"></div>

                {/* Expertise */}
                <ExpertisePicker
                  selectedExpertise={form.expertise}
                  onSelect={(v) => handleChange('expertise', v)}
                />

                {/* Experience */}
                <div className="mb-4">
                   <label className="block text-xs font-bold text-[#156778] mb-2 uppercase tracking-wide">Experience</label>
                  <input
                    placeholder="Years of Experience"
                    type="number"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[14px] bg-white placeholder-gray-400 font-medium text-gray-800 shadow-sm focus:border-[#156778] focus:ring-1 focus:ring-[#156778] outline-none transition-all"
                    value={form.experienceYears}
                    onChange={(e) => handleChange('experienceYears', e.target.value)}
                  />
                </div>

                {/* Certifications */}
                <div className="mb-5">
                  <label className="block text-xs font-bold text-[#156778] mb-2 uppercase tracking-wide">Certifications</label>
                  <div className="flex items-center gap-2">
                    <input
                      placeholder="Enter certificate name"
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-[14px] bg-white placeholder-gray-400 font-medium text-gray-800 shadow-sm focus:border-[#156778] focus:ring-1 focus:ring-[#156778] outline-none transition-all"
                      value={form.certificateInput}
                      onChange={(e) => handleChange('certificateInput', e.target.value)}
                    />
                    <button onClick={handleAddCertificate} className="p-1 active:scale-95 transition-transform" type="button">
                       <div className="bg-[#156778] rounded-full p-2.5 shadow-md">
                          <Plus size={18} color="#ffffff" strokeWidth={3} />
                       </div>
                    </button>
                  </div>
                  {/* Added Certifications */}
                  <div className="mt-3 space-y-2">
                    {form.certifications.map((cert, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm"
                      >
                        <span className="text-[#156778] text-[13px] font-bold">{cert}</span>
                        <button onClick={(e) => handleRemoveCertificate(idx, e)} className="p-1 -mr-1" type="button">
                          <div className="bg-rose-50 rounded-full p-1 border border-rose-100">
                             <X size={14} className="text-rose-500" strokeWidth={2.5} />
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="h-px bg-rose-100/60 my-5 w-full"></div>

                <h3 className="text-[15px] font-bold text-[#156778] mb-3">Availability</h3>

                {/* Available Days */}
                <DayPicker
                  selectedDays={form.availabilityDays}
                  onSelect={(v) => handleChange('availabilityDays', v)}
                />

                {/* Time */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <TimePicker
                    label="Start Time"
                    value={form.startTime}
                    onSelect={(v) => handleChange('startTime', v)}
                  />
                  <TimePicker
                    label="End Time"
                    value={form.endTime}
                    onSelect={(v) => handleChange('endTime', v)}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#156778] py-4 rounded-xl flex justify-center items-center mt-6 mb-2 shadow-lg shadow-teal-900/10 active:scale-[0.98] transition-all"
                >
                  <span className="text-white font-bold text-[15px] tracking-wide">Add Specialist</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
