import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

// ─── Constants ────────────────────────────────────────────────────────────────

const H_PAD = 16; // single source of truth for horizontal padding
const SECTION_GAP = 24; // vertical gap between sections

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_STATS = {
  todayEarnings: 5700,
  bookedToday: 23,
  pendingRequests: 5,
  totalCustomers: 863,
};

const MOCK_RECENT_BOOKINGS = [
  {
    id: 1,
    customer: 'Amit K.',
    service: 'Hair Color',
    duration: '1 hr',
    amount: 2500,
    status: 'pending',
    avatar: 'https://i.pravatar.cc/150?u=amit',
  },
  {
    id: 2,
    customer: 'Mehak S.',
    service: 'Full Body Massage',
    duration: '1.5 hr',
    amount: 2000,
    status: 'pending',
    avatar: 'https://i.pravatar.cc/150?u=mehak',
  },
  {
    id: 3,
    customer: 'Riya',
    service: 'Bridal Makeup',
    duration: '2 hr',
    amount: 5000,
    status: 'pending',
    avatar: 'https://i.pravatar.cc/150?u=riya',
  },
];

const MOCK_REVIEWS = [
  {
    id: 1,
    name: 'Neha T.',
    rating: 5,
    text: 'The bridal package was amazing! The staff was very professional and the results were exactly what I wanted.',
    initials: 'NT',
    avatarColor: '#fda4af',
  },
];

// Row 1 — 4 compact actions
const QUICK_ACTIONS_ROW1 = [
  {
    icon: 'add-outline',
    label: 'Add Service',
    iconColor: '#f43f5e',
    bg: '#fecdd3',
    navigateTo: 'AddService',
  },
  {
    icon: 'people-outline',
    label: 'Add Staff',
    iconColor: '#f97316',
    bg: '#ffedd5',
    navigateTo: 'AddStaff',
  },
  {
    icon: 'gift-outline',
    label: 'Create Offer',
    iconColor: '#ec4899',
    bg: '#fbcfe8',  
    navigateTo: 'CreateOffer',
  },
  {
    icon: 'document-text-outline',
    label: 'View Reports',
    iconColor: '#10b981',
    bg: '#d1fae5',
    navigateTo: 'ViewReports',
  },
];

// Row 2 — 2 wide actions
const QUICK_ACTIONS_ROW2 = [
  {
    icon: 'share-outline',
    label: 'Share',
    iconColor: '#f97316',
    bg: '#ffedd5',
    navigateTo: 'Share',
  },
  {
    icon: 'school-outline',
    label: 'Courses',
    iconColor: '#ec4899',
    bg: '#fbcfe8',
    navigateTo: 'Courses',
  },
];

// Stats config
const STATS_CONFIG = [
  {
    key: 'bookedToday',
    label: 'Booked Today',
    icon: 'calendar-outline',
    iconColor: '#f43f5e',
    iconBg: '#fecdd3',
    trend: '+3',
    trendUp: true,
    navigateTo: 'SalonBookings',
  },
  {
    key: 'pendingRequests',
    label: 'Pending',
    icon: 'time-outline',
    iconColor: '#f97316',
    iconBg: '#ffedd5',
    trend: '+2',
    trendUp: true,
    navigateTo: 'SalonPending',
  },
  {
    key: 'totalCustomers',
    label: 'Customers',
    icon: 'people-outline',
    iconColor: '#10b981',
    iconBg: '#d1fae5',
    trend: '+12',
    trendUp: true,
    navigateTo: 'SalonCustomers',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const cardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 10,
  elevation: 2,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const Avatar = ({ src, initials, color, size = 48 }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color || '#fecdd3',
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {src ? (
      <Image
        source={{ uri: src }}
        style={{ width: '100%', height: '100%', borderRadius: size / 2 }}
        resizeMode="cover"
      />
    ) : (
      <Text
        style={{ fontSize: size * 0.33, color: '#9f1239', fontWeight: '700' }}
      >
        {initials}
      </Text>
    )}
  </View>
);

// ── Stat Card ─────────────────────────────────────────────────────────────────

const StatCard = ({ config, value, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={{
      // width: '23%',
      flex: 1,
      gap: 5,
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 14,
      paddingVertical: 10,
      paddingHorizontal: 10,
      alignItems: 'center',
      // marginBottom: 12,
      flexDirection: 'row',
      ...cardShadow,
    }}
  >
    {/* Icon */}
    <View
      style={{
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: config.iconBg,
        alignItems: 'center',
        justifyContent: 'center',
        // marginBottom: 6,
      }}
    >
      <Icon name={config.icon} size={16} color={config.iconColor} />
    </View>

    <View>
      {/* Value */}
      <Text
        style={{
          fontSize: 16,
          fontWeight: '800',
          color: '#111827',
        }}
      >
        {value}
      </Text>

      {/* Label */}
      <Text
        numberOfLines={1}
        style={{
          fontSize: 10,
          color: '#6b7280',
          fontWeight: '600',
          marginTop: 2,
        }}
      >
        {config.label}
      </Text>
    </View>
  </TouchableOpacity>
);

// ── Quick Action Button ───────────────────────────────────────────────────────

const QuickActionBtn = ({ action, style, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    style={[
      {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: action.bg,
        borderRadius: 14,
        padding: 12,
        elevation: 1,
      },
      style,
    ]}
    onPress={onPress}
  >
    <View>
      <Icon name={action.icon} size={20} color={action.iconColor} />
    </View>
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 12,
          fontWeight: '600',
          color: '#374151',
        }}
      >
        {action.label}
      </Text>
    </View>
  </TouchableOpacity>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SalonAdminDashboard({ navigation }) {
  const [bookings, setBookings] = useState(MOCK_RECENT_BOOKINGS);

  const handleAccept = id =>
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'accepted' } : b)),
    );

  const handleDecline = id =>
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status: 'declined' } : b)),
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff1f2' }} edges={[]}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View
        style={{
          paddingHorizontal: H_PAD,
          paddingTop: 12,
          paddingBottom: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <View>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1f2937' }}>
            Hello, Glamour Salon 👋
          </Text>
        </View>

        <TouchableOpacity
          style={{ position: 'relative' }}
          onPress={() => navigation?.navigate('SalonNotifications')}
        >
          <Avatar src="https://i.pravatar.cc/150?u=salon_admin" size={44} />
          <View
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: '#f43f5e',
              borderWidth: 2,
              borderColor: '#fff1f2',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>
              3
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ── Promotional Banner ──────────────────────────────────────────── */}
        <View
          style={{
            marginHorizontal: H_PAD,
            marginTop: SECTION_GAP - 8,
            borderRadius: 20,
            overflow: 'hidden',
            backgroundColor: '#111827',
            paddingHorizontal: 20,
            paddingVertical: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 18,
                lineHeight: 24,
              }}
            >
              Create & Share{'\n'}Promotional Posters
            </Text>
            <TouchableOpacity
              style={{
                marginTop: 12,
                alignSelf: 'flex-start',
                borderRadius: 50,
                backgroundColor: '#f43f5e',
                paddingHorizontal: 20,
                paddingVertical: 9,
              }}
              activeOpacity={0.85}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>
                Try Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Stats Cards ─────────────────────────────────────────────────── */}
        <View
          style={{
            marginHorizontal: H_PAD,
            marginTop: SECTION_GAP,
            flexDirection: 'row',
            gap: 10,
            // flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          {STATS_CONFIG.map(config => (
            <StatCard
              key={config.key}
              config={config}
              value={MOCK_STATS[config.key]}
              onPress={() => navigation?.navigate(config.navigateTo)}
            />
          ))}
        </View>

        {/* ── Quick Actions ───────────────────────────────────────────────── */}
        <View style={{ marginHorizontal: H_PAD, marginTop: SECTION_GAP }}>
          {/* Row 1 — 4 equal compact buttons */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {QUICK_ACTIONS_ROW1.map(action => (
              <QuickActionBtn
                key={action.label}
                action={action}
                onPress={() => {
                  console.log(action.navigateTo);
                  console.log('pressed')
                  navigation.navigate(action.navigateTo)}}
                style={{ flex: 1, flexDirection: 'column', gap: 4 }}
              />
            ))}
          </View>

          {/* Row 2 — 2 wide 50/50 buttons */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            {QUICK_ACTIONS_ROW2.map(action => (
              <QuickActionBtn
                key={action.label}
                action={action}
                style={{ flex: 1, gap: 4 }}
              />
            ))}
          </View>
        </View>

        {/* ── Recent Bookings ─────────────────────────────────────────────── */}
        <View style={{ marginHorizontal: H_PAD, marginTop: SECTION_GAP }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <Text
              style={{ fontWeight: 'bold', color: '#1f2937', fontSize: 18 }}
            >
              Recent Bookings
            </Text>
            <TouchableOpacity
              onPress={() => navigation?.navigate('SalonBookings')}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Text
                style={{ color: '#f43f5e', fontSize: 14, fontWeight: '600' }}
              >
                View All
              </Text>
              <Icon name="chevron-forward" size={16} color="#f43f5e" />
            </TouchableOpacity>
          </View>

          {bookings.map(booking => (
            <View
              key={booking.id}
              style={{
                backgroundColor: '#fff',
                borderRadius: 14,
                padding: 14,
                marginBottom: 12,
                ...cardShadow,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                  }}
                >
                  <Avatar src={booking.avatar} size={48} />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: '#1f2937',
                        fontSize: 15,
                      }}
                    >
                      {booking.customer}
                    </Text>
                    <Text
                      style={{ color: '#9ca3af', fontSize: 13, marginTop: 2 }}
                    >
                      {booking.service} • {booking.duration}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{ fontWeight: 'bold', color: '#1f2937', fontSize: 15 }}
                >
                  ₹ {booking.amount.toLocaleString()}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 14,
                  paddingTop: 14,
                  borderTopWidth: 1,
                  borderTopColor: '#f3f4f6',
                }}
              >
                <Text style={{ color: '#9ca3af', fontSize: 12 }}>
                  May 12, 11:00 AM
                </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => handleAccept(booking.id)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 10,
                      backgroundColor: '#059669',
                    }}
                  >
                    <Text
                      style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}
                    >
                      Accept
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDecline(booking.id)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 10,
                      backgroundColor: '#e11d48',
                    }}
                  >
                    <Text
                      style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}
                    >
                      Decline
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* ── Recent Reviews ──────────────────────────────────────────────── */}
        <View style={{ marginHorizontal: H_PAD, marginTop: SECTION_GAP }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <Text
              style={{ fontWeight: 'bold', color: '#1f2937', fontSize: 18 }}
            >
              Recent Reviews
            </Text>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Text
                style={{ color: '#f43f5e', fontSize: 14, fontWeight: '600' }}
              >
                View All
              </Text>
              <Icon name="chevron-forward" size={16} color="#f43f5e" />
            </TouchableOpacity>
          </View>

          {MOCK_REVIEWS.map(review => (
            <View
              key={review.id}
              style={{
                backgroundColor: '#fff',
                borderRadius: 14,
                padding: 14,
                marginBottom: 12,
                ...cardShadow,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Avatar
                  initials={review.initials}
                  color={review.avatarColor}
                  size={44}
                />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: '#1f2937',
                          fontSize: 15,
                        }}
                      >
                        {review.name}
                      </Text>
                      <View style={{ flexDirection: 'row', marginLeft: 8 }}>
                        {[1, 2, 3, 4, 5].map(i => (
                          <Icon
                            key={i}
                            name="star"
                            size={10}
                            color={i <= review.rating ? '#fbbf24' : '#e5e7eb'}
                          />
                        ))}
                      </View>
                    </View>
                    <Text style={{ color: '#9ca3af', fontSize: 12 }}>
                      May 11
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: '#6b7280',
                      marginTop: 4,
                      fontSize: 13,
                      lineHeight: 18,
                    }}
                  >
                    Amazing experience! The staff was very professional and
                    friendly.
                  </Text>
                </View>
                <Icon
                  name="chevron-forward"
                  size={16}
                  color="#9ca3af"
                  style={{ marginLeft: 4 }}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
