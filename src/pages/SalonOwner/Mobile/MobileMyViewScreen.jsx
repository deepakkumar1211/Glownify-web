import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    ChevronLeft,
    CheckCircle2,
    Edit2,
    Bell,
    Share2,
    Image as ImageIcon,
    Camera,
    Rocket,
    PlusCircle,
    MapPin,
    Pencil,
    Star,
    Home,
    Phone,
    MessageCircle,
    Mail,
    Globe,
    Instagram,
    ChevronUp,
    ChevronDown,
    List,
    Layers,
    Gift,
    Navigation,
    XCircle,
    Clock,
    CreditCard,
    Smile,
    Store,
    MessageSquare,
    X,
    Snowflake,
    Car,
    Wifi,
    Dog,
    Coffee,
    Accessibility,
    Scissors,
    Users,
    Calendar,
    ChevronRight,
    CheckCircle
} from 'lucide-react';
import MobileBottomNav from './MobileBottomNav';

// ─── MOCK / FALLBACK DATA ─────────────────────────────────────────────────────
const MOCK_IMAGES = [
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
    'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800',
];

const MOCK_SERVICES = [
    { id: '1', name: 'Women Haircut', price: 550, durationMins: 60, description: 'Precision cut with modern finishing.', discountPercent: 20 },
    { id: '2', name: 'Balayage Color', price: 2500, durationMins: 120, description: 'Hand-painted sun-kissed highlights.', discountPercent: 0 },
    { id: '3', name: 'Deep Facial', price: 1200, durationMins: 60, description: 'Deep cleansing & moisturizing facial.', discountPercent: 15 },
    { id: '4', name: 'Bridal Makeup', price: 5000, durationMins: 150, description: 'Full bridal look by expert artists.', discountPercent: 0 },
];

const MOCK_SPECIALISTS = [
    { _id: 'sp1', name: 'Riya Sharma', role: 'Hair Specialist', image: 'https://randomuser.me/api/portraits/women/44.jpg', rating: 4.9 },
    { _id: 'sp2', name: 'Kavya Nair', role: 'Skin & Makeup', image: 'https://randomuser.me/api/portraits/women/68.jpg', rating: 4.8 },
    { _id: 'sp3', name: 'Rohan Mehta', role: 'Beard & Grooming', image: 'https://randomuser.me/api/portraits/men/32.jpg', rating: 4.7 },
];

const MOCK_REVIEWS = [
    { id: 'r1', userName: 'Jennie Whang', rating: 4, date: '2 days ago', comment: 'The place was clean, great service, staff are friendly. Will certainly recommend!', ownerReply: null },
    { id: 'r2', userName: 'Nathalie K.', rating: 5, date: '1 week ago', comment: 'Very nice service from the specialist. I always come here for my treatment.', ownerReply: 'Thank you Nathalie! We look forward to seeing you again 💛' },
    { id: 'r3', userName: 'Julia Martha', rating: 4, date: '2 weeks ago', comment: "This is my favourite place to treat my hair :)", ownerReply: null },
];

const DEFAULT_HOURS = [
    { day: 'Monday', start: '09:00 AM', end: '09:00 PM' },
    { day: 'Tuesday', start: '09:00 AM', end: '09:00 PM' },
    { day: 'Wednesday', start: '09:00 AM', end: '09:00 PM' },
    { day: 'Thursday', start: '09:00 AM', end: '09:00 PM' },
    { day: 'Friday', start: '09:00 AM', end: '09:00 PM' },
    { day: 'Saturday', start: '10:00 AM', end: '07:00 PM' },
    { day: 'Sunday', start: null, end: null },
];

const AMENITIES_LIST = [
    { key: 'ac', label: 'AC', icon: Snowflake },
    { key: 'parking', label: 'Parking', icon: Car },
    { key: 'wifi', label: 'WiFi', icon: Wifi },
    { key: 'card', label: 'Card Payment', icon: CreditCard },
    { key: 'pets', label: 'Pet Friendly', icon: Dog },
    { key: 'waiting', label: 'Waiting Area', icon: Coffee },
    { key: 'kids', label: 'Kids Area', icon: Smile },
    { key: 'accessible', label: 'Accessible', icon: Accessibility },
];

const QUICK_ACTIONS = [
    { icon: Scissors, label: 'Services', color: '#f43f5e', bg: '#fff1f2', nav: '/salon-owner/manage-services' },
    { icon: Users, label: 'Staff', color: '#f97316', bg: '#fff7ed', nav: '/salon-owner/manage-specialists' },
    { icon: List, label: 'Categories', color: '#8b5cf6', bg: '#f5f3ff', nav: '/salon-owner/manage-categories-mobile' },
    { icon: Layers, label: 'Add-ons', color: '#10b981', bg: '#ecfdf5', nav: '/salon-owner/manage-add-ons' },
    { icon: Gift, label: 'Combos', color: '#3b82f6', bg: '#eff6ff', nav: '/salon-owner/combo-packages' },
    { icon: Calendar, label: 'Bookings', color: '#ec4899', bg: '#fdf2f8', nav: '/salon-owner/bookings' },
];

// ─── PROFILE COMPLETION ───────────────────────────────────────────────────────
const getProfileCompletion = ({ shopName, about, contact, amenities, services, specialists }) => {
    const checks = [
        { label: 'Salon name', done: !!shopName },
        { label: 'About section', done: about?.length > 20 },
        { label: 'Contact info', done: !!contact?.phone },
        { label: 'Amenities', done: Object.values(amenities || {}).some(Boolean) },
        { label: 'Services added', done: services?.length > 0 },
        { label: 'Staff added', done: specialists?.length > 0 },
        { label: 'Gallery photos', done: true }, // mock true
    ];
    const done = checks.filter(c => c.done).length;
    return { pct: Math.round((done / checks.length) * 100), checks };
};

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

const StarRow = ({ rating, size = 13 }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} size={size} color={i <= rating ? '#f59e0b' : '#d1d5db'} fill={i <= rating ? '#f59e0b' : 'transparent'} />
        ))}
    </div>
);

// Edit-mode inline text field
const EditableText = ({ value, onChange, multiline, placeholder, done, style }) => (
    <div className="flex items-start gap-2">
        {multiline ? (
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                autoFocus
                placeholder={placeholder}
                className="flex-1 text-sm text-gray-700 border border-pink-200 rounded-lg p-3 bg-pink-50 focus:outline-none min-h-[80px] resize-none"
                style={style}
            />
        ) : (
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                autoFocus
                placeholder={placeholder}
                className="flex-1 text-sm text-gray-700 border border-pink-200 rounded-lg p-3 bg-pink-50 focus:outline-none"
                style={style}
            />
        )}
        <button onClick={done} className="mt-1 p-1 bg-transparent border-none cursor-pointer">
            <CheckCircle2 size={28} color="#10b981" />
        </button>
    </div>
);

// Section wrapper card
const SCard = ({ children, className = '' }) => (
    <div className={`bg-white mx-4 mt-3 rounded-3xl p-4 shadow-sm border border-gray-100 ${className}`}>
        {children}
    </div>
);

// Section header with optional edit / view-all buttons
const SHeader = ({ title, subtitle, onEdit, onViewAll, editMode }) => (
    <div className="mb-3">
        <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800 m-0">{title}</h2>
            <div className="flex gap-2">
                {editMode && onEdit && (
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-1 bg-pink-50 rounded-full px-3 py-1 border-none cursor-pointer"
                    >
                        <Pencil size={12} color="#f43f5e" />
                        <span className="text-xs font-bold text-pink-500">Edit</span>
                    </button>
                )}
                {onViewAll && (
                    <button onClick={onViewAll} className="flex items-center gap-1 bg-transparent border-none cursor-pointer p-0">
                        <span className="text-xs font-bold text-pink-500">View all</span>
                        <ChevronRight size={13} color="#f43f5e" />
                    </button>
                )}
            </div>
        </div>
        {subtitle ? <p className="text-xs text-gray-400 mt-1 mb-0">{subtitle}</p> : null}
    </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function MobileMyViewScreen() {
    const navigate = useNavigate();
    // const userDetails = useSelector(state => state.auth.user);
    // const salonData   = useSelector(state => state.user.salonDetails);

    const specialists = MOCK_SPECIALISTS;
    const openingHours = DEFAULT_HOURS;
    const rating = '4.7';
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayHours = openingHours.find(h => h.day === today);

    // ── Core UI state ──────────────────────────────────────────────────────────
    const [editMode, setEditMode] = useState(false);
    const [currentImg, setCurrentImg] = useState(0);
    const [showHours, setShowHours] = useState(false);
    const [isOpen, setIsOpen] = useState(true);

    // ── Editable fields ────────────────────────────────────────────────────────
    const [shopName, setShopName] = useState('Glamour Salon');
    const [tagline, setTagline] = useState('Premium Hair & Beauty Studio');
    const [about, setAbout] = useState('We specialize in professional beauty & grooming. Our skilled team ensures you leave looking and feeling your absolute best.');
    const [contact, setContact] = useState({ phone: '+91 98765 43210', whatsapp: '+91 98765 43210', email: 'hello@glamoursalon.in', website: 'www.glamoursalon.in', instagram: '@glamoursalon' });
    const [location, setLocation] = useState({ address: '42, Rose Garden Road', city: 'Mumbai', landmark: 'Near Inorbit Mall', parking: 'Street parking available' });
    const [homeService, setHomeService] = useState({ enabled: true, radius: '10', extraCharge: '100' });
    const [amenities, setAmenities] = useState({ ac: true, parking: true, wifi: true, card: true, pets: false, waiting: true, kids: false, accessible: false });
    const [policies, setPolicies] = useState({ cancellation: 'Free cancellation up to 2 hours before appointment.', late: 'A grace period of 10 minutes is allowed.', payment: 'Cash, card, and UPI accepted.', children: 'Children under 5 are welcome with a guardian.' });
    const [reviews, setReviews] = useState(MOCK_REVIEWS);

    // ── Inline editing toggles ─────────────────────────────────────────────────
    const [editingSection, setEditingSection] = useState(null); // 'name'|'about'|'contact'|'location'|'home'|'hours'|'policies'

    const stopEditing = () => setEditingSection(null);

    // Profile completion
    const completion = getProfileCompletion({ shopName, about, contact, amenities, services: MOCK_SERVICES, specialists });

    // ─── Review reply ────────────────────────────────────────────────────────
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyDraft, setReplyDraft] = useState('');

    const submitReply = (id) => {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, ownerReply: replyDraft } : r));
        setReplyingTo(null);
        setReplyDraft('');
    };

    return (
        <div className="flex flex-col min-h-screen bg-pink-50 pb-20 font-sans">
            {/* ── Floating Header ── */}
            <div className="fixed top-2 left-0 right-0 z-20 flex justify-between items-center px-4">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md border-none cursor-pointer"
                >
                    <ChevronLeft size={22} color="#1f2937" />
                </button>

                <div className="flex gap-2 items-center">
                    {/* Edit Mode Toggle — primary CTA */}
                    <button
                        onClick={() => { setEditMode(v => !v); setEditingSection(null); }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-full shadow-md border-none cursor-pointer transition-colors ${editMode ? 'bg-green-500' : 'bg-white'}`}
                    >
                        {editMode ? <CheckCircle size={15} color="#fff" /> : <Edit2 size={15} color="#f43f5e" />}
                        <span className={`text-xs font-bold ${editMode ? 'text-white' : 'text-pink-500'}`}>
                            {editMode ? 'Done Editing' : 'Edit Profile'}
                        </span>
                    </button>

                    <button
                        onClick={() => navigate('/salon-owner/notifications')}
                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md border-none cursor-pointer"
                    >
                        <Bell size={18} color="#2d3a5a" />
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md border-none cursor-pointer">
                        <Share2 size={18} color="#2d3a5a" />
                    </button>
                </div>
            </div>

            <div className="overflow-y-auto pb-16">
                {/* ══ Hero Gallery ═════════════════════════════════════════════════════ */}
                <div className="relative h-72 bg-gray-900 w-full overflow-hidden">
                    <div
                        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full"
                        onScroll={(e) => setCurrentImg(Math.round(e.target.scrollLeft / e.target.clientWidth))}
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {MOCK_IMAGES.map((img, i) => (
                            <img key={i} src={img} className="w-full h-full object-cover flex-shrink-0 snap-center" alt="Salon gallery" />
                        ))}
                    </div>

                    {/* Dark gradient overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                    {/* Photo count */}
                    <div className="absolute top-16 right-4 flex items-center gap-1 bg-black/50 rounded-xl px-2 py-1">
                        <ImageIcon size={11} color="#fff" />
                        <span className="text-white text-xs font-semibold">{currentImg + 1} / {MOCK_IMAGES.length}</span>
                    </div>

                    {/* Edit photos button — only in edit mode */}
                    {editMode && (
                        <button className="absolute bottom-12 right-4 flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-full border-none cursor-pointer">
                            <Camera size={14} color="#fff" />
                            <span className="text-white text-xs font-semibold">Edit Photos</span>
                        </button>
                    )}

                    {/* Pill indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {MOCK_IMAGES.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentImg ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* ══ Profile Completion Banner ════════════════════════════════════════ */}
                {completion.pct < 100 && (
                    <div className="mx-4 mt-3 bg-white rounded-2xl p-3 shadow-sm border border-pink-100 relative z-10 -mt-6">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                                <Rocket size={16} color="#f43f5e" />
                                <span className="text-sm font-bold text-gray-800">Profile {completion.pct}% complete</span>
                            </div>
                            <span className="text-xs text-pink-500 font-bold">{completion.pct}%</span>
                        </div>
                        {/* Progress bar */}
                        <div className="h-1.5 bg-pink-100 rounded-full overflow-hidden mb-2">
                            <div style={{ width: `${completion.pct}%` }} className="h-full bg-pink-500 rounded-full transition-all duration-500" />
                        </div>
                        {/* Missing items */}
                        <div className="flex flex-wrap gap-1.5">
                            {completion.checks.filter(c => !c.done).slice(0, 3).map(c => (
                                <div key={c.label} className="flex items-center gap-1 bg-pink-50 border border-pink-100 px-2 py-0.5 rounded-full">
                                    <PlusCircle size={11} color="#f43f5e" />
                                    <span className="text-xs text-pink-500 font-semibold">{c.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ══ Shop Identity Card ═══════════════════════════════════════════════ */}
                <div className={`bg-white mx-4 rounded-3xl p-4 shadow-sm border border-gray-100 relative z-10 ${completion.pct < 100 ? 'mt-3' : '-mt-6'}`}>
                    {/* Name + tagline */}
                    {editMode && editingSection === 'name' ? (
                        <div className="mb-3 flex flex-col gap-2">
                            <EditableText value={shopName} onChange={setShopName} placeholder="Salon name" done={stopEditing} />
                            <input
                                value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Tagline"
                                className="text-xs text-gray-500 border border-pink-100 rounded-lg px-3 py-2 bg-pink-50 focus:outline-none"
                            />
                        </div>
                    ) : (
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 mr-3">
                                <h1 className="text-xl font-bold text-gray-900 m-0 leading-tight">{shopName}</h1>
                                <p className="text-xs text-gray-400 mt-1 mb-0">{tagline}</p>
                            </div>
                            {editMode && (
                                <button onClick={() => setEditingSection('name')} className="bg-pink-50 rounded-xl p-2 border-none cursor-pointer">
                                    <Pencil size={14} color="#f43f5e" />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Location row */}
                    <div className="flex items-center gap-1 mb-3">
                        <MapPin size={13} color="#9ca3af" />
                        <p className="text-xs text-gray-500 flex-1 truncate m-0">
                            {location.address}{location.city ? `, ${location.city}` : ''}
                            {location.landmark ? ` · ${location.landmark}` : ''}
                        </p>
                        {editMode && (
                            <button onClick={() => setEditingSection('location')} className="ml-1 bg-transparent border-none cursor-pointer p-0">
                                <Pencil size={12} color="#f43f5e" />
                            </button>
                        )}
                    </div>

                    {/* Status pills */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        <div className="flex items-center gap-1 bg-yellow-50 rounded-full px-2 py-1">
                            <Star size={12} color="#f59e0b" fill="#f59e0b" />
                            <span className="text-xs font-bold text-yellow-800">{rating}</span>
                            <span className="text-xs text-yellow-600">({MOCK_REVIEWS.length} reviews)</span>
                        </div>

                        <button
                            onClick={() => editMode && setIsOpen(v => !v)}
                            className={`flex items-center gap-1 rounded-full px-2 py-1 border-none ${isOpen ? 'bg-emerald-50' : 'bg-red-50'} ${editMode ? 'cursor-pointer' : ''}`}
                        >
                            <div className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className={`text-xs font-bold ${isOpen ? 'text-green-600' : 'text-red-500'}`}>
                                {isOpen ? 'Open Now' : 'Closed'}
                                {editMode && ' (tap)'}
                            </span>
                        </button>

                        <div className={`flex items-center gap-1 rounded-full px-2 py-1 ${homeService.enabled ? 'bg-purple-50' : 'bg-gray-100'}`}>
                            <Home size={11} color={homeService.enabled ? '#7c3aed' : '#9ca3af'} />
                            <span className={`text-xs font-semibold tracking-wide ${homeService.enabled ? 'text-purple-700' : 'text-gray-400'}`}>
                                Home Service
                            </span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gray-100 mb-3" />

                    {/* Stats strip */}
                    <div className="flex justify-around mb-2">
                        {[
                            { icon: Calendar, value: '1.2K', label: 'Bookings', color: '#f43f5e' },
                            { icon: Users, value: '863', label: 'Customers', color: '#3b82f6' },
                            { icon: Navigation, value: '18 km', label: 'Distance', color: '#10b981' },
                            { icon: Star, value: rating, label: 'Rating', color: '#f59e0b' },
                        ].map((s, i, arr) => (
                            <React.Fragment key={s.label}>
                                <div className="flex flex-col items-center flex-1">
                                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-1" style={{ backgroundColor: s.color + '18' }}>
                                        <s.icon size={17} color={s.color} />
                                    </div>
                                    <span className="text-sm font-bold text-gray-800">{s.value}</span>
                                    <span className="text-xs text-gray-400 mt-0.5">{s.label}</span>
                                </div>
                                {i < arr.length - 1 && <div className="w-px h-9 bg-gray-100 self-center" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* ══ Quick Actions ════════════════════════════════════════════════════ */}
                <SCard>
                    <SHeader title="Quick Actions" subtitle="Manage your salon" />
                    <div className="grid grid-cols-3 gap-2">
                        {QUICK_ACTIONS.map(action => (
                            <button
                                key={action.label}
                                onClick={() => navigate(action.nav)}
                                className="rounded-2xl py-3 flex flex-col items-center gap-1.5 border-none cursor-pointer"
                                style={{ backgroundColor: action.bg }}
                            >
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: action.color + '22' }}>
                                    <action.icon size={20} color={action.color} />
                                </div>
                                <span className="text-xs font-bold text-gray-700 text-center">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </SCard>

                {/* ══ About ════════════════════════════════════════════════════════════ */}
                <SCard>
                    <SHeader title="About" onEdit={() => setEditingSection('about')} editMode={editMode} />
                    {editMode && editingSection === 'about' ? (
                        <EditableText value={about} onChange={setAbout} multiline placeholder="Describe your salon..." done={stopEditing} />
                    ) : (
                        <p className="text-sm text-gray-600 leading-relaxed m-0">{about}</p>
                    )}
                </SCard>

                {/* ══ Contact Info ═════════════════════════════════════════════════════ */}
                <SCard>
                    <SHeader title="Contact Info" onEdit={() => setEditingSection('contact')} editMode={editMode} />

                    {editMode && editingSection === 'contact' ? (
                        <div className="flex flex-col gap-2">
                            {[
                                { key: 'phone', label: 'Phone', icon: Phone, type: 'tel' },
                                { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, type: 'tel' },
                                { key: 'email', label: 'Email', icon: Mail, type: 'email' },
                                { key: 'website', label: 'Website', icon: Globe, type: 'url' },
                                { key: 'instagram', label: 'Instagram', icon: Instagram, type: 'text' },
                            ].map(f => (
                                <div key={f.key} className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
                                    <f.icon size={16} color="#156778" />
                                    <input
                                        type={f.type}
                                        value={contact[f.key]}
                                        onChange={(e) => setContact(prev => ({ ...prev, [f.key]: e.target.value }))}
                                        placeholder={f.label}
                                        className="flex-1 text-sm text-gray-800 bg-transparent border-none focus:outline-none w-full"
                                    />
                                </div>
                            ))}
                            <button onClick={stopEditing} className="bg-green-500 rounded-lg py-2 items-center mt-2 border-none text-white font-bold text-sm cursor-pointer">
                                Save Contact Info
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {[
                                { key: 'phone', icon: Phone, color: '#10b981' },
                                { key: 'whatsapp', icon: MessageCircle, color: '#25D366' },
                                { key: 'email', icon: Mail, color: '#3b82f6' },
                                { key: 'website', icon: Globe, color: '#6b7280' },
                                { key: 'instagram', icon: Instagram, color: '#e1306c' },
                            ].filter(f => contact[f.key]).map(f => (
                                <div key={f.key} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: f.color + '18' }}>
                                        <f.icon size={15} color={f.color} />
                                    </div>
                                    <span className="text-sm text-gray-700 font-medium truncate">{contact[f.key]}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </SCard>

                {/* ══ Location ═════════════════════════════════════════════════════════ */}
                {editMode && editingSection === 'location' && (
                    <SCard>
                        <SHeader title="Edit Location" />
                        <div className="flex flex-col gap-2">
                            {[
                                { key: 'address', placeholder: 'Street address' },
                                { key: 'city', placeholder: 'City' },
                                { key: 'landmark', placeholder: 'Landmark' },
                                { key: 'parking', placeholder: 'Parking info' },
                            ].map(f => (
                                <input
                                    key={f.key}
                                    value={location[f.key]}
                                    onChange={(e) => setLocation(prev => ({ ...prev, [f.key]: e.target.value }))}
                                    placeholder={f.placeholder}
                                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-gray-50 focus:outline-none"
                                />
                            ))}
                            <button onClick={stopEditing} className="bg-green-500 rounded-lg py-2 items-center border-none text-white font-bold text-sm cursor-pointer mt-1">
                                Save Location
                            </button>
                        </div>
                    </SCard>
                )}

                {/* ══ Opening Hours ════════════════════════════════════════════════════ */}
                <SCard>
                    <button
                        onClick={() => setShowHours(v => !v)}
                        className="w-full flex justify-between items-center bg-transparent border-none p-0 cursor-pointer text-left"
                    >
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 m-0">Opening Hours</h2>
                            {todayHours && (
                                <p className="text-xs text-gray-400 mt-1 mb-0">
                                    Today: {todayHours.start && todayHours.end ? `${todayHours.start} – ${todayHours.end}` : 'Closed'}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className={`rounded-full px-2 py-1 ${isOpen ? 'bg-emerald-50' : 'bg-red-50'}`}>
                                <span className={`text-xs font-bold ${isOpen ? 'text-green-600' : 'text-red-500'}`}>
                                    {isOpen ? 'Open' : 'Closed'}
                                </span>
                            </div>
                            {editMode && (
                                <div
                                    onClick={(e) => { e.stopPropagation(); setEditingSection('hours'); }}
                                    className="bg-pink-50 rounded-xl p-1.5 cursor-pointer ml-1"
                                >
                                    <Pencil size={12} color="#f43f5e" />
                                </div>
                            )}
                            {showHours ? <ChevronUp size={18} color="#9ca3af" /> : <ChevronDown size={18} color="#9ca3af" />}
                        </div>
                    </button>

                    {showHours && (
                        <div className="mt-4">
                            {openingHours.map((hour, i, arr) => {
                                const isToday = hour.day === today;
                                return (
                                    <div
                                        key={hour.day}
                                        className={`flex justify-between items-center py-2.5 ${isToday ? 'bg-pink-50 rounded-lg px-3 mb-1' : ''} ${!isToday && i < arr.length - 1 ? 'border-b border-gray-100' : ''}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {isToday && <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />}
                                            <span className={`text-sm ${isToday ? 'font-bold text-pink-500' : 'font-medium text-gray-700'}`}>
                                                {hour.day}
                                            </span>
                                        </div>
                                        {hour.start && hour.end ? (
                                            <span className={`text-sm font-semibold ${isToday ? 'text-pink-500' : 'text-green-600'}`}>
                                                {hour.start} – {hour.end}
                                            </span>
                                        ) : (
                                            <div className="bg-red-50 rounded-md px-2 py-0.5">
                                                <span className="text-xs font-bold text-red-500">Closed</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </SCard>

                {/* ══ Services ═════════════════════════════════════════════════════════ */}
                <SCard>
                    <SHeader
                        title="Our Services"
                        subtitle={`${MOCK_SERVICES.length} services available`}
                        onEdit={() => navigate('/salon-owner/manage-services')} // Add edit action here if appropriate
                        onViewAll={() => navigate('/salon-owner/manage-services')}
                        editMode={editMode}
                    />
                    <div className="flex flex-col gap-3">
                        {MOCK_SERVICES.map(service => (
                            <div key={service.id} className="flex items-center justify-between bg-gray-50 rounded-2xl p-3 border border-gray-100">
                                <div className="flex-1 mr-3">
                                    <span className="text-sm font-bold text-gray-800">{service.name}</span>
                                    <p className="text-xs text-gray-500 mt-1 mb-0 truncate">{service.description}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                        <span className="text-xs text-gray-400">⏱ {service.durationMins} min</span>
                                        {service.discountPercent > 0 && (
                                            <div className="bg-green-100 px-1.5 py-0.5 rounded flex items-center">
                                                <span className="text-xs font-bold text-green-700">{service.discountPercent}% off</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <span className="text-base font-bold text-pink-500 shrink-0">₹{service.price}</span>
                            </div>
                        ))}
                    </div>

                    {/* ── Service Management Shortcuts ── */}
                    {editMode && (
                        <div className="flex gap-2 mt-3">
                            {[
                                { label: 'Categories', icon: List, nav: '/salon-owner/manage-categories-mobile', color: '#8b5cf6', bg: '#f5f3ff' },
                                { label: 'Add-ons', icon: Layers, nav: '/salon-owner/manage-add-ons', color: '#10b981', bg: '#ecfdf5' },
                                { label: 'Combos', icon: Gift, nav: '/salon-owner/combo-packages', color: '#3b82f6', bg: '#eff6ff' },
                            ].map(s => (
                                <button
                                    key={s.label}
                                    onClick={() => navigate(s.nav)}
                                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border cursor-pointer"
                                    style={{ backgroundColor: s.bg, borderColor: s.color + '40' }}
                                >
                                    <s.icon size={13} color={s.color} />
                                    <span className="text-xs font-bold" style={{ color: s.color }}>{s.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </SCard>

                {/* ══ Amenities ════════════════════════════════════════════════════════ */}
                <SCard>
                    <SHeader title="Amenities" onEdit={() => setEditingSection('amenities')} editMode={editMode} />

                    {editMode && editingSection === 'amenities' ? (
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap gap-2">
                                {AMENITIES_LIST.map(a => {
                                    const on = amenities[a.key];
                                    return (
                                        <button
                                            key={a.key}
                                            onClick={() => setAmenities(prev => ({ ...prev, [a.key]: !prev[a.key] }))}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${on ? 'bg-teal-600 border-teal-600' : 'bg-white border-gray-200'}`}
                                        >
                                            <a.icon size={13} color={on ? '#fff' : '#6b7280'} />
                                            <span className={`text-xs font-semibold ${on ? 'text-white' : 'text-gray-600'}`}>{a.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <button onClick={stopEditing} className="bg-green-500 rounded-lg py-2 items-center border-none text-white font-bold text-sm cursor-pointer mt-1">
                                Save Amenities
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {AMENITIES_LIST.filter(a => amenities[a.key]).map(a => (
                                <div key={a.key} className="flex items-center gap-1.5 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-full">
                                    <a.icon size={12} color="#156778" />
                                    <span className="text-xs font-semibold text-teal-600">{a.label}</span>
                                </div>
                            ))}
                            {!Object.values(amenities).some(Boolean) && (
                                <span className="text-xs text-gray-400 italic">No amenities added yet</span>
                            )}
                        </div>
                    )}
                </SCard>

                {/* ══ Home Service Settings ════════════════════════════════════════════ */}
                <SCard>
                    <SHeader title="Home Service" onEdit={() => setEditingSection('home')} editMode={editMode} />

                    {editMode && editingSection === 'home' ? (
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => setHomeService(prev => ({ ...prev, enabled: !prev.enabled }))}
                                className={`flex justify-between items-center w-full px-3 py-2 rounded-lg border cursor-pointer transition-colors ${homeService.enabled ? 'bg-teal-50 border-teal-200' : 'bg-gray-50 border-gray-200'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <Home size={16} color={homeService.enabled ? '#156778' : '#9ca3af'} />
                                    <span className={`text-sm font-bold ${homeService.enabled ? 'text-teal-600' : 'text-gray-400'}`}>
                                        {homeService.enabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                </div>
                                <div className={`w-11 h-6 rounded-full flex items-center transition-colors ${homeService.enabled ? 'bg-teal-600 justify-end px-1' : 'bg-gray-300 justify-start px-1'}`}>
                                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                                </div>
                            </button>

                            {homeService.enabled && (
                                <div className="flex gap-2">
                                    <div className="flex-1 flex flex-col gap-1">
                                        <span className="text-xs text-gray-500 font-semibold">Service Radius (km)</span>
                                        <input
                                            value={homeService.radius}
                                            onChange={(e) => setHomeService(p => ({ ...p, radius: e.target.value }))}
                                            type="number"
                                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-gray-50 focus:outline-none w-full box-border"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col gap-1">
                                        <span className="text-xs text-gray-500 font-semibold">Extra Charge (₹)</span>
                                        <input
                                            value={homeService.extraCharge}
                                            onChange={(e) => setHomeService(p => ({ ...p, extraCharge: e.target.value }))}
                                            type="number"
                                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-gray-50 focus:outline-none w-full box-border"
                                        />
                                    </div>
                                </div>
                            )}
                            <button onClick={stopEditing} className="bg-green-500 rounded-lg py-2 items-center border-none text-white font-bold text-sm cursor-pointer mt-1">
                                Save Settings
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${homeService.enabled ? 'bg-teal-50' : 'bg-gray-100'}`}>
                                    <Home size={16} color={homeService.enabled ? '#156778' : '#9ca3af'} />
                                </div>
                                <span className={`text-sm font-bold ${homeService.enabled ? 'text-teal-600' : 'text-gray-400'}`}>
                                    {homeService.enabled ? 'Home service enabled' : 'Home service disabled'}
                                </span>
                            </div>
                            {homeService.enabled && (
                                <div className="flex gap-2 pl-[40px]">
                                    <div className="flex items-center gap-1.5 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full">
                                        <Navigation size={12} color="#156778" />
                                        <span className="text-xs font-semibold text-teal-600">{homeService.radius} km radius</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full">
                                        <PlusCircle size={12} color="#156778" />
                                        <span className="text-xs font-semibold text-teal-600">+₹{homeService.extraCharge} charge</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </SCard>

                {/* ══ Gallery ══════════════════════════════════════════════════════════ */}
                <div className="bg-white mx-4 mt-3 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-4 pt-4">
                        <SHeader title="Gallery" onViewAll={() => { }} />
                    </div>
                    <div className="flex px-4 gap-2 pb-4">
                        <div className="flex-1 flex flex-col gap-2">
                            {MOCK_IMAGES.slice(0, 2).map((img, i) => (
                                <img key={`col1-${i}`} src={img} className={`w-full rounded-xl object-cover ${i === 0 ? 'h-[140px]' : 'h-[100px]'}`} alt="Gallery img 1" />
                            ))}
                        </div>
                        <div className="flex-1 flex flex-col gap-2">
                            {MOCK_IMAGES.slice(2, 4).map((img, i) => (
                                <div key={`col2-${i}`} className="relative">
                                    <img src={img} className={`w-full rounded-xl object-cover ${i === 0 ? 'h-[100px]' : 'h-[140px]'}`} alt="Gallery img 2" />
                                    {i === 1 && (
                                        <div className="absolute inset-0 bg-black/45 rounded-xl flex flex-col items-center justify-center">
                                            <span className="text-white text-xl font-black">+12</span>
                                            <span className="text-white/80 text-xs mt-0.5">More photos</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ══ Specialists ══════════════════════════════════════════════════════ */}
                <SCard>
                    <SHeader
                        title="Our Specialists"
                        subtitle="Meet the team"
                        onEdit={() => navigate('/salon-owner/manage-specialists')}
                        onViewAll={() => navigate('/salon-owner/manage-specialists')}
                        editMode={editMode}
                    />
                    {specialists.length === 0 ? (
                        <div className="flex flex-col items-center py-6 gap-2">
                            <div className="w-14 h-14 rounded-full bg-pink-50 flex items-center justify-center">
                                <Users size={26} color="#fda4af" />
                            </div>
                            <span className="text-sm font-bold text-gray-700">No specialists yet</span>
                            <span className="text-xs text-gray-400 text-center">Add your team to attract more customers</span>
                            <button
                                onClick={() => navigate('/salon-owner/manage-specialists')}
                                className="mt-2 bg-pink-500 rounded-full px-4 py-2 border-none text-white font-bold text-xs cursor-pointer"
                            >
                                + Add Specialist
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {specialists.map(s => (
                                <div key={s._id} className="flex flex-col items-center w-20 shrink-0 gap-1.5">
                                    <img src={s.image} className="w-16 h-16 rounded-full bg-gray-200 border-2 border-pink-200 object-cover" alt={s.name} />
                                    <span className="text-xs font-bold text-gray-800 text-center truncate w-full px-1">{s.name}</span>
                                    <span className="text-[10px] text-gray-400 text-center truncate w-full px-1 leading-tight">{s.role}</span>
                                    <div className="flex items-center gap-1">
                                        <Star size={10} color="#f59e0b" fill="#f59e0b" />
                                        <span className="text-[11px] font-bold text-yellow-700">{s.rating}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </SCard>

                {/* ══ Policies ═════════════════════════════════════════════════════════ */}
                <SCard>
                    <SHeader title="Salon Policies" onEdit={() => setEditingSection('policies')} editMode={editMode} />

                    {editMode && editingSection === 'policies' ? (
                        <div className="flex flex-col gap-3">
                            {[
                                { key: 'cancellation', label: 'Cancellation Policy' },
                                { key: 'late', label: 'Late Arrival Policy' },
                                { key: 'payment', label: 'Payment Policy' },
                                { key: 'children', label: 'Children Policy' },
                            ].map(f => (
                                <div key={f.key} className="flex flex-col gap-1">
                                    <span className="text-xs font-semibold text-gray-500 pl-1">{f.label}</span>
                                    <textarea
                                        value={policies[f.key]}
                                        onChange={(e) => setPolicies(prev => ({ ...prev, [f.key]: e.target.value }))}
                                        placeholder={f.label}
                                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none w-full box-border min-h-[52px] resize-none"
                                    />
                                </div>
                            ))}
                            <button onClick={stopEditing} className="bg-green-500 rounded-lg py-2 items-center border-none text-white font-bold text-sm cursor-pointer mt-1">
                                Save Policies
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {[
                                { key: 'cancellation', icon: XCircle, color: '#ef4444', label: 'Cancellation' },
                                { key: 'late', icon: Clock, color: '#f59e0b', label: 'Late Arrival' },
                                { key: 'payment', icon: CreditCard, color: '#3b82f6', label: 'Payment' },
                                { key: 'children', icon: Smile, color: '#8b5cf6', label: 'Children' },
                            ].map(f => (
                                <div key={f.key} className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: f.color + '18' }}>
                                        <f.icon size={15} color={f.color} />
                                    </div>
                                    <div className="flex-1 flex flex-col pt-1">
                                        <span className="text-xs font-bold text-gray-500 mb-0.5 uppercase tracking-wider">{f.label}</span>
                                        <p className="text-sm text-gray-700 leading-relaxed m-0">{policies[f.key]}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </SCard>

                {/* ══ Reviews ══════════════════════════════════════════════════════════ */}
                <SCard className="mb-6">
                    <SHeader title="Reviews" onViewAll={() => { }} />

                    {/* Rating summary */}
                    <div className="flex items-center gap-4 bg-pink-50 rounded-2xl p-4 mb-4 border border-pink-100/50">
                        <div className="flex flex-col items-center justify-center w-[80px]">
                            <span className="text-4xl font-black text-pink-500 leading-none mb-1">{rating}</span>
                            <StarRow rating={Math.round(parseFloat(rating))} size={12} />
                            <span className="text-xs text-gray-400 mt-1.5">{MOCK_REVIEWS.length} reviews</span>
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            {[{ s: 5, p: 70 }, { s: 4, p: 20 }, { s: 3, p: 6 }, { s: 2, p: 3 }, { s: 1, p: 1 }].map(({ s, p }) => (
                                <div key={s} className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-gray-500 w-2 text-right">{s}</span>
                                    <div className="flex-1 h-1.5 bg-pink-100 rounded-full overflow-hidden">
                                        <div style={{ width: `${p}%` }} className="h-full bg-pink-500 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Review cards — read only, owner can reply */}
                    <div className="flex flex-col gap-3">
                        {reviews.map(review => (
                            <div key={review.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                <div className="flex items-start gap-3 mb-2">
                                    <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center shrink-0">
                                        <span className="text-sm font-bold text-pink-500">{review.userName[0]}</span>
                                    </div>
                                    <div className="flex-1 pt-0.5">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <span className="text-sm font-bold text-gray-800">{review.userName}</span>
                                            <span className="text-xs text-gray-400">{review.date}</span>
                                        </div>
                                        <StarRow rating={review.rating} size={11} />
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed m-0 mt-2">{review.comment}</p>

                                {/* Owner reply */}
                                {review.ownerReply && (
                                    <div className="mt-3 bg-teal-50 border border-teal-100 rounded-xl p-3">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <Store size={12} color="#156778" />
                                            <span className="text-xs font-bold text-teal-600">Owner Reply</span>
                                        </div>
                                        <p className="text-xs text-teal-700 leading-relaxed m-0">{review.ownerReply}</p>
                                    </div>
                                )}

                                {/* Reply input */}
                                {replyingTo === review.id ? (
                                    <div className="mt-3 flex items-center gap-2">
                                        <input
                                            value={replyDraft}
                                            onChange={(e) => setReplyDraft(e.target.value)}
                                            placeholder="Write a reply…"
                                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-800 bg-white focus:outline-none w-full"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => submitReply(review.id)}
                                            className="bg-teal-600 px-3 py-2 rounded-lg border-none cursor-pointer"
                                        >
                                            <span className="text-white text-xs font-bold">Post</span>
                                        </button>
                                        <button
                                            onClick={() => { setReplyingTo(null); setReplyDraft(''); }}
                                            className="bg-transparent border-none p-1 cursor-pointer flex items-center justify-center rounded-full hover:bg-gray-200"
                                        >
                                            <X size={16} color="#9ca3af" />
                                        </button>
                                    </div>
                                ) : (
                                    !review.ownerReply && (
                                        <button
                                            onClick={() => setReplyingTo(review.id)}
                                            className="mt-3 flex items-center gap-1 bg-transparent border border-teal-200 px-3 py-1.5 rounded-full cursor-pointer hover:bg-teal-50 self-start transition-colors"
                                        >
                                            <MessageSquare size={12} color="#156778" />
                                            <span className="text-[11px] font-bold text-teal-600">Reply to review</span>
                                        </button>
                                    )
                                )}
                            </div>
                        ))}
                    </div>
                </SCard>
            </div>

            <MobileBottomNav />
        </div>
    );
}

