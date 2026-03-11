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

const INITIAL_SERVICES = [
  { id: 1, name: 'Full Arm Waxing', price: 600, qty: 1, icon: 'cut-outline',      iconColor: '#f43f5e', iconBg: '#fff1f2' },
  { id: 2, name: 'Leg Waxing',      price: 700, qty: 1, icon: 'leaf-outline',     iconColor: '#f43f5e', iconBg: '#fff1f2' },
  { id: 3, name: 'Acne Facial',     price: 500, qty: 1, icon: 'happy-outline',    iconColor: '#f43f5e', iconBg: '#fff1f2' },
];

const TIP_OPTIONS = [20, 50, 100, 200];
const DISCOUNT_LABEL = 'First Visit';
const DISCOUNT_AMOUNT = 280;

const CUSTOMER = {
  name: 'Ayesha',
  invoiceNo: 'INV-8829',
  date: 'Oct 24, 2023',
  time: '10:30 AM',
  initials: 'AY',
  avatarColor: '#fecdd3',
};

// ─── Avatar ───────────────────────────────────────────────────────────────────

const Avatar = ({ initials, color, size = 56 }) => (
  <View
    style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: color, alignItems: 'center', justifyContent: 'center',
    }}
  >
    <Text style={{ fontSize: size * 0.33, color: '#9f1239', fontWeight: '700' }}>
      {initials}
    </Text>
  </View>
);

// ─── Service Row ──────────────────────────────────────────────────────────────

const ServiceRow = ({ service, onIncrement, onDecrement, onDelete }) => (
  <View
    className="bg-white rounded-2xl flex-row items-center px-4 py-4 mb-3"
    style={{
      elevation: 2,
      shadowColor: '#f43f5e',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    }}
  >
    {/* Icon */}
    <View
      className="w-12 h-12 rounded-2xl items-center justify-center mr-3"
      style={{ backgroundColor: service.iconBg }}
    >
      <Icon name={service.icon} size={22} color={service.iconColor} />
    </View>

    {/* Name + Price */}
    <View style={{ flex: 1 }}>
      <Text className="font-semibold text-neutral-800" style={{ fontSize: 14 }}>
        {service.name}
      </Text>
      <Text style={{ color: '#14b8a6', fontWeight: '700', fontSize: 13, marginTop: 2 }}>
        ₹{(service.price * service.qty).toLocaleString()}
      </Text>
    </View>

    {/* Qty controls */}
    <View className="flex-row items-center" style={{ gap: 12 }}>
      <TouchableOpacity
        onPress={() => onDecrement(service.id)}
        className="w-7 h-7 rounded-full items-center justify-center"
        style={{ backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb' }}
        activeOpacity={0.7}
      >
        <Icon name="remove" size={14} color="#374151" />
      </TouchableOpacity>

      <Text className="font-bold text-neutral-800" style={{ fontSize: 15, minWidth: 16, textAlign: 'center' }}>
        {service.qty}
      </Text>

      <TouchableOpacity
        onPress={() => onIncrement(service.id)}
        className="w-7 h-7 rounded-full items-center justify-center"
        style={{ backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb' }}
        activeOpacity={0.7}
      >
        <Icon name="add" size={14} color="#374151" />
      </TouchableOpacity>
    </View>

    {/* Delete */}
    <TouchableOpacity
      onPress={() => onDelete(service.id)}
      className="w-8 h-8 rounded-full items-center justify-center ml-3"
      style={{ backgroundColor: '#f9fafb' }}
      activeOpacity={0.7}
    >
      <Icon name="trash-outline" size={16} color="#9ca3af" />
    </TouchableOpacity>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function BillingDetail({ navigation }) {
  const [services, setServices]     = useState(INITIAL_SERVICES);
  const [selectedTip, setSelectedTip] = useState(100);

  // ── service helpers
  const increment = (id) =>
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, qty: s.qty + 1 } : s));

  const decrement = (id) =>
    setServices((prev) =>
      prev.map((s) => s.id === id ? { ...s, qty: Math.max(1, s.qty - 1) } : s)
    );

  const deleteService = (id) => {
    Alert.alert('Remove Service', 'Remove this service from the bill?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () =>
          setServices((prev) => prev.filter((s) => s.id !== id))
      },
    ]);
  };

  const addService = () => Alert.alert('Add Service', 'Open service picker…');

  // ── totals
  const subtotal   = services.reduce((sum, s) => sum + s.price * s.qty, 0);
  const tip        = selectedTip;
  const discount   = DISCOUNT_AMOUNT;
  const grandTotal = subtotal + tip - discount;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={[]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* ── Top Nav ────────────────────────────────────────────────────── */}
      <View
        className="flex-row items-center justify-between px-4 py-3"
        style={{ borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}
      >
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          className="w-9 h-9 items-center justify-center rounded-full"
          style={{ backgroundColor: '#fff1f2' }}
        >
          <Icon name="arrow-back" size={20} color="#f43f5e" />
        </TouchableOpacity>

        <Text className="font-bold text-neutral-800" style={{ fontSize: 17 }}>
          Create Bill
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
        contentContainerStyle={{ paddingBottom: 140 }}
      >

        {/* ── Customer Info Card ──────────────────────────────────────── */}
        <View
          className="mx-4 mt-4 mb-5 bg-white rounded-3xl px-4 py-4 flex-row items-center"
          style={{
            borderWidth: 1, borderColor: '#f3f4f6',
            elevation: 2, shadowColor: '#000', shadowOpacity: 0.05,
            shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
            gap: 14,
          }}
        >
          <Avatar initials={CUSTOMER.initials} color={CUSTOMER.avatarColor} size={56} />
          <View>
            <Text className="font-bold text-neutral-800" style={{ fontSize: 20 }}>
              {CUSTOMER.name}
            </Text>
            <Text style={{ color: '#f43f5e', fontWeight: '700', fontSize: 13, marginTop: 2 }}>
              Bill #{CUSTOMER.invoiceNo}
            </Text>
            <View className="flex-row items-center mt-1" style={{ gap: 5 }}>
              <Icon name="calendar-outline" size={12} color="#9ca3af" />
              <Text style={{ color: '#9ca3af', fontSize: 12 }}>
                {CUSTOMER.date} • {CUSTOMER.time}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Services Section ─────────────────────────────────────────── */}
        <View className="px-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="font-bold text-neutral-800" style={{ fontSize: 20 }}>
              Services
            </Text>
            <View
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: '#f0fdfa' }}
            >
              <Text style={{ color: '#14b8a6', fontWeight: '700', fontSize: 12 }}>
                {services.length} ITEMS
              </Text>
            </View>
          </View>

          {services.map((service) => (
            <ServiceRow
              key={service.id}
              service={service}
              onIncrement={increment}
              onDecrement={decrement}
              onDelete={deleteService}
            />
          ))}

          {/* Add Service */}
          <TouchableOpacity
            onPress={addService}
            className="flex-row items-center justify-center rounded-2xl py-4 mb-6"
            style={{
              borderWidth: 1.5,
              borderColor: '#fda4af',
              borderStyle: 'dashed',
              backgroundColor: '#fff',
              gap: 8,
            }}
            activeOpacity={0.8}
          >
            <View
              className="w-6 h-6 rounded-full items-center justify-center"
              style={{ backgroundColor: '#f43f5e' }}
            >
              <Icon name="add" size={16} color="#fff" />
            </View>
            <Text style={{ color: '#f43f5e', fontWeight: '700', fontSize: 15 }}>
              Add Service
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Add a Tip ────────────────────────────────────────────────── */}
        <View className="px-4 mb-6">
          <Text className="font-bold text-neutral-800 mb-4" style={{ fontSize: 16 }}>
            Add a Tip
          </Text>
          <View className="flex-row" style={{ gap: 10 }}>
            {TIP_OPTIONS.map((tip) => {
              const active = selectedTip === tip;
              return (
                <TouchableOpacity
                  key={tip}
                  onPress={() => setSelectedTip(tip)}
                  className="flex-1 items-center justify-center py-3 rounded-full"
                  style={{
                    backgroundColor: active ? '#fff' : '#fff',
                    borderWidth: active ? 2 : 1,
                    borderColor: active ? '#f43f5e' : '#e5e7eb',
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={{
                      fontWeight: '700',
                      fontSize: 14,
                      color: active ? '#f43f5e' : '#374151',
                    }}
                  >
                    ₹{tip}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Bill Summary ─────────────────────────────────────────────── */}
        <View
          className="mx-4 rounded-3xl p-5"
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
          {/* Subtotal */}
          <View className="flex-row justify-between items-center py-3"
            style={{ borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}
          >
            <Text style={{ color: '#6b7280', fontSize: 14 }}>Subtotal</Text>
            <View className="flex-row items-center" style={{ gap: 8 }}>
              {/* PAID badge */}
              <View
                className="px-2 py-0.5 rounded-full"
                style={{ backgroundColor: '#14b8a6' }}
              >
                <Text style={{ color: '#fff', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 }}>
                  PAID
                </Text>
              </View>
              <Text className="font-semibold text-neutral-800" style={{ fontSize: 14 }}>
                ₹{subtotal.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Tip */}
          <View className="flex-row justify-between items-center py-3"
            style={{ borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}
          >
            <Text style={{ color: '#6b7280', fontSize: 14 }}>Tip Amount</Text>
            <Text className="font-semibold text-neutral-800" style={{ fontSize: 14 }}>
              ₹{tip}
            </Text>
          </View>

          {/* Discount */}
          <View className="flex-row justify-between items-center py-3"
            style={{ borderBottomWidth: 1, borderBottomColor: '#f3f4f6' }}
          >
            <View className="flex-row items-center" style={{ gap: 8 }}>
              <Text style={{ color: '#6b7280', fontSize: 14 }}>Discount</Text>
              <View
                className="px-2 py-0.5 rounded-full"
                style={{ backgroundColor: '#fff1f2', borderWidth: 1, borderColor: '#fecdd3' }}
              >
                <Text style={{ color: '#f43f5e', fontSize: 10, fontWeight: '700' }}>
                  {DISCOUNT_LABEL}
                </Text>
              </View>
            </View>
            <Text style={{ color: '#f43f5e', fontWeight: '700', fontSize: 14 }}>
              - ₹{discount}
            </Text>
          </View>

          {/* Grand Total */}
          <View className="flex-row justify-between items-center pt-4">
            <Text className="font-bold text-neutral-800" style={{ fontSize: 18 }}>
              Grand Total
            </Text>
            <Text style={{ color: '#14b8a6', fontWeight: '800', fontSize: 26 }}>
              ₹{grandTotal.toLocaleString()}
            </Text>
          </View>
        </View>

      </ScrollView>

      {/* ── Bottom Actions ────────────────────────────────────────────────── */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white px-4 pb-8 pt-4"
        style={{
          borderTopWidth: 1,
          borderTopColor: '#f3f4f6',
          elevation: 12,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: -4 },
        }}
      >
        {/* Print Bill */}
        <TouchableOpacity
          onPress={() => Alert.alert('Print', 'Sending to printer…')}
          className="flex-row items-center justify-center rounded-full py-4 mb-3"
          style={{ backgroundColor: '#f43f5e', gap: 10 }}
          activeOpacity={0.85}
        >
          <Icon name="print-outline" size={20} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>Print Bill</Text>
        </TouchableOpacity>

        {/* Share Invoice */}
        <TouchableOpacity
          onPress={() => Alert.alert('Share', 'Opening share sheet…')}
          className="flex-row items-center justify-center py-2"
          style={{ gap: 8 }}
          activeOpacity={0.75}
        >
          <Icon name="share-social-outline" size={17} color="#9ca3af" />
          <Text style={{ color: '#9ca3af', fontWeight: '600', fontSize: 14 }}>
            Share Invoice
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}