import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import ServiceCard from '../UserScreens/ShopDetails/ServiceCard';
import SpecialistCard from '../UserScreens/ShopDetails/SpecialistCard';
import ReviewCard from '../UserScreens/ShopDetails/ReviewCard';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');

// ─── Constants ────────────────────────────────────────────────────────────────

const H_PAD = 16;
const ACCENT = '#f43f5e';
const NAVY   = '#2d3a5a';
const BG     = '#fff1f2';

const shadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 10,
  elevation: 3,
};

const pinkShadow = {
  shadowColor: '#f43f5e',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.09,
  shadowRadius: 14,
  elevation: 4,
};

// ─── Mock / Fallback Data ─────────────────────────────────────────────────────

const MOCK_IMAGES = [
  require('../../../src/assets/featuredSalon.png'),
  require('../../../src/assets/featuredSalon.png'),
  require('../../../src/assets/featuredSalon.png'),
  require('../../../src/assets/featuredSalon.png'),
];

const MOCK_SERVICES = [
  { id: '1', name: 'Women Haircut',      price: 55,  duration: '1.5 hr',  description: 'A clean precision cut with modern finishing.',    discount: '-20%', image: require('../../../src/assets/featuredSalon.png') },
  { id: '2', name: 'Bob / Lob Cut',      price: 55,  duration: '1.5 hr',  description: 'Classic bob cut tailored to your face shape.',    discount: null,   image: require('../../../src/assets/featuredSalon.png') },
  { id: '3', name: 'Medium Layer Cut',   price: 80,  duration: '1 hr',    description: 'Layers that give movement and volume.',           discount: null,   image: require('../../../src/assets/featuredSalon.png') },
  { id: '4', name: 'V-Shaped Cut',       price: 90,  duration: '2.5 hr',  description: 'Elegant V-shape with seamless blending.',        discount: '-5%',  image: require('../../../src/assets/featuredSalon.png') },
];

const MOCK_REVIEWS = [
  { id: '1', userName: 'Jennie Whang', userImage: require('../../../src/assets/featuredSalon.png'), rating: 4, date: '2 days ago',  comment: 'The place was clean, great service, staff are friendly. Will certainly recommend!' },
  { id: '2', userName: 'Nathalie',     userImage: require('../../../src/assets/featuredSalon.png'), rating: 5, date: '1 week ago',  comment: 'Very nice service from the specialist. I always come here for my treatment.'       },
  { id: '3', userName: 'Julia Martha', userImage: require('../../../src/assets/featuredSalon.png'), rating: 4, date: '2 weeks ago', comment: 'This is my favourite place to treat my hair :)'                                   },
];

const DEFAULT_HOURS = [
  { day: 'Monday',    start: '08:00 AM', end: '09:00 PM' },
  { day: 'Tuesday',   start: '08:00 AM', end: '09:00 PM' },
  { day: 'Wednesday', start: '08:00 AM', end: '09:00 PM' },
  { day: 'Thursday',  start: '08:00 AM', end: '09:00 PM' },
  { day: 'Friday',    start: '08:00 AM', end: '09:00 PM' },
  { day: 'Saturday',  start: '09:00 AM', end: '07:00 PM' },
  { day: 'Sunday',    start: null,       end: null        },
];

const QUICK_ACTIONS = [
  { icon: 'add-circle-outline',   label: 'Add Service', color: '#f43f5e', bg: '#fff1f2', nav: 'AddService'  },
  { icon: 'people-outline',       label: 'Add Staff',   color: '#f97316', bg: '#fff7ed', nav: 'AddStaff'    },
  { icon: 'gift-outline',         label: 'Promotions',  color: '#8b5cf6', bg: '#f5f3ff', nav: 'Promotions'  },
  { icon: 'bar-chart-outline',    label: 'Analytics',   color: '#10b981', bg: '#ecfdf5', nav: 'Analytics'   },
  { icon: 'calendar-outline',     label: 'Schedule',    color: '#3b82f6', bg: '#eff6ff', nav: 'Schedule'    },
  { icon: 'share-social-outline', label: 'Share',       color: '#ec4899', bg: '#fdf2f8', nav: 'Share'       },
];

// ─── Shared Sub-components ────────────────────────────────────────────────────

const SectionCard = ({ children, style }) => (
  <View style={[{ backgroundColor: '#fff', marginHorizontal: H_PAD, marginTop: 12, borderRadius: 22, padding: H_PAD, ...pinkShadow }, style]}>
    {children}
  </View>
);

const SectionHeader = ({ title, subtitle, onEdit, onViewAll }) => (
  <View style={{ marginBottom: 14 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{ fontSize: 17, fontWeight: '800', color: '#1f2937', letterSpacing: -0.3 }}>{title}</Text>
      {onEdit && (
        <TouchableOpacity
          onPress={onEdit} activeOpacity={0.8}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff1f2', borderRadius: 14, paddingHorizontal: 11, paddingVertical: 6 }}
        >
          <Icon name="pencil-outline" size={13} color={ACCENT} />
          <Text style={{ fontSize: 12, fontWeight: '700', color: ACCENT }}>Edit</Text>
        </TouchableOpacity>
      )}
      {onViewAll && (
        <TouchableOpacity onPress={onViewAll} style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }} activeOpacity={0.8}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: ACCENT }}>View all</Text>
          <Icon name="chevron-forward" size={14} color={ACCENT} />
        </TouchableOpacity>
      )}
    </View>
    {subtitle ? <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 3 }}>{subtitle}</Text> : null}
  </View>
);

const StarRow = ({ rating, size = 13 }) => (
  <View style={{ flexDirection: 'row', gap: 2 }}>
    {[1,2,3,4,5].map(i => (
      <Icon key={i} name={i <= rating ? 'star' : 'star-outline'} size={size} color={i <= rating ? '#f59e0b' : '#d1d5db'} />
    ))}
  </View>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MyView({ navigation }) {
  const insets = useSafeAreaInsets();

  const userDetails = useSelector(state => state.auth.user);
  const salonData   = useSelector(state => state.user.salonDetails);

  const specialists       = salonData?.specialistsData    || [];
  const serviceCategories = salonData?.serviceCategories  || [];
  const openingHours      = salonData?.openingHours?.length > 0 ? salonData.openingHours : DEFAULT_HOURS;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showHours,         setShowHours]          = useState(false);
  const [isOpen,            setIsOpen]             = useState(true);
  const [activeCategory,    setActiveCategory]     = useState(null);
  const [isEditingName,     setIsEditingName]      = useState(false);
  const [isEditingAbout,    setIsEditingAbout]     = useState(false);

  const [shopName, setShopName] = useState(userDetails?.roleDetails?.shopName || 'Glamour Salon');
  const [about,    setAbout]    = useState(
    userDetails?.roleDetails?.about ||
    'We specialize in professional beauty & grooming. Our skilled team ensures you leave looking and feeling your absolute best.'
  );

  const location = userDetails?.roleDetails?.location || {};
  const rating   = userDetails?.roleDetails?.rating   || '4.7';
  const today    = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayHours = openingHours.find(h => h.day === today);

  // action button tile width — 3 per row
  const actionTileW = (width - H_PAD * 2 - H_PAD * 2 - 10 * 2) / 3;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={[]}>

      {/* ── Floating Header ──────────────────────────────────────────────── */}
      <View
        style={{
          position: 'absolute', top: insets.top + 6, left: 0, right: 0,
          zIndex: 20, flexDirection: 'row', justifyContent: 'space-between',
          alignItems: 'center', paddingHorizontal: H_PAD,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.95)', alignItems: 'center', justifyContent: 'center', ...shadow }}
        >
          <Icon name="chevron-back" size={22} color="#1f2937" />
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          {[{ icon: 'share-outline', color: NAVY }, { icon: 'heart-outline', color: ACCENT }].map(btn => (
            <TouchableOpacity
              key={btn.icon}
              style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.95)', alignItems: 'center', justifyContent: 'center', ...shadow }}
            >
              <Icon name={btn.icon} size={20} color={btn.color} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>

        {/* ══ Hero Gallery ════════════════════════════════════════════════════ */}
        <View style={{ height: 280, position: 'relative', backgroundColor: '#111' }}>
          <ScrollView
            horizontal pagingEnabled showsHorizontalScrollIndicator={false}
            onScroll={e => setCurrentImageIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
            scrollEventThrottle={16}
          >
            {MOCK_IMAGES.map((img, i) => (
              <Image key={i} source={img} style={{ width, height: 280 }} resizeMode="cover" />
            ))}
          </ScrollView>

          {/* Dark overlay at bottom */}
          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, backgroundColor: 'rgba(0,0,0,0.32)' }} pointerEvents="none" />

          {/* Photo count badge */}
          <View
            style={{
              position: 'absolute', top: insets.top + 58, right: H_PAD,
              backgroundColor: 'rgba(0,0,0,0.52)', borderRadius: 12,
              paddingHorizontal: 10, paddingVertical: 4,
              flexDirection: 'row', alignItems: 'center', gap: 4,
            }}
          >
            <Icon name="images-outline" size={12} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>
              {currentImageIndex + 1} / {MOCK_IMAGES.length}
            </Text>
          </View>

          {/* Camera edit button */}
          <TouchableOpacity
            style={{
              position: 'absolute', bottom: 48, right: H_PAD,
              backgroundColor: 'rgba(0,0,0,0.58)', padding: 9, borderRadius: 20,
              flexDirection: 'row', alignItems: 'center', gap: 5,
            }}
          >
            <Icon name="camera-outline" size={14} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>Edit Photos</Text>
          </TouchableOpacity>

          {/* Pill indicators */}
          <View style={{ position: 'absolute', bottom: 18, alignSelf: 'center', flexDirection: 'row', gap: 6 }}>
            {MOCK_IMAGES.map((_, i) => (
              <View
                key={i}
                style={{
                  height: 5, width: i === currentImageIndex ? 22 : 5,
                  borderRadius: 3,
                  backgroundColor: i === currentImageIndex ? '#fff' : 'rgba(255,255,255,0.42)',
                }}
              />
            ))}
          </View>
        </View>

        {/* ══ Shop Identity Card ═══════════════════════════════════════════════ */}
        <View style={{ backgroundColor: '#fff', marginHorizontal: H_PAD, marginTop: -24, borderRadius: 24, padding: H_PAD, ...pinkShadow }}>

          {/* Name row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            {isEditingName ? (
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <TextInput
                  value={shopName} onChangeText={setShopName} autoFocus
                  style={{ flex: 1, fontSize: 21, fontWeight: '800', color: '#1f2937', borderBottomWidth: 2, borderBottomColor: ACCENT, paddingVertical: 2 }}
                />
                <TouchableOpacity onPress={() => setIsEditingName(false)}>
                  <Icon name="checkmark-circle" size={28} color="#10b981" />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <Text style={{ flex: 1, fontSize: 21, fontWeight: '800', color: '#1f2937', letterSpacing: -0.4 }}>{shopName}</Text>
                <TouchableOpacity
                  onPress={() => setIsEditingName(true)}
                  style={{ backgroundColor: '#fff1f2', borderRadius: 12, padding: 7, marginLeft: 8 }}
                >
                  <Icon name="pencil-outline" size={15} color={ACCENT} />
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Location */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 12 }}>
            <Icon name="location-outline" size={14} color="#9ca3af" />
            <Text style={{ fontSize: 13, color: '#6b7280', flex: 1 }} numberOfLines={1}>
              {location?.address || 'Location not set'}{location?.city ? `, ${location.city}` : ''}
            </Text>
          </View>

          {/* Status pills */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {/* Rating */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#fff7ed', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 }}>
              <Icon name="star" size={13} color="#f59e0b" />
              <Text style={{ fontSize: 13, fontWeight: '800', color: '#92400e' }}>{rating}</Text>
              <Text style={{ fontSize: 12, color: '#d97706' }}>({MOCK_REVIEWS.length} reviews)</Text>
            </View>
            {/* Open toggle */}
            <TouchableOpacity
              onPress={() => setIsOpen(v => !v)} activeOpacity={0.8}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: isOpen ? '#d1fae5' : '#fee2e2', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 }}
            >
              <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: isOpen ? '#10b981' : '#ef4444' }} />
              <Text style={{ fontSize: 12, fontWeight: '700', color: isOpen ? '#059669' : '#dc2626' }}>
                {isOpen ? 'Open Now' : 'Closed'}
              </Text>
            </TouchableOpacity>
            {/* Home service */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#f5f3ff', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 }}>
              <Icon name="home-outline" size={12} color="#7c3aed" />
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#7c3aed' }}>Home Service</Text>
            </View>
          </View>

          {/* Thin divider */}
          <View style={{ height: 1, backgroundColor: '#f3f4f6', marginBottom: 14 }} />

          {/* 4-stat strip */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 }}>
            {[
              { icon: 'calendar-outline',  value: '1.2K',  label: 'Bookings',  color: ACCENT    },
              { icon: 'people-outline',     value: '863',   label: 'Customers', color: '#3b82f6' },
              { icon: 'navigate-outline',   value: '18 km', label: 'Distance',  color: '#10b981' },
              { icon: 'star-outline',       value: rating,  label: 'Rating',    color: '#f59e0b' },
            ].map((s, i, arr) => (
              <React.Fragment key={s.label}>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: s.color + '18', alignItems: 'center', justifyContent: 'center', marginBottom: 5 }}>
                    <Icon name={s.icon} size={17} color={s.color} />
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: '#1f2937' }}>{s.value}</Text>
                  <Text style={{ fontSize: 10, color: '#9ca3af', fontWeight: '500', marginTop: 1 }}>{s.label}</Text>
                </View>
                {i < arr.length - 1 && <View style={{ width: 1, height: 36, backgroundColor: '#f3f4f6', alignSelf: 'center' }} />}
              </React.Fragment>
            ))}
          </View>

          {/* CTA buttons */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: BG, borderRadius: 14, paddingVertical: 12 }}
            >
              <Icon name="navigate-outline" size={16} color={ACCENT} />
              <Text style={{ fontSize: 13, fontWeight: '700', color: ACCENT }}>Directions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: NAVY, borderRadius: 14, paddingVertical: 12 }}
            >
              <Icon name="call-outline" size={16} color="#fff" />
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>Call Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ══ Quick Actions ════════════════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeader title="Quick Actions" subtitle="Manage your salon from here" />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {QUICK_ACTIONS.map(action => (
              <TouchableOpacity
                key={action.label}
                onPress={() => navigation.navigate(action.nav)}
                activeOpacity={0.75}
                style={{ width: actionTileW, backgroundColor: action.bg, borderRadius: 16, paddingVertical: 14, alignItems: 'center', gap: 6 }}
              >
                <View style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: action.color + '20', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={action.icon} size={20} color={action.color} />
                </View>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#374151', textAlign: 'center' }}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>

        {/* ══ About ════════════════════════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeader title="About" onEdit={() => setIsEditingAbout(true)} />
          {isEditingAbout ? (
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
              <TextInput
                value={about} onChangeText={setAbout} autoFocus multiline
                style={{ flex: 1, fontSize: 14, color: '#374151', lineHeight: 22, borderWidth: 1.5, borderColor: '#fecdd3', borderRadius: 12, padding: 12, textAlignVertical: 'top', minHeight: 80 }}
              />
              <TouchableOpacity onPress={() => setIsEditingAbout(false)} style={{ marginTop: 2 }}>
                <Icon name="checkmark-circle" size={28} color="#10b981" />
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={{ fontSize: 14, color: '#6b7280', lineHeight: 22 }}>{about}</Text>
          )}
        </SectionCard>

        {/* ══ Opening Hours ════════════════════════════════════════════════════ */}
        <SectionCard>
          <TouchableOpacity
            onPress={() => setShowHours(v => !v)} activeOpacity={0.8}
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <View>
              <Text style={{ fontSize: 17, fontWeight: '800', color: '#1f2937', letterSpacing: -0.3 }}>Opening Hours</Text>
              {todayHours && (
                <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
                  Today: {todayHours.start && todayHours.end ? `${todayHours.start} – ${todayHours.end}` : 'Closed'}
                </Text>
              )}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ backgroundColor: isOpen ? '#d1fae5' : '#fee2e2', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: isOpen ? '#059669' : '#ef4444' }}>
                  {isOpen ? 'Open' : 'Closed'}
                </Text>
              </View>
              <Icon name={showHours ? 'chevron-up' : 'chevron-down'} size={18} color="#9ca3af" />
            </View>
          </TouchableOpacity>

          {showHours && (
            <View style={{ marginTop: 16 }}>
              {openingHours.map((hour, i, arr) => {
                const isToday = hour.day === today;
                return (
                  <View
                    key={hour.day}
                    style={{
                      flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                      paddingVertical: 11,
                      paddingHorizontal: isToday ? 10 : 0,
                      marginHorizontal: isToday ? -2 : 0,
                      borderRadius: isToday ? 12 : 0,
                      backgroundColor: isToday ? '#fff1f2' : 'transparent',
                      borderBottomWidth: !isToday && i < arr.length - 1 ? 1 : 0,
                      borderBottomColor: '#f3f4f6',
                      marginBottom: isToday ? 2 : 0,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      {isToday && <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: ACCENT }} />}
                      <Text style={{ fontSize: 14, fontWeight: isToday ? '700' : '500', color: isToday ? ACCENT : '#374151' }}>
                        {hour.day}
                      </Text>
                    </View>
                    {hour.start && hour.end ? (
                      <Text style={{ fontSize: 13, fontWeight: '600', color: isToday ? ACCENT : '#059669' }}>
                        {hour.start} – {hour.end}
                      </Text>
                    ) : (
                      <View style={{ backgroundColor: '#fee2e2', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3 }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#ef4444' }}>Closed</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </SectionCard>

        {/* ══ Services ═════════════════════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeader
            title="Our Services"
            subtitle={`${MOCK_SERVICES.length} services available`}
            onEdit={() => navigation.navigate('ManageServices')}
          />

          {serviceCategories.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 14 }}>
              <TouchableOpacity
                onPress={() => setActiveCategory(null)}
                style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: !activeCategory ? ACCENT : '#f3f4f6' }}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: !activeCategory ? '#fff' : '#6b7280' }}>All</Text>
              </TouchableOpacity>
              {serviceCategories.map(cat => (
                <TouchableOpacity
                  key={cat.id} onPress={() => setActiveCategory(cat.id)} activeOpacity={0.8}
                  style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: activeCategory === cat.id ? ACCENT : '#fff1f2', borderWidth: 1.5, borderColor: activeCategory === cat.id ? ACCENT : '#fecdd3' }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '700', color: activeCategory === cat.id ? '#fff' : ACCENT }}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {MOCK_SERVICES.map(service => <ServiceCard key={service.id} service={service} />)}
        </SectionCard>

        {/* ══ Gallery — masonry grid ══════════════════════════════════════════ */}
        <SectionCard style={{ paddingHorizontal: 0, overflow: 'hidden' }}>
          <View style={{ paddingHorizontal: H_PAD }}>
            <SectionHeader title="Gallery" onViewAll={() => {}} />
          </View>
          <View style={{ flexDirection: 'row', paddingHorizontal: H_PAD, gap: 8 }}>
            {/* Left column */}
            <View style={{ flex: 1, gap: 8 }}>
              {MOCK_IMAGES.slice(0, 2).map((img, i) => (
                <Image key={i} source={img} style={{ width: '100%', height: i === 0 ? 140 : 100, borderRadius: 14 }} resizeMode="cover" />
              ))}
            </View>
            {/* Right column */}
            <View style={{ flex: 1, gap: 8 }}>
              {MOCK_IMAGES.slice(2, 4).map((img, i) => (
                <View key={i} style={{ position: 'relative' }}>
                  <Image source={img} style={{ width: '100%', height: i === 0 ? 100 : 140, borderRadius: 14 }} resizeMode="cover" />
                  {i === 1 && (
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.46)', borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900' }}>+12</Text>
                      <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 2 }}>More photos</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
          <View style={{ height: H_PAD }} />
        </SectionCard>

        {/* ══ Specialists ══════════════════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeader title="Our Specialists" subtitle="Meet the team" onViewAll={() => {}} />
          {specialists.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: 24, gap: 8 }}>
              <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff1f2', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="people-outline" size={28} color="#fda4af" />
              </View>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#374151' }}>No specialists yet</Text>
              <Text style={{ fontSize: 12, color: '#9ca3af' }}>Add your team to attract more customers</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('AddStaff')} activeOpacity={0.85}
                style={{ marginTop: 4, backgroundColor: ACCENT, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 9 }}
              >
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>+ Add Specialist</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {specialists.map(s => <SpecialistCard key={s._id} specialist={s} />)}
            </ScrollView>
          )}
        </SectionCard>

        {/* ══ Reviews ══════════════════════════════════════════════════════════ */}
        <SectionCard>
          <SectionHeader title="Reviews" onViewAll={() => {}} />

          {/* Rating summary */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: '#fff1f2', borderRadius: 16, padding: 14, marginBottom: 14 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 40, fontWeight: '900', color: ACCENT, lineHeight: 44 }}>{rating}</Text>
              <StarRow rating={Math.round(parseFloat(rating))} size={14} />
              <Text style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>{MOCK_REVIEWS.length} reviews</Text>
            </View>
            <View style={{ flex: 1, gap: 5 }}>
              {[
                { star: 5, pct: 70 },
                { star: 4, pct: 20 },
                { star: 3, pct: 6  },
                { star: 2, pct: 3  },
                { star: 1, pct: 1  },
              ].map(({ star, pct }) => (
                <View key={star} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 11, color: '#6b7280', width: 8 }}>{star}</Text>
                  <View style={{ flex: 1, height: 5, backgroundColor: '#fecdd3', borderRadius: 3, overflow: 'hidden' }}>
                    <View style={{ height: '100%', width: `${pct}%`, backgroundColor: ACCENT, borderRadius: 3 }} />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {MOCK_REVIEWS.map(review => <ReviewCard key={review.id} review={review} />)}
        </SectionCard>

      </ScrollView>
    </SafeAreaView>
  );
}