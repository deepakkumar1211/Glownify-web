import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Image,
  Modal,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

// ─── Constants ────────────────────────────────────────────────────────────────

const H_PAD = 16;
const BG = '#f9fafb';
const ACCENT = '#f43f5e';
const NAVY = '#2d3a5a';

const DURATION_OPTIONS = [
  '15 min', '30 min', '45 min', '1 hr', '1.5 hr', '2 hr', '2.5 hr', '3 hr',
];

const LIBRARY_IMAGES = [
  {
    id: 1,
    label: 'Hair Cut',
    uri: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=200&q=80',
  },
  {
    id: 2,
    label: 'Hair Styling',
    uri: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=200&q=80',
  },
  {
    id: 3,
    label: 'Hair Wash',
    uri: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&q=80',
  },
  {
    id: 4,
    label: 'Facial',
    uri: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=200&q=80',
  },
  {
    id: 5,
    label: 'Makeup',
    uri: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=200&q=80',
  },
];

const DEFAULT_ADDONS = [
  { id: 1, name: 'Hair Wash', price: '50', duration: '10 min', enabled: true },
  { id: 2, name: 'Head Massage', price: '100', duration: '15 min', enabled: true },
  { id: 3, name: 'Hair Styling', price: '150', duration: '20 min', enabled: true },
];

// ─── Small Components ─────────────────────────────────────────────────────────

const Label = ({ children }) => (
  <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
    {children}
  </Text>
);

const SectionTitle = ({ children }) => (
  <Text style={{ fontSize: 17, fontWeight: '800', color: '#1f2937', marginBottom: 16 }}>
    {children}
  </Text>
);

const inputStyle = {
  borderWidth: 1.5,
  borderColor: '#e5e7eb',
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 12,
  fontSize: 15,
  color: '#1f2937',
  backgroundColor: '#fff',
};

// ─── Duration Picker Modal ─────────────────────────────────────────────────────

const DurationPicker = ({ value, onChange }) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={[
          inputStyle,
          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
        ]}
        activeOpacity={0.8}
      >
        <Text style={{ fontSize: 15, color: '#1f2937' }}>{value}</Text>
        <Icon name="chevron-down" size={18} color="#6b7280" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 18,
              width: 220,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOpacity: 0.15,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            {DURATION_OPTIONS.map((opt, i) => (
              <TouchableOpacity
                key={opt}
                onPress={() => { onChange(opt); setVisible(false); }}
                style={{
                  paddingVertical: 14,
                  paddingHorizontal: 20,
                  borderBottomWidth: i < DURATION_OPTIONS.length - 1 ? 1 : 0,
                  borderBottomColor: '#f3f4f6',
                  backgroundColor: opt === value ? '#fff1f2' : '#fff',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ fontSize: 15, color: opt === value ? ACCENT : '#374151', fontWeight: opt === value ? '700' : '500' }}>
                  {opt}
                </Text>
                {opt === value && <Icon name="checkmark" size={16} color={ACCENT} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function AddServiceScreen({ navigation }) {
  const [serviceName, setServiceName] = useState('Hair Cutting');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('30 min');
  const [basePrice, setBasePrice] = useState('299');
  const [imageSource, setImageSource] = useState('library'); // 'library' | 'upload'
  const [selectedImage, setSelectedImage] = useState(1);
  const [addons, setAddons] = useState(DEFAULT_ADDONS);

  const toggleAddon = id =>
    setAddons(prev => prev.map(a => (a.id === id ? { ...a, enabled: !a.enabled } : a)));

  const handleAddAddon = () => {
    const newId = Date.now();
    setAddons(prev => [...prev, { id: newId, name: 'New Add-On', price: '0', duration: '10 min', enabled: true }]);
  };

  const handleSave = () => {
    if (!serviceName.trim()) {
      Alert.alert('Error', 'Please enter a service name.');
      return;
    }
    Alert.alert('Success', 'Service saved successfully!');
  };

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
          paddingTop: 10,
          paddingBottom: 14,
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: '#f3f4f6',
        }}
      >
        <TouchableOpacity onPress={() => navigation?.goBack()} activeOpacity={0.7}>
          <Icon name="chevron-back" size={26} color="#1f2937" />
        </TouchableOpacity>

        <Text style={{ fontSize: 18, fontWeight: '800', color: '#1f2937' }}>
          Add New Service
        </Text>

        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={{
            backgroundColor: '#f3f4f6',
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151' }}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: H_PAD, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ══ Basic Service Details ══════════════════════════════════════ */}
          <SectionTitle>Basic Service Details</SectionTitle>

          {/* Service Name */}
          <View style={{ marginBottom: 16 }}>
            <Label>Service Name</Label>
            <TextInput
              value={serviceName}
              onChangeText={setServiceName}
              placeholder="e.g. Hair Cutting"
              placeholderTextColor="#d1d5db"
              style={inputStyle}
            />
          </View>

          {/* Description */}
          <View style={{ marginBottom: 16 }}>
            <Label>Description</Label>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder={'Short description / about the service\nExample: Professional haircut with modern styling techniques.'}
              placeholderTextColor="#d1d5db"
              multiline
              numberOfLines={3}
              style={[inputStyle, { height: 90, textAlignVertical: 'top', paddingTop: 12 }]}
            />
          </View>

          {/* Duration + Base Price */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
            <View style={{ flex: 1 }}>
              <Label>Service Duration</Label>
              <DurationPicker value={duration} onChange={setDuration} />
            </View>
            <View style={{ flex: 1 }}>
              <Label>Base Price</Label>
              <View style={[inputStyle, { flexDirection: 'row', alignItems: 'center' }]}>
                <Text style={{ fontSize: 15, color: '#6b7280', marginRight: 4 }}>₹</Text>
                <TextInput
                  value={basePrice}
                  onChangeText={setBasePrice}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#d1d5db"
                  style={{ flex: 1, fontSize: 15, color: '#1f2937', padding: 0 }}
                />
              </View>
            </View>
          </View>

          {/* ── Divider ── */}
          <View style={{ height: 1, backgroundColor: '#e5e7eb', marginBottom: 20 }} />

          {/* ══ Service Image ══════════════════════════════════════════════ */}
          <SectionTitle>Service Image</SectionTitle>

          {/* Radio: Library */}
          <TouchableOpacity
            onPress={() => setImageSource('library')}
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
            activeOpacity={0.8}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: imageSource === 'library' ? NAVY : '#9ca3af',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}
            >
              {imageSource === 'library' && (
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: NAVY }} />
              )}
            </View>
            <Text style={{ fontSize: 15, color: '#1f2937', fontWeight: '500' }}>
              Choose from Glownify Library
            </Text>
          </TouchableOpacity>

          {/* Radio: Upload */}
          <TouchableOpacity
            onPress={() => setImageSource('upload')}
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
            activeOpacity={0.8}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: imageSource === 'upload' ? NAVY : '#9ca3af',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}
            >
              {imageSource === 'upload' && (
                <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: NAVY }} />
              )}
            </View>
            <Text style={{ fontSize: 15, color: '#1f2937', fontWeight: '500' }}>
              Upload Your Image
            </Text>
          </TouchableOpacity>

          {/* Library image grid */}
          {imageSource === 'library' && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10, paddingBottom: 4 }}
              style={{ marginBottom: 16 }}
            >
              {LIBRARY_IMAGES.map(img => {
                const selected = selectedImage === img.id;
                return (
                  <TouchableOpacity
                    key={img.id}
                    onPress={() => setSelectedImage(img.id)}
                    activeOpacity={0.85}
                    style={{ alignItems: 'center' }}
                  >
                    <View
                      style={{
                        width: 110,
                        height: 80,
                        borderRadius: 12,
                        overflow: 'hidden',
                        borderWidth: selected ? 2.5 : 0,
                        borderColor: selected ? NAVY : 'transparent',
                      }}
                    >
                      <Image
                        source={{ uri: img.uri }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                      />
                      {selected && (
                        <View
                          style={{
                            position: 'absolute',
                            top: 6,
                            right: 6,
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            backgroundColor: NAVY,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon name="checkmark" size={14} color="#fff" />
                        </View>
                      )}
                    </View>
                    <Text style={{ fontSize: 11, color: '#6b7280', marginTop: 6, fontWeight: '500' }}>
                      {img.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* Upload file row */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1.5,
              borderColor: '#e5e7eb',
              borderRadius: 12,
              overflow: 'hidden',
              marginBottom: 6,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: '#fff',
                paddingHorizontal: 18,
                paddingVertical: 12,
                borderRightWidth: 1.5,
                borderRightColor: '#e5e7eb',
              }}
              activeOpacity={0.8}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1f2937' }}>Upload File</Text>
            </TouchableOpacity>
            <View style={{ flex: 1, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, color: '#9ca3af' }}>Choose File</Text>
              <Icon name="chevron-forward" size={16} color="#9ca3af" />
            </View>
          </View>
          <Text style={{ fontSize: 12, color: '#9ca3af', marginBottom: 24 }}>Supported: JPG / PNG</Text>

          {/* ── Divider ── */}
          <View style={{ height: 1, backgroundColor: '#e5e7eb', marginBottom: 20 }} />

          {/* ══ Add-Ons ════════════════════════════════════════════════════ */}
          <Text style={{ fontSize: 17, fontWeight: '800', color: '#1f2937', marginBottom: 4 }}>
            Add Customizable Add-Ons
          </Text>
          <Text style={{ fontSize: 13, color: '#9ca3af', marginBottom: 16 }}>
            Allow customers to enhance this service with additional options
          </Text>

          {/* Add-ons table */}
          <View
            style={{
              borderWidth: 1.5,
              borderColor: '#e5e7eb',
              borderRadius: 14,
              overflow: 'hidden',
              marginBottom: 14,
            }}
          >
            {/* Table header */}
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#f9fafb',
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderBottomWidth: 1,
                borderBottomColor: '#e5e7eb',
              }}
            >
              {['Add-On Name', 'Price', 'Duration', 'Toggle'].map((h, i) => (
                <Text
                  key={h}
                  style={{
                    flex: i === 0 ? 2 : 1,
                    fontSize: 12,
                    fontWeight: '700',
                    color: '#6b7280',
                    textAlign: i === 3 ? 'center' : 'left',
                  }}
                >
                  {h}
                </Text>
              ))}
            </View>

            {/* Table rows */}
            {addons.map((addon, idx) => (
              <View
                key={addon.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 13,
                  paddingHorizontal: 14,
                  borderBottomWidth: idx < addons.length - 1 ? 1 : 0,
                  borderBottomColor: '#f3f4f6',
                  backgroundColor: '#fff',
                }}
              >
                <Text style={{ flex: 2, fontSize: 14, color: '#1f2937', fontWeight: '500' }}>
                  {addon.name}
                </Text>
                <Text style={{ flex: 1, fontSize: 14, color: '#374151' }}>
                  ₹ {addon.price}
                </Text>
                <Text style={{ flex: 1, fontSize: 14, color: '#374151' }}>
                  {addon.duration}
                </Text>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Switch
                    value={addon.enabled}
                    onValueChange={() => toggleAddon(addon.id)}
                    trackColor={{ false: '#d1d5db', true: '#4caf7d' }}
                    thumbColor="#fff"
                    ios_backgroundColor="#d1d5db"
                    style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Add New Add-On */}
          <TouchableOpacity
            onPress={handleAddAddon}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            activeOpacity={0.8}
          >
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: 11,
                borderWidth: 2,
                borderColor: NAVY,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
              }}
            >
              <Icon name="add" size={14} color={NAVY} />
            </View>
            <Text style={{ fontSize: 14, fontWeight: '700', color: NAVY }}>
              Add New Add-On
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* ── Footer Buttons ───────────────────────────────────────────── */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            paddingHorizontal: H_PAD,
            paddingTop: 14,
            paddingBottom: Platform.OS === 'ios' ? 32 : 20,
            borderTopWidth: 1,
            borderTopColor: '#f3f4f6',
            flexDirection: 'row',
            gap: 12,
            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: -4 },
            elevation: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={{
              flex: 1,
              paddingVertical: 15,
              borderRadius: 50,
              backgroundColor: '#f3f4f6',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#374151' }}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSave}
            style={{
              flex: 2,
              paddingVertical: 15,
              borderRadius: 50,
              backgroundColor: NAVY,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>Save Service</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}