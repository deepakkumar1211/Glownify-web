import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { logout } from '../../redux/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';

// ─── Constants ────────────────────────────────────────────────────────────────

const H_PAD = 16;
const BG = '#fff1f2';
const ACCENT = '#f43f5e';
const NAVY = '#2d3a5a';

const cardShadow = {
  shadowColor: '#f43f5e',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 3,
};

// ─── Small helpers ────────────────────────────────────────────────────────────

const SectionTitle = ({ children }) => (
  <Text style={{ fontSize: 16, fontWeight: '800', color: '#1f2937', marginBottom: 12 }}>
    {children}
  </Text>
);

const InfoRow = ({ icon, label, value }) => (
  <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 }}>
    <View
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#fecdd3',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
      }}
    >
      <Icon name={icon} size={17} color={ACCENT} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 11, color: '#9ca3af', fontWeight: '600', marginBottom: 2 }}>
        {label.toUpperCase()}
      </Text>
      <Text style={{ fontSize: 14, color: '#1f2937', fontWeight: '600', lineHeight: 20 }}>
        {value || 'N/A'}
      </Text>
    </View>
  </View>
);

const MenuRow = ({ icon, iconBg, iconColor, label, value, onPress, danger }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.75}
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: '#fce7eb',
    }}
  >
    <View
      style={{
        width: 38,
        height: 38,
        borderRadius: 11,
        backgroundColor: iconBg || '#fecdd3',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 13,
      }}
    >
      <Icon name={icon} size={18} color={iconColor || ACCENT} />
    </View>
    <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: danger ? '#ef4444' : '#1f2937' }}>
      {label}
    </Text>
    {value ? (
      <Text style={{ fontSize: 13, color: '#9ca3af', marginRight: 6 }}>{value}</Text>
    ) : null}
    <Icon name="chevron-forward" size={16} color={danger ? '#fca5a5' : '#d1d5db'} />
  </TouchableOpacity>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function SalonProfileScreen() {
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
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => dispatch(logout()) },
    ]);
  };

  const handleEdit = () => Alert.alert('Edit Profile', 'Edit functionality coming soon!');
  const handleUpgrade = () => Alert.alert('Upgrade Plan', 'Subscription upgrade coming soon!');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }} edges={[]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        {/* ── Hero Header ─────────────────────────────────────────────────── */}
        <View
          style={{
            backgroundColor: '#fff',
            paddingHorizontal: H_PAD,
            paddingTop: 16,
            paddingBottom: 24,
            borderBottomLeftRadius: 28,
            borderBottomRightRadius: 28,
            ...cardShadow,
          }}
        >
          {/* Top bar */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: '800', color: '#1f2937' }}>My Profile</Text>
            <TouchableOpacity
              onPress={handleEdit}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                backgroundColor: '#fff1f2',
                borderRadius: 20,
                paddingHorizontal: 14,
                paddingVertical: 8,
              }}
              activeOpacity={0.8}
            >
              <Icon name="pencil-outline" size={14} color={ACCENT} />
              <Text style={{ fontSize: 13, fontWeight: '700', color: ACCENT }}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Avatar + name + rating */}
          <View style={{ alignItems: 'center' }}>
            <View style={{ position: 'relative', marginBottom: 12 }}>
              <Image
                source={{
                  uri: galleryImages[0] || 'https://i.pravatar.cc/150?u=salon_glamour',
                }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  borderWidth: 3,
                  borderColor: '#fecdd3',
                }}
              />
              {/* Verified badge */}
              <View
                style={{
                  position: 'absolute',
                  bottom: 2,
                  right: 2,
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  backgroundColor: '#10b981',
                  borderWidth: 2,
                  borderColor: '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="checkmark" size={13} color="#fff" />
              </View>
            </View>

            <Text style={{ fontSize: 20, fontWeight: '800', color: '#1f2937', marginBottom: 4 }}>
              {roleDetails?.shopName || user?.name || 'Glamour Salon'}
            </Text>

            {/* Rating pill */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                backgroundColor: '#fff7ed',
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 5,
                marginBottom: 8,
              }}
            >
              <Icon name="star" size={13} color="#f59e0b" />
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#92400e' }}>4.8</Text>
              <Text style={{ fontSize: 12, color: '#d97706' }}>(245 reviews)</Text>
            </View>

            {/* Location pill */}
            {location?.city ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="location-outline" size={13} color="#9ca3af" />
                <Text style={{ fontSize: 13, color: '#9ca3af', fontWeight: '500' }}>
                  {location.city}{location.state ? `, ${location.state}` : ''}
                </Text>
              </View>
            ) : null}
          </View>

          {/* ── Quick Stats ── */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              backgroundColor: '#fff1f2',
              borderRadius: 16,
              padding: 14,
              gap: 0,
            }}
          >
            {[
              { icon: 'business-outline', label: 'Shop Type', value: roleDetails?.shopType || 'N/A' },
              { icon: 'cut-outline', label: 'Category', value: roleDetails?.salonCategory || 'N/A' },
              { icon: 'home-outline', label: 'Home Service', value: roleDetails?.offersHomeService ? 'Available' : 'No' },
            ].map((stat, i, arr) => (
              <React.Fragment key={stat.label}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: '#fecdd3',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 6,
                    }}
                  >
                    <Icon name={stat.icon} size={17} color={ACCENT} />
                  </View>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#1f2937', textAlign: 'center', textTransform: 'capitalize' }}>
                    {stat.value}
                  </Text>
                  <Text style={{ fontSize: 10, color: '#9ca3af', marginTop: 2, fontWeight: '500' }}>
                    {stat.label}
                  </Text>
                </View>
                {i < arr.length - 1 && (
                  <View style={{ width: 1, backgroundColor: '#fecdd3', marginVertical: 4 }} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* ── Subscription Card ────────────────────────────────────────────── */}
        <View style={{ marginHorizontal: H_PAD, marginTop: 20 }}>
          <SectionTitle>Subscription</SectionTitle>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 18,
              overflow: 'hidden',
              ...cardShadow,
            }}
          >
            {/* Plan banner */}
            <View
              style={{
                backgroundColor: isPaid ? NAVY : '#fff7ed',
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View>
                <Text style={{ fontSize: 11, color: isPaid ? '#93c5fd' : '#d97706', fontWeight: '600', marginBottom: 3 }}>
                  CURRENT PLAN
                </Text>
                <Text style={{ fontSize: 18, fontWeight: '800', color: isPaid ? '#fff' : '#92400e' }}>
                  {subscription?.planId || 'No Active Plan'}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  backgroundColor: isPaid ? 'rgba(255,255,255,0.15)' : '#fff3e0',
                  borderRadius: 20,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Icon
                  name={isPaid ? 'checkmark-circle' : 'time-outline'}
                  size={14}
                  color={isPaid ? '#34d399' : '#f59e0b'}
                />
                <Text style={{ fontSize: 12, fontWeight: '700', color: isPaid ? '#34d399' : '#f59e0b' }}>
                  {subscription?.paymentStatus?.toUpperCase() || 'N/A'}
                </Text>
              </View>
            </View>

            {/* Warning if pending */}
            {!isPaid && subscription?.planId && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  backgroundColor: '#fff7ed',
                  padding: 14,
                  borderTopWidth: 1,
                  borderTopColor: '#fde68a',
                }}
              >
                <Icon name="warning-outline" size={18} color="#f59e0b" />
                <Text style={{ flex: 1, fontSize: 12, color: '#92400e', lineHeight: 18 }}>
                  Payment pending. Complete payment to activate your plan.
                </Text>
              </View>
            )}

            {/* Upgrade button */}
            {!isPaid && (
              <TouchableOpacity
                onPress={handleUpgrade}
                style={{
                  margin: 14,
                  backgroundColor: ACCENT,
                  borderRadius: 12,
                  paddingVertical: 13,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 8,
                }}
                activeOpacity={0.85}
              >
                <Icon name="flash-outline" size={16} color="#fff" />
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>Upgrade Plan</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── Contact & Location ───────────────────────────────────────────── */}
        <View style={{ marginHorizontal: H_PAD, marginTop: 20 }}>
          <SectionTitle>Contact & Location</SectionTitle>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 18,
              padding: 16,
              ...cardShadow,
            }}
          >
            <InfoRow
              icon="location-outline"
              label="Address"
              value={[location?.address, location?.city, location?.state].filter(Boolean).join(', ') + (location?.pincode ? ` - ${location.pincode}` : '')}
            />
            <InfoRow
              icon="mail-outline"
              label="Email"
              value={user?.email}
            />
            {roleDetails?.contactNumber && (
              <InfoRow
                icon="call-outline"
                label="Phone"
                value={roleDetails.contactNumber}
              />
            )}
            {roleDetails?.whatsappNumber && (
              <InfoRow
                icon="logo-whatsapp"
                label="WhatsApp"
                value={roleDetails.whatsappNumber}
              />
            )}
            {governmentId?.idNumber && (
              <InfoRow
                icon="card-outline"
                label={governmentId.idType || 'Government ID'}
                value={governmentId.idNumber}
              />
            )}
          </View>
        </View>

        {/* ── Account Settings ─────────────────────────────────────────────── */}
        <View style={{ marginHorizontal: H_PAD, marginTop: 20 }}>
          <SectionTitle>Account</SectionTitle>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 18,
              paddingHorizontal: 16,
              ...cardShadow,
            }}
          >
            <MenuRow
              icon="create-outline"
              iconBg="#fecdd3"
              iconColor={ACCENT}
              label="Edit Profile"
              onPress={handleEdit}
            />
            <MenuRow
              icon="notifications-outline"
              iconBg="#dbeafe"
              iconColor="#3b82f6"
              label="Notifications"
              onPress={() => {}}
            />
            <MenuRow
              icon="shield-checkmark-outline"
              iconBg="#d1fae5"
              iconColor="#10b981"
              label="Privacy & Security"
              onPress={() => {}}
            />
            <MenuRow
              icon="help-circle-outline"
              iconBg="#ede9fe"
              iconColor="#8b5cf6"
              label="Help & Support"
              onPress={() => {}}
            />
            <MenuRow
              icon="log-out-outline"
              iconBg="#fee2e2"
              iconColor="#ef4444"
              label="Logout"
              onPress={handleLogout}
              danger
            />
          </View>
        </View>

        {/* ── App version ── */}
        <Text style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: '#d1d5db' }}>
          Glownify v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}