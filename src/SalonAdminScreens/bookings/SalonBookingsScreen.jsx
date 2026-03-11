import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

// ─── Constants ────────────────────────────────────────────────────────────────

const H_PAD = 16;
const BG = '#fce4ec'; // soft pink background

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_BOOKINGS = [
  {
    id: 1,
    customerName: 'Rahul P.',
    service: 'Bridal Makeup',
    specialist: 'Pooja S.',
    specialistIcon: 'timer-outline',
    date: 'May 13',
    time: '1:00 PM',
    duration: '2 hrs',
    status: 'pending',
    isNew: true,
    amount: 5000,
    totalAmount: 2500,
    initials: 'RP',
    avatar: 'https://i.pravatar.cc/150?u=rahul',
  },
  {
    id: 2,
    customerName: 'Ayesha',
    service: 'Waxing + Facial',
    specialist: 'Priya',
    specialistIcon: 'location-outline',
    date: 'May 13',
    time: '12:00 PM',
    duration: '1.5 hr',
    status: 'pending',
    isNew: true,
    amount: 1800,
    totalAmount: 1800,
    initials: 'AY',
    avatar: 'https://i.pravatar.cc/150?u=ayesha',
  },
  {
    id: 3,
    customerName: 'Sunil',
    service: 'Hair Cut + Shave',
    specialist: 'Ajay',
    specialistIcon: 'person-circle-outline',
    date: 'May 13',
    time: '11:00 AM',
    duration: '1.5 hr',
    status: 'pending',
    isNew: false,
    amount: 900,
    totalAmount: 900,
    initials: 'SU',
    avatar: 'https://i.pravatar.cc/150?u=sunil',
  },
  {
    id: 4,
    customerName: 'Mehak S.',
    service: 'Spa Manicure',
    specialist: 'Pooja S.',
    specialistIcon: 'storefront-outline',
    date: 'May 13',
    time: '10:30 AM',
    duration: '45 min',
    status: 'pending',
    isNew: false,
    amount: 600,
    totalAmount: 600,
    initials: 'MS',
    avatar: 'https://i.pravatar.cc/150?u=mehak',
  },
  {
    id: 5,
    customerName: 'Amit K.',
    service: 'Full Grooming',
    serviceSubtitle: '(Haircut, Shave, & Massage)',
    specialist: 'Rohit',
    specialistIcon: 'cut-outline',
    date: 'May 13',
    time: '10:00 AM',
    duration: '1.5 hrs',
    status: 'pending',
    isNew: false,
    amount: 1500,
    totalAmount: 1500,
    initials: 'AK',
    avatar: 'https://i.pravatar.cc/150?u=amit2',
  },
  {
    id: 6,
    customerName: 'Anjali Verma',
    service: 'Coloring',
    specialist: 'Raj Kumar',
    specialistIcon: 'person-outline',
    date: 'May 16',
    time: '11:00 AM',
    duration: '2 hrs',
    status: 'accepted',
    isNew: false,
    amount: 2200,
    totalAmount: 2200,
    initials: 'AV',
    avatar: 'https://i.pravatar.cc/150?u=anjali',
  },
  {
    id: 7,
    customerName: 'Vikram Singh',
    service: 'Beard Trim',
    specialist: 'Arjun Reddy',
    specialistIcon: 'person-outline',
    date: 'May 10',
    time: '3:00 PM',
    duration: '30 min',
    status: 'completed',
    isNew: false,
    amount: 800,
    totalAmount: 800,
    initials: 'VS',
    avatar: 'https://i.pravatar.cc/150?u=vikram',
  },
];

const STATUS_TABS = ['All', 'Ongoing', 'Completed', 'Cancelled'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getStatusFilter = tab => {
  switch (tab) {
    case 'Ongoing': return ['accepted'];
    case 'Completed': return ['completed'];
    case 'Cancelled': return ['declined'];
    default: return ['pending', 'accepted', 'completed', 'declined'];
  }
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

const Avatar = ({ src, initials, size = 56 }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: '#e5e7eb',
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {src ? (
      <Image
        source={{ uri: src }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        resizeMode="cover"
      />
    ) : (
      <Text style={{ fontSize: size * 0.32, color: '#374151', fontWeight: '700' }}>
        {initials}
      </Text>
    )}
  </View>
);

// ─── Booking Card ─────────────────────────────────────────────────────────────

const BookingCard = ({ booking, onAccept, onDecline }) => {
  const navigation = useNavigation();
  const isPending = booking.status === 'pending';

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('BookingDetail')}
      activeOpacity={0.92}
      style={{
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 14,
        marginBottom: 12,
        shadowColor: '#f9a8b8',
        shadowOpacity: 0.18,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
      }}
    >
      {/* ── Top row: avatar + name/service + NEW badge + amount ── */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <Avatar src={booking.avatar} initials={booking.initials} size={56} />

        <View style={{ flex: 1, marginLeft: 12 }}>
          {/* Name row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: '#1f2937' }}>
              {booking.customerName}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {booking.isNew && (
                <View
                  style={{
                    backgroundColor: '#fff3e0',
                    borderRadius: 20,
                    paddingHorizontal: 10,
                    paddingVertical: 3,
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#f97316' }}>New</Text>
                </View>
              )}
            </View>
          </View>

          {/* Service */}
          <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 2 }}>
            {booking.service}
          </Text>
          {booking.serviceSubtitle ? (
            <Text style={{ fontSize: 13, color: '#9ca3af', marginTop: 1 }}>
              {booking.serviceSubtitle}
            </Text>
          ) : null}

          {/* Date + Specialist + Amount inline row */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 8,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="calendar-outline" size={13} color="#9ca3af" />
              <Text style={{ fontSize: 12, color: '#6b7280' }}>
                {booking.date}, {booking.time}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="person-circle-outline" size={13} color="#9ca3af" />
              <Text style={{ fontSize: 12, color: '#6b7280' }}>{booking.specialist}</Text>
            </View>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#1f2937' }}>
              ₹ {booking.amount.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Divider ── */}
      <View style={{ height: 1, backgroundColor: '#f9f0f2', marginVertical: 12 }} />

      {/* ── Bottom row: Total + amount + duration + action buttons ── */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left: Total label + amount + duration */}
        {isPending && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 13, color: '#9ca3af', fontWeight: '500' }}>Total</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              {/* <Icon name="image-outline" size={13} color="#9ca3af" /> */}
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#374151' }}>
                ₹{booking.totalAmount.toLocaleString()}
              </Text>
            </View>
            <View
              style={{
                width: 1,
                height: 14,
                backgroundColor: '#e5e7eb',
              }}
            />
            <Text style={{ fontSize: 12, color: '#9ca3af' }}>{booking.duration}</Text>
          </View>
        )}

        {/* Status badge for non-pending */}
        {!isPending && (
          <View
            style={{
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 5,
              backgroundColor:
                booking.status === 'accepted' ? '#f0fdf4'
                  : booking.status === 'completed' ? '#eff6ff'
                  : '#fff1f2',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '700',
                textTransform: 'capitalize',
                color:
                  booking.status === 'accepted' ? '#10b981'
                    : booking.status === 'completed' ? '#3b82f6'
                    : '#f43f5e',
              }}
            >
              {booking.status}
            </Text>
          </View>
        )}

        {/* Action buttons */}
        {isPending && (
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
        )}
      </View>
    </TouchableOpacity>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function SalonBookingsScreen({ navigation }) {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [activeTab, setActiveTab] = useState('All');

  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  const handleAccept = id => {
    Alert.alert('Booking Accepted', 'Specialist has been notified.');
    setBookings(prev => prev.map(b => (b.id === id ? { ...b, status: 'accepted' } : b)));
  };

  const handleDecline = id => {
    Alert.alert('Booking Declined', 'Customer has been notified.');
    setBookings(prev => prev.map(b => (b.id === id ? { ...b, status: 'declined' } : b)));
  };

  const allowedStatuses = getStatusFilter(activeTab);
  const filtered = bookings.filter(b => allowedStatuses.includes(b.status));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={[]}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: H_PAD,
          paddingTop: 8,
          paddingBottom: 12,
          backgroundColor: BG,
        }}
      >
        {/* Back */}
        <TouchableOpacity onPress={() => navigation?.goBack()} activeOpacity={0.7}>
          <Icon name="chevron-back" size={26} color="#e91e63" />
        </TouchableOpacity>

        <Text style={{ fontSize: 18, fontWeight: '700', color: '#1f2937' }}>
          New Booking Requests
        </Text>

        {/* Avatar with badge */}
        <View style={{ position: 'relative' }}>
          <Avatar src="https://i.pravatar.cc/150?u=salon_admin_f" size={40} />
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
              borderColor: BG,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>3</Text>
          </View>
        </View>
      </View>

      {/* ── Pending count bar ────────────────────────────────────────────── */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: H_PAD,
          marginBottom: 14,
          backgroundColor: 'white',
          paddingVertical: 12,
          paddingHorizontal: H_PAD,
          borderRadius: 8,
        }}
      >
        {/* Left: clock + count text */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="time-outline" size={17} color="#f59e0b" />
          </View>
          <Text style={{ fontSize: 15, fontWeight: '600', color: '#374151' }}>
            <Text style={{ fontWeight: '800', color: '#1f2937' }}>{pendingCount}</Text>
            {' '}Pending Requests
          </Text>
        </View>

        {/* Right: History pill */}
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: BG,
            borderRadius: 20,
            paddingHorizontal: 14,
            paddingVertical: 8,
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 6,
            elevation: 2,
          }}
          activeOpacity={0.8}
        >
          <Icon name="menu-outline" size={16} color="#374151" />
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151' }}>History</Text>
        </TouchableOpacity>
      </View>

      {/* ── Status Tabs — pill style ──────────────────────────────────────── */}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: H_PAD,
          marginBottom: 14,
          gap: 8,
          backgroundColor: BG,
        }}
      >
        {STATUS_TABS.map(tab => {
          const active = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 9,
                borderRadius: 22,
                backgroundColor: active ? '#f06292' : '#fff',
              }}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: active ? '700' : '500',
                  color: active ? '#fff' : '#9ca3af',
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Booking List ─────────────────────────────────────────────────── */}
      <ScrollView
        style={{ flex: 1, backgroundColor: BG }}
        contentContainerStyle={{
          paddingHorizontal: H_PAD,
          paddingTop: 4,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 80 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: '#fce4ec',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Icon name="calendar-outline" size={34} color="#f48fb1" />
            </View>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#374151' }}>
              No bookings here
            </Text>
            <Text style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>
              Nothing in "{activeTab}" yet
            </Text>
          </View>
        ) : (
          filtered.map(booking => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}