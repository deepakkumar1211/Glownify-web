import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const BOOKING = {
  id: 1,
  customerName: 'Ayesha',
  service: 'Waxing + Facial',
  status: 'completed', // pending | accepted | completed | cancelled
  date: 'May 13, 2024',
  timeStart: '12:00 PM',
  timeEnd: '1:30 PM',
  duration: '90 mins',
  specialist: {
    name: 'Priya',
    role: 'Assigned Professional',
    initials: 'PR',
    avatarColor: '#fecdd3',
  },
  services: [
    { id: 1, name: 'Full Arm Waxing', price: 600 },
    { id: 2, name: 'Leg Waxing', price: 700 },
    { id: 3, name: 'Acne Facial', price: 500 },
  ],
  notes:
    '"Client preferred organic wax for arms. No allergies reported during facial session. Very satisfied with the glow."',
  initials: 'AY',
  avatarColor: '#fecdd3',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  completed:  { label: 'COMPLETED',  bg: '#f0fdf4', text: '#10b981' },
  accepted:   { label: 'ACCEPTED',   bg: '#f0fdf4', text: '#10b981' },
  pending:    { label: 'PENDING',    bg: '#fffbeb', text: '#f59e0b' },
  cancelled:  { label: 'CANCELLED', bg: '#fff1f2', text: '#f43f5e' },
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

const Avatar = ({ initials, color, size = 72 }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <Text style={{ fontSize: size * 0.32, color: '#9f1239', fontWeight: '700' }}>
      {initials}
    </Text>
  </View>
);

// ─── Section Label ────────────────────────────────────────────────────────────

const SectionLabel = ({ title, action, onAction }) => (
  <View className="flex-row justify-between items-center mb-4">
    <Text
      style={{ color: '#9ca3af', fontSize: 11, fontWeight: '700', letterSpacing: 1.4 }}
    >
      {title}
    </Text>
    {action && (
      <TouchableOpacity onPress={onAction} className="flex-row items-center" style={{ gap: 4 }}>
        <Icon name="pencil" size={13} color="#14b8a6" />
        <Text style={{ color: '#14b8a6', fontWeight: '700', fontSize: 13 }}>{action}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function BookingDetail({ navigation, route }) {
  const booking = route?.params?.booking ?? BOOKING;
  const [notes, setNotes] = useState(booking.notes);

  const statusCfg = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
  const grandTotal = booking.services.reduce((sum, s) => sum + s.price, 0);

  const handleCall      = () => Alert.alert('Call', `Calling ${booking.customerName}…`);
  const handleMessage   = () => Alert.alert('Message', `Opening chat with ${booking.customerName}…`);
  const handleReschedule= () => Alert.alert('Reschedule', 'Open reschedule flow…');
  const handleRebook    = () => Alert.alert('Rebook', 'Reboking appointment…');
  const handleCreateBill= () => {
    navigation.navigate('BillingDetail');
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={[]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* ── Top Nav ──────────────────────────────────────────────────────── */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white"
        style={{ borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}
      >
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          className="w-9 h-9 items-center justify-center rounded-full"
          style={{ backgroundColor: '#f9fafb' }}
        >
          <Icon name="arrow-back" size={20} color="#1f2937" />
        </TouchableOpacity>

        <Text className="font-bold text-neutral-800" style={{ fontSize: 17 }}>
          Booking Details
        </Text>

        <TouchableOpacity
          className="w-9 h-9 items-center justify-center rounded-full"
          style={{ backgroundColor: '#f9fafb' }}
        >
          <Icon name="ellipsis-vertical" size={20} color="#1f2937" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* ── Customer Hero ─────────────────────────────────────────────── */}
        <View className="px-5 pt-5 pb-6 flex-row items-center" style={{ gap: 16 }}>
          {/* Avatar with check badge */}
          <View>
            <Avatar initials={booking.initials} color={booking.avatarColor} size={72} />
            {booking.status === 'completed' && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 2,
                  right: 2,
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: '#14b8a6',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: '#fff',
                }}
              >
                <Icon name="checkmark" size={13} color="#fff" />
              </View>
            )}
          </View>

          {/* Name + service */}
          <View style={{ flex: 1 }}>
            <Text className="font-bold text-neutral-800" style={{ fontSize: 24 }}>
              {booking.customerName}
            </Text>
            <Text className="text-neutral-500" style={{ fontSize: 14, marginTop: 2 }}>
              {booking.service}
            </Text>
          </View>

          {/* Status badge */}
          <View
            className="rounded-full px-3 py-1.5"
            style={{ backgroundColor: statusCfg.bg }}
          >
            <Text style={{ color: statusCfg.text, fontSize: 11, fontWeight: '700', letterSpacing: 0.6 }}>
              {statusCfg.label}
            </Text>
          </View>
        </View>

        {/* ── Booking Information ───────────────────────────────────────── */}
        <View
          className="mx-4 rounded-3xl p-5 mb-4"
          style={{
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#f3f4f6',
            elevation: 2,
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <SectionLabel title="BOOKING INFORMATION" />

          {/* Date + Time */}
          <View className="flex-row items-center mb-4" style={{ gap: 14 }}>
            <View
              className="w-11 h-11 rounded-2xl items-center justify-center"
              style={{ backgroundColor: '#fff1f2' }}
            >
              <Icon name="calendar" size={22} color="#f43f5e" />
            </View>
            <View>
              <Text className="font-bold text-neutral-800" style={{ fontSize: 16 }}>
                {booking.date}
              </Text>
              <Text className="text-neutral-400" style={{ fontSize: 13, marginTop: 2 }}>
                {booking.timeStart} – {booking.timeEnd} ({booking.duration})
              </Text>
            </View>
          </View>

          {/* Specialist row */}
          <View
            className="flex-row items-center rounded-2xl px-4 py-3"
            style={{ backgroundColor: '#f9fafb', gap: 12 }}
          >
            <Avatar
              initials={booking.specialist.initials}
              color={booking.specialist.avatarColor}
              size={44}
            />
            <View style={{ flex: 1 }}>
              <Text className="font-semibold text-neutral-800" style={{ fontSize: 14 }}>
                {booking.specialist.name}
              </Text>
              <Text className="text-neutral-400" style={{ fontSize: 12, marginTop: 2 }}>
                {booking.specialist.role}
              </Text>
            </View>
            <View
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: '#14b8a6' }}
            >
              <Icon name="chatbubble" size={16} color="#fff" />
            </View>
          </View>
        </View>

        {/* ── Service Summary ───────────────────────────────────────────── */}
        <View
          className="mx-4 rounded-3xl p-5 mb-4"
          style={{
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#f3f4f6',
            elevation: 2,
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <SectionLabel title="SERVICE SUMMARY" />

          {booking.services.map((service, index) => (
            <View key={service.id}>
              <View className="flex-row justify-between items-center py-3">
                <Text className="text-neutral-700" style={{ fontSize: 15 }}>
                  {service.name}
                </Text>
                <Text className="font-semibold text-neutral-800" style={{ fontSize: 15 }}>
                  ₹{service.price.toLocaleString()}
                </Text>
              </View>
              {index < booking.services.length - 1 && (
                <View style={{ height: 1, backgroundColor: '#f3f4f6' }} />
              )}
            </View>
          ))}

          {/* Grand Total */}
          <View
            style={{ height: 1.5, backgroundColor: '#e5e7eb', marginVertical: 12 }}
          />
          <View className="flex-row justify-between items-center">
            <Text className="font-bold text-neutral-800" style={{ fontSize: 17 }}>
              Grand Total
            </Text>
            <Text style={{ color: '#f43f5e', fontWeight: '800', fontSize: 22 }}>
              ₹{grandTotal.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* ── Additional Notes ──────────────────────────────────────────── */}
        <View className="mx-4 mb-6">
          <SectionLabel
            title="ADDITIONAL NOTES"
            action="Edit"
            onAction={() => Alert.alert('Edit', 'Open notes editor')}
          />
          <View
            className="rounded-2xl p-4"
            style={{
              backgroundColor: '#f0fdfa',
              borderWidth: 1,
              borderColor: '#99f6e4',
            }}
          >
            <Text
              style={{ color: '#374151', fontSize: 14, lineHeight: 22, fontStyle: 'italic' }}
            >
              {notes}
            </Text>
          </View>
        </View>

        {/* ── Quick Actions Row ─────────────────────────────────────────── */}
        <View
          className="flex-row mx-4 mb-6 rounded-3xl bg-white"
          style={{
            borderWidth: 1,
            borderColor: '#f3f4f6',
            elevation: 2,
            shadowColor: '#000',
            shadowOpacity: 0.04,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            overflow: 'hidden',
          }}
        >
          {[
            { icon: 'call-outline',            label: 'Call',       color: '#f43f5e', onPress: handleCall },
            { icon: 'chatbubble-outline',       label: 'Message',    color: '#14b8a6', onPress: handleMessage },
            { icon: 'calendar-outline',         label: 'Reschedule', color: '#6b7280', onPress: handleReschedule },
          ].map((action, idx, arr) => (
            <TouchableOpacity
              key={action.label}
              onPress={action.onPress}
              className="flex-1 items-center justify-center py-4"
              style={{
                borderRightWidth: idx < arr.length - 1 ? 1 : 0,
                borderRightColor: '#f3f4f6',
              }}
              activeOpacity={0.75}
            >
              <View
                className="w-10 h-10 rounded-full items-center justify-center mb-1.5"
                style={{ backgroundColor: action.color + '15' }}
              >
                <Icon name={action.icon} size={20} color={action.color} />
              </View>
              <Text style={{ color: '#374151', fontSize: 12, fontWeight: '600' }}>
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* ── Bottom CTA Buttons ────────────────────────────────────────────── */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white px-4 pb-6 pt-3 flex-row"
        style={{
          gap: 12,
          borderTopWidth: 1,
          borderTopColor: '#f3f4f6',
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -4 },
        }}
      >
        {/* Rebook */}
        <TouchableOpacity
          onPress={handleRebook}
          className="flex-1 flex-row items-center justify-center rounded-full py-4"
          style={{
            borderWidth: 1.5,
            borderColor: '#f43f5e',
            backgroundColor: '#fff',
            gap: 8,
          }}
          activeOpacity={0.8}
        >
          <Icon name="refresh" size={18} color="#f43f5e" />
          <Text style={{ color: '#f43f5e', fontWeight: '700', fontSize: 15 }}>Rebook</Text>
        </TouchableOpacity>

        {/* Create Bill */}
        <TouchableOpacity
          onPress={handleCreateBill}
          className="flex-[2] flex-row items-center justify-center rounded-full py-4"
          style={{ backgroundColor: '#f43f5e', gap: 8 }}
          activeOpacity={0.85}
        >
          <Icon name="receipt-outline" size={18} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Create Bill</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}