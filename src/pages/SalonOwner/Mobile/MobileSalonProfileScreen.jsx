import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../../redux/slice/authSlice';
import {
    Pencil,
    Check,
    Star as StarIcon,
    MapPin,
    Building,
    Scissors,
    Home,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Zap,
    Mail,
    Phone,
    CreditCard,
    Bell,
    ShieldCheck,
    HelpCircle,
    LogOut,
    ChevronRight
} from 'lucide-react';
import MobileBottomNav from './MobileBottomNav';

// ─── Constants ────────────────────────────────────────────────────────────────
const H_PAD = '16px';
const BG = '#fff1f2';
const ACCENT = '#f43f5e';
const NAVY = '#2d3a5a';

const cardShadow = {
    boxShadow: '0 3px 12px rgba(244, 63, 94, 0.08)',
};

// ─── Small helpers ────────────────────────────────────────────────────────────
const SectionTitle = ({ children }) => (
    <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#1f2937', marginBottom: '12px', marginTop: 0 }}>
        {children}
    </h2>
);

const InfoRow = ({ icon: IconComponent, label, value }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div
            style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#fecdd3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px',
                flexShrink: 0
            }}
        >
            <IconComponent size={17} color={ACCENT} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600', marginBottom: '2px', textTransform: 'uppercase' }}>
                {label}
            </div>
            <div style={{ fontSize: '14px', color: '#1f2937', fontWeight: '600', lineHeight: '20px', wordBreak: 'break-word' }}>
                {value || 'N/A'}
            </div>
        </div>
    </div>
);

const MenuRow = ({ icon: IconComponent, iconBg, iconColor, label, value, onPress, danger }) => (
    <button
        onClick={onPress}
        style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '14px 0',
            borderBottom: '1px solid #fce7eb',
            background: 'none',
            border: 'none',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: '#fce7eb',
            width: '100%',
            cursor: 'pointer',
            textAlign: 'left'
        }}
    >
        <div
            style={{
                width: '38px',
                height: '38px',
                borderRadius: '11px',
                backgroundColor: iconBg || '#fecdd3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '13px',
                flexShrink: 0
            }}
        >
            <IconComponent size={18} color={iconColor || ACCENT} />
        </div>
        <div style={{ flex: 1, fontSize: '14px', fontWeight: '600', color: danger ? '#ef4444' : '#1f2937' }}>
            {label}
        </div>
        {value ? (
            <div style={{ fontSize: '13px', color: '#9ca3af', marginRight: '6px' }}>{value}</div>
        ) : null}
        <ChevronRight size={16} color={danger ? '#fca5a5' : '#d1d5db'} />
    </button>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function MobileSalonProfileScreen() {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    const roleDetails = user?.roleDetails || {};
    const location = roleDetails?.location || {};
    const galleryImages = roleDetails?.galleryImages || [];
    const governmentId = roleDetails?.governmentId || {};
    const subscription = roleDetails?.subscription || {};

    const isPaid =
        subscription?.paymentStatus?.toLowerCase() === 'paid' ||
        subscription?.paymentStatus?.toLowerCase() === 'active';

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            dispatch(logout());
        }
    };

    const handleEdit = () => alert('Edit functionality coming soon!');
    const handleUpgrade = () => alert('Subscription upgrade coming soon!');

    return (
        <div style={{ flex: 1, backgroundColor: BG, minHeight: '100vh', paddingBottom: '50px' }}>
            <div style={{ paddingBottom: '50px' }}>
                {/* ── Hero Header ─────────────────────────────────────────────────── */}
                <div
                    style={{
                        backgroundColor: '#fff',
                        padding: `16px ${H_PAD} 24px ${H_PAD}`,
                        borderBottomLeftRadius: '28px',
                        borderBottomRightRadius: '28px',
                        ...cardShadow,
                    }}
                >
                    {/* Top bar */}
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#1f2937', margin: 0 }}>My Profile</h1>
                        <button
                            onClick={handleEdit}
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: '#fff1f2',
                                borderRadius: '20px',
                                padding: '8px 14px',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <Pencil size={14} color={ACCENT} />
                            <span style={{ fontSize: '13px', fontWeight: '700', color: ACCENT }}>Edit</span>
                        </button>
                    </div>

                    {/* Avatar + name + rating */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ position: 'relative', marginBottom: '12px' }}>
                            <img
                                src={galleryImages[0] || 'https://i.pravatar.cc/150?u=salon_glamour'}
                                alt="Salon logo"
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    borderRadius: '50%',
                                    border: '3px solid #fecdd3',
                                    objectFit: 'cover'
                                }}
                            />
                            {/* Verified badge */}
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '2px',
                                    right: '2px',
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '50%',
                                    backgroundColor: '#10b981',
                                    border: '2px solid #fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Check size={13} color="#fff" />
                            </div>
                        </div>

                        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1f2937', marginBottom: '4px', marginTop: 0 }}>
                            {roleDetails?.shopName || user?.name || 'Glamour Salon'}
                        </h2>

                        {/* Rating pill */}
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '4px',
                                backgroundColor: '#fff7ed',
                                borderRadius: '20px',
                                padding: '5px 12px',
                                marginBottom: '8px',
                            }}
                        >
                            <StarIcon size={13} color="#f59e0b" fill="#f59e0b" />
                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#92400e' }}>4.8</span>
                            <span style={{ fontSize: '12px', color: '#d97706' }}>(245 reviews)</span>
                        </div>

                        {/* Location pill */}
                        {location?.city && (
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '4px' }}>
                                <MapPin size={13} color="#9ca3af" />
                                <span style={{ fontSize: '13px', color: '#9ca3af', fontWeight: '500' }}>
                                    {location.city}{location.state ? `, ${location.state}` : ''}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* ── Quick Stats ── */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            marginTop: '20px',
                            backgroundColor: '#fff1f2',
                            borderRadius: '16px',
                            padding: '14px',
                            gap: 0,
                        }}
                    >
                        {[
                            { icon: Building, label: 'Shop Type', value: roleDetails?.shopType || 'Personal' },
                            { icon: Scissors, label: 'Category', value: roleDetails?.salonCategory || 'N/A' },
                            { icon: Home, label: 'Home Service', value: roleDetails?.offersHomeService ? 'Yes' : 'No' },
                        ].map((stat, i, arr) => (
                            <React.Fragment key={stat.label}>
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div
                                        style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '10px',
                                            backgroundColor: '#fecdd3',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '6px',
                                        }}
                                    >
                                        <stat.icon size={17} color={ACCENT} />
                                    </div>
                                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#1f2937', textAlign: 'center', textTransform: 'capitalize' }}>
                                        {stat.value}
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px', fontWeight: '500' }}>
                                        {stat.label}
                                    </div>
                                </div>
                                {i < arr.length - 1 && (
                                    <div style={{ width: '1px', backgroundColor: '#fecdd3', margin: '4px 0' }} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* ── Subscription Card ────────────────────────────────────────────── */}
                <div style={{ margin: `20px ${H_PAD} 0 ${H_PAD}` }}>
                    <SectionTitle>Subscription</SectionTitle>
                    <div
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '18px',
                            overflow: 'hidden',
                            ...cardShadow,
                        }}
                    >
                        {/* Plan banner */}
                        <div
                            style={{
                                backgroundColor: isPaid ? NAVY : '#fff7ed',
                                padding: '16px',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>
                                <div style={{ fontSize: '11px', color: isPaid ? '#93c5fd' : '#d97706', fontWeight: '600', marginBottom: '3px' }}>
                                    CURRENT PLAN
                                </div>
                                <div style={{ fontSize: '18px', fontWeight: '800', color: isPaid ? '#fff' : '#92400e' }}>
                                    {subscription?.planId || 'No Active Plan'}
                                </div>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: '6px',
                                    backgroundColor: isPaid ? 'rgba(255,255,255,0.15)' : '#fff3e0',
                                    borderRadius: '20px',
                                    padding: '6px 12px',
                                }}
                            >
                                {isPaid ? <CheckCircle2 size={14} color="#34d399" /> : <Clock size={14} color="#f59e0b" />}
                                <span style={{ fontSize: '12px', fontWeight: '700', color: isPaid ? '#34d399' : '#f59e0b' }}>
                                    {subscription?.paymentStatus?.toUpperCase() || 'PENDING'}
                                </span>
                            </div>
                        </div>

                        {/* Warning if pending */}
                        {!isPaid && subscription?.planId && (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: '10px',
                                    backgroundColor: '#fff7ed',
                                    padding: '14px',
                                    borderTop: '1px solid #fde68a',
                                }}
                            >
                                <AlertTriangle size={18} color="#f59e0b" />
                                <div style={{ flex: 1, fontSize: '12px', color: '#92400e', lineHeight: '18px' }}>
                                    Payment pending. Complete payment to activate your plan.
                                </div>
                            </div>
                        )}

                        {/* Upgrade button */}
                        {!isPaid && (
                            <button
                                onClick={handleUpgrade}
                                style={{
                                    margin: '14px',
                                    backgroundColor: ACCENT,
                                    borderRadius: '12px',
                                    padding: '13px 0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    width: 'calc(100% - 28px)'
                                }}
                            >
                                <Zap size={16} color="#fff" />
                                <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>Upgrade Plan</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Contact & Location ───────────────────────────────────────────── */}
                <div style={{ margin: `20px ${H_PAD} 0 ${H_PAD}` }}>
                    <SectionTitle>Contact & Location</SectionTitle>
                    <div
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '18px',
                            padding: '16px',
                            ...cardShadow,
                        }}
                    >
                        <InfoRow
                            icon={MapPin}
                            label="Address"
                            value={[location?.address, location?.city, location?.state].filter(Boolean).join(', ') || 'MG Road, Bangalore'}
                        />
                        <InfoRow
                            icon={Mail}
                            label="Email"
                            value={user?.email || 'salonowner1@gmail.com'}
                        />
                        {roleDetails?.contactNumber && (
                            <InfoRow
                                icon={Phone}
                                label="Phone"
                                value={roleDetails.contactNumber}
                            />
                        )}
                        {roleDetails?.whatsappNumber && (
                            <InfoRow
                                icon={Phone}
                                label="WhatsApp"
                                value={roleDetails.whatsappNumber}
                            />
                        )}
                        {governmentId?.idNumber && (
                            <InfoRow
                                icon={CreditCard}
                                label={governmentId.idType || 'Government ID'}
                                value={governmentId.idNumber}
                            />
                        )}
                    </div>
                </div>

                {/* ── Account Settings ─────────────────────────────────────────────── */}
                <div style={{ margin: `20px ${H_PAD} 0 ${H_PAD}` }}>
                    <SectionTitle>Account</SectionTitle>
                    <div
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '18px',
                            padding: '0 16px',
                            ...cardShadow,
                        }}
                    >
                        <MenuRow
                            icon={Pencil}
                            iconBg="#fecdd3"
                            iconColor={ACCENT}
                            label="Edit Profile"
                            onPress={handleEdit}
                        />
                        <MenuRow
                            icon={Bell}
                            iconBg="#dbeafe"
                            iconColor="#3b82f6"
                            label="Notifications"
                            onPress={() => { }}
                        />
                        <MenuRow
                            icon={ShieldCheck}
                            iconBg="#d1fae5"
                            iconColor="#10b981"
                            label="Privacy & Security"
                            onPress={() => { }}
                        />
                        <MenuRow
                            icon={HelpCircle}
                            iconBg="#ede9fe"
                            iconColor="#8b5cf6"
                            label="Help & Support"
                            onPress={() => { }}
                        />
                        <MenuRow
                            icon={LogOut}
                            iconBg="#fee2e2"
                            iconColor="#ef4444"
                            label="Logout"
                            onPress={handleLogout}
                            danger
                        />
                    </div>
                </div>

                {/* ── App version ── */}
                <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: '#d1d5db' }}>
                    Glownify v1.0.0
                </div>
            </div>
            
            <MobileBottomNav />
        </div>
    );
}
