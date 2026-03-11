import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalonServices } from '../../redux/slices/salonAdminSlice';

// Mock data for combo packages
const MOCK_COMBO_PACKAGES = [
  {
    _id: '1',
    name: 'Complete Hair Package',
    description: 'Haircut + Head Massage + Hair Wash',
    services: ['1', '2'], // Service IDs
    originalPrice: 250,
    comboPrice: 200,
    discount: 20,
    duration: 60,
  },
  {
    _id: '2',
    name: 'Facial + Threading',
    description: 'Facial treatment with Threading',
    services: ['3'],
    originalPrice: 300,
    comboPrice: 250,
    discount: 17,
    duration: 75,
  },
  {
    _id: '3',
    name: 'Bridal Package',
    description: 'Facial + Makeup + Hair Treatment',
    services: ['3', '4'],
    originalPrice: 800,
    comboPrice: 650,
    discount: 19,
    duration: 120,
  },
];

// Mock services data
const MOCK_SERVICES = [
  { _id: '1', name: 'Haircut', price: 150 },
  { _id: '2', name: 'Head Massage', price: 60 },
  { _id: '3', name: 'Facial', price: 250 },
  { _id: '4', name: 'Makeup', price: 400 },
  { _id: '5', name: 'Hair Spa', price: 300 },
  { _id: '6', name: 'Waxing', price: 200 },
];

export default function ComboPackagesScreen({ navigation }) {
  const dispatch = useDispatch();
  const { services = [] } = useSelector((state) => state.salonAdmin);

  const [displayCombos, setDisplayCombos] = useState(MOCK_COMBO_PACKAGES);
  const [comboModalVisible, setComboModalVisible] = useState(false);
  const [editingCombo, setEditingCombo] = useState(null);

  const [comboForm, setComboForm] = useState({
    name: '',
    description: '',
    serviceIds: [],
    originalPrice: '',
    comboPrice: '',
  });

  useEffect(() => {
    dispatch(fetchSalonServices());
  }, [dispatch]);

  const openAddComboModal = () => {
    setEditingCombo(null);
    setComboForm({
      name: '',
      description: '',
      serviceIds: [],
      originalPrice: '',
      comboPrice: '',
    });
    setComboModalVisible(true);
  };

  const openEditComboModal = (combo) => {
    setEditingCombo(combo);
    setComboForm({
      name: combo.name,
      description: combo.description,
      serviceIds: combo.services,
      originalPrice: combo.originalPrice.toString(),
      comboPrice: combo.comboPrice.toString(),
    });
    setComboModalVisible(true);
  };

  const calculateDiscount = (original, combo) => {
    if (!original || !combo) return 0;
    return Math.round(((original - combo) / original) * 100);
  };

  const handleSaveCombo = () => {
    if (
      !comboForm.name.trim() ||
      !comboForm.description.trim() ||
      comboForm.serviceIds.length === 0 ||
      !comboForm.originalPrice ||
      !comboForm.comboPrice
    ) {
      Alert.alert('Error', 'Please fill all fields and select at least one service');
      return;
    }

    const originalPrice = parseFloat(comboForm.originalPrice);
    const comboPrice = parseFloat(comboForm.comboPrice);

    if (comboPrice >= originalPrice) {
      Alert.alert('Error', 'Combo price must be less than original price');
      return;
    }

    const discount = calculateDiscount(originalPrice, comboPrice);

    if (editingCombo) {
      // Update combo
      setDisplayCombos(
        displayCombos.map((combo) =>
          combo._id === editingCombo._id
            ? {
                ...combo,
                name: comboForm.name,
                description: comboForm.description,
                services: comboForm.serviceIds,
                originalPrice,
                comboPrice,
                discount,
              }
            : combo
        )
      );
      Alert.alert('Success', 'Combo package updated');
    } else {
      // Add new combo
      const newCombo = {
        _id: Date.now().toString(),
        name: comboForm.name,
        description: comboForm.description,
        services: comboForm.serviceIds,
        originalPrice,
        comboPrice,
        discount,
        duration: 60,
      };
      setDisplayCombos([...displayCombos, newCombo]);
      Alert.alert('Success', 'Combo package created');
    }

    setComboModalVisible(false);
    setComboForm({
      name: '',
      description: '',
      serviceIds: [],
      originalPrice: '',
      comboPrice: '',
    });
  };

  const handleDeleteCombo = (comboId) => {
    Alert.alert('Delete Combo', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setDisplayCombos(displayCombos.filter((c) => c._id !== comboId));
          Alert.alert('Success', 'Combo deleted');
        },
      },
    ]);
  };

  const toggleServiceSelection = (serviceId) => {
    setComboForm((prev) => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(serviceId)
        ? prev.serviceIds.filter((id) => id !== serviceId)
        : [...prev.serviceIds, serviceId],
    }));
  };

  const getServiceName = (serviceId) => {
    return MOCK_SERVICES.find((s) => s._id === serviceId)?.name || 'Unknown';
  };

  const renderComboCard = (combo) => (
    <View key={combo._id} style={styles.comboCard}>
      <View style={styles.comboHeader}>
        <View style={styles.comboInfo}>
          <Text style={styles.comboName}>{combo.name}</Text>
          <Text style={styles.comboDescription}>{combo.description}</Text>
        </View>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{combo.discount}%</Text>
          <Text style={styles.offText}>OFF</Text>
        </View>
      </View>

      {/* Services List */}
      <View style={styles.servicesContainer}>
        <Text style={styles.servicesLabel}>Services Included:</Text>
        {combo.services.map((serviceId) => (
          <View key={serviceId} style={styles.serviceTag}>
            <Icon name="checkmark-circle" size={14} color="#4CAF50" />
            <Text style={styles.serviceTagText}>{getServiceName(serviceId)}</Text>
          </View>
        ))}
      </View>

      {/* Pricing */}
      <View style={styles.pricingContainer}>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Original Price:</Text>
          <Text style={styles.originalPrice}>₹{combo.originalPrice}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Combo Price:</Text>
          <Text style={styles.comboPrice}>₹{combo.comboPrice}</Text>
        </View>
        <View style={styles.savingsRow}>
          <Text style={styles.savingsLabel}>You Save:</Text>
          <Text style={styles.savingsAmount}>
            ₹{combo.originalPrice - combo.comboPrice}
          </Text>
        </View>
      </View>

      {/* Duration */}
      <View style={styles.durationBox}>
        <Icon name="time" size={16} color="#156778" />
        <Text style={styles.durationText}>Approx. {combo.duration} minutes</Text>
      </View>

      {/* Actions */}
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#156778' }]}
          onPress={() => openEditComboModal(combo)}
        >
          <Icon name="create-outline" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#f44336' }]}
          onPress={() => handleDeleteCombo(combo._id)}
        >
          <Icon name="trash-outline" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View  style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Combo Packages</Text>
            <Text style={styles.headerSubtitle}>Create special offers & packages</Text>
          </View>
        </View>

        {/* Add Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={openAddComboModal}
        >
          <Icon name="add-circle" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Create New Package</Text>
        </TouchableOpacity>

        {/* Combos List */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {displayCombos.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="gift-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No combo packages yet</Text>
              <Text style={styles.emptySubtext}>
                Create a combo to attract more customers!
              </Text>
            </View>
          ) : (
            displayCombos.map(renderComboCard)
          )}
        </ScrollView>
      </View>

      {/* Add/Edit Combo Modal */}
      <Modal
        visible={comboModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setComboModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setComboModalVisible(false)}>
                <Icon name="arrow-back" size={24} color="#156778" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {editingCombo ? 'Edit Package' : 'Create Package'}
              </Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={styles.modalContent}>
              {/* Package Name */}
              <Text style={styles.inputLabel}>Package Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Complete Hair Package"
                value={comboForm.name}
                onChangeText={(text) =>
                  setComboForm({ ...comboForm, name: text })
                }
                placeholderTextColor="#999"
              />

              {/* Description */}
              <Text style={styles.inputLabel}>Description *</Text>
              <TextInput
                style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
                placeholder="e.g., Haircut + Head Massage + Hair Wash"
                value={comboForm.description}
                onChangeText={(text) =>
                  setComboForm({ ...comboForm, description: text })
                }
                multiline
                placeholderTextColor="#999"
              />

              {/* Service Selection */}
              <Text style={styles.inputLabel}>Select Services *</Text>
              <View style={styles.serviceSelection}>
                {MOCK_SERVICES.map((service) => (
                  <TouchableOpacity
                    key={service._id}
                    style={[
                      styles.serviceCheckbox,
                      comboForm.serviceIds.includes(service._id) &&
                        styles.serviceCheckboxActive,
                    ]}
                    onPress={() => toggleServiceSelection(service._id)}
                  >
                    <Icon
                      name={
                        comboForm.serviceIds.includes(service._id)
                          ? 'checkbox'
                          : 'checkbox-outline'
                      }
                      size={20}
                      color={
                        comboForm.serviceIds.includes(service._id)
                          ? '#156778'
                          : '#ccc'
                      }
                    />
                    <View style={styles.serviceCheckboxContent}>
                      <Text style={styles.serviceCheckboxLabel}>
                        {service.name}
                      </Text>
                      <Text style={styles.serviceCheckboxPrice}>₹{service.price}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Original Price */}
              <Text style={styles.inputLabel}>Original Total Price (₹) *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 250"
                keyboardType="decimal-pad"
                value={comboForm.originalPrice}
                onChangeText={(text) =>
                  setComboForm({ ...comboForm, originalPrice: text })
                }
                placeholderTextColor="#999"
              />

              {/* Combo Price */}
              <Text style={styles.inputLabel}>Combo Price (₹) *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 200"
                keyboardType="decimal-pad"
                value={comboForm.comboPrice}
                onChangeText={(text) =>
                  setComboForm({ ...comboForm, comboPrice: text })
                }
                placeholderTextColor="#999"
              />

              {/* Discount Preview */}
              {comboForm.originalPrice && comboForm.comboPrice && (
                <View style={styles.discountPreview}>
                  <Text style={styles.discountPreviewLabel}>Discount:</Text>
                  <Text style={styles.discountPreviewValue}>
                    {calculateDiscount(
                      parseFloat(comboForm.originalPrice),
                      parseFloat(comboForm.comboPrice)
                    )}
                    % OFF (Save ₹
                    {parseFloat(comboForm.originalPrice) -
                      parseFloat(comboForm.comboPrice)})
                  </Text>
                </View>
              )}

              {/* Info Box */}
              <View style={styles.infoBox}>
                <Icon name="information-circle" size={18} color="#2196F3" />
                <Text style={styles.infoText}>
                  Combo packages help increase average booking value and customer satisfaction
                </Text>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveCombo}
              >
                <Icon name="checkmark" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>
                  {editingCombo ? 'Update Package' : 'Create Package'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#156778',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  backButton: {
    marginTop: 2,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#ddd',
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  comboCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderTopWidth: 3,
    borderTopColor: '#4CAF50',
  },
  comboHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  comboInfo: {
    flex: 1,
  },
  comboName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  comboDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  discountBadge: {
    backgroundColor: '#FF5722',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  offText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  servicesContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  servicesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  serviceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 6,
    marginBottom: 6,
    gap: 6,
  },
  serviceTagText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500',
  },
  pricingContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  comboPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4CAF50',
  },
  savingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  savingsLabel: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  savingsAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF5722',
  },
  durationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    gap: 8,
  },
  durationText: {
    fontSize: 12,
    color: '#1565C0',
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 6,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#bbb',
    marginTop: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  modalContent: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  serviceSelection: {
    marginBottom: 12,
  },
  serviceCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    gap: 10,
  },
  serviceCheckboxActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
  },
  serviceCheckboxContent: {
    flex: 1,
  },
  serviceCheckboxLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  serviceCheckboxPrice: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  discountPreview: {
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    marginBottom: 12,
  },
  discountPreviewLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E65100',
  },
  discountPreviewValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF5722',
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 12,
    color: '#1565C0',
    flex: 1,
    lineHeight: 16,
  },
  saveButton: {
    backgroundColor: '#156778',
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 24,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});