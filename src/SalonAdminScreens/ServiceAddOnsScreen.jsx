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

// Mock data for services with add-ons
const MOCK_SERVICES_WITH_ADDONS = [
  {
    _id: '1',
    name: 'Haircut',
    category: 'Haircut',
    price: 150,
    durationMins: 30,
    addOns: [
      { _id: '101', name: 'Head Massage', price: 60, type: 'optional' },
      { _id: '102', name: 'Hair Wash', price: 40, type: 'recommended' },
      { _id: '103', name: 'Beard Trim', price: 30, type: 'optional' },
    ],
  },
  {
    _id: '2',
    name: 'Hair Spa',
    category: 'Hair Spa',
    price: 300,
    durationMins: 45,
    addOns: [
      { _id: '201', name: 'Hair Cut', price: 150, type: 'optional' },
      { _id: '202', name: 'Blow Dry', price: 50, type: 'optional' },
    ],
  },
  {
    _id: '3',
    name: 'Facial',
    category: 'Facial',
    price: 250,
    durationMins: 45,
    addOns: [
      { _id: '301', name: 'Neck Massage', price: 100, type: 'recommended' },
      { _id: '302', name: 'Face Pack', price: 80, type: 'optional' },
      { _id: '303', name: 'Threading', price: 50, type: 'optional' },
    ],
  },
  {
    _id: '4',
    name: 'Waxing',
    category: 'Waxing',
    price: 200,
    durationMins: 30,
    addOns: [
      { _id: '401', name: 'After Wax Lotion', price: 30, type: 'recommended' },
    ],
  },
];

export default function ServiceAddOnsScreen({ navigation }) {
  const dispatch = useDispatch();
  const { services = [] } = useSelector((state) => state.salonAdmin);

  const [displayServices, setDisplayServices] = useState(MOCK_SERVICES_WITH_ADDONS);
  const [selectedService, setSelectedService] = useState(null);
  const [addOnModalVisible, setAddOnModalVisible] = useState(false);
  const [editingAddOn, setEditingAddOn] = useState(null);

  const [addOnForm, setAddOnForm] = useState({
    name: '',
    price: '',
    type: 'optional',
  });

  useEffect(() => {
    dispatch(fetchSalonServices());
  }, [dispatch]);

  const openAddOnModal = (service, addOn = null) => {
    setSelectedService(service);
    if (addOn) {
      setEditingAddOn(addOn);
      setAddOnForm({
        name: addOn.name,
        price: addOn.price.toString(),
        type: addOn.type,
      });
    } else {
      setEditingAddOn(null);
      setAddOnForm({
        name: '',
        price: '',
        type: 'optional',
      });
    }
    setAddOnModalVisible(true);
  };

  const handleSaveAddOn = () => {
    if (!addOnForm.name.trim() || !addOnForm.price.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (isNaN(parseFloat(addOnForm.price))) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    setDisplayServices(
      displayServices.map((service) =>
        service._id === selectedService._id
          ? {
              ...service,
              addOns: editingAddOn
                ? service.addOns.map((addon) =>
                    addon._id === editingAddOn._id
                      ? {
                          ...addon,
                          name: addOnForm.name,
                          price: parseFloat(addOnForm.price),
                          type: addOnForm.type,
                        }
                      : addon
                  )
                : [
                    ...service.addOns,
                    {
                      _id: Date.now().toString(),
                      name: addOnForm.name,
                      price: parseFloat(addOnForm.price),
                      type: addOnForm.type,
                    },
                  ],
            }
          : service
      )
    );

    Alert.alert(
      'Success',
      editingAddOn ? 'Add-on updated' : 'Add-on added'
    );
    setAddOnModalVisible(false);
    setAddOnForm({ name: '', price: '', type: 'optional' });
    setEditingAddOn(null);
    setSelectedService(null);
  };

  const handleDeleteAddOn = (serviceId, addOnId) => {
    Alert.alert('Delete Add-on', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setDisplayServices(
            displayServices.map((service) =>
              service._id === serviceId
                ? {
                    ...service,
                    addOns: service.addOns.filter(
                      (addon) => addon._id !== addOnId
                    ),
                  }
                : service
            )
          );
          Alert.alert('Success', 'Add-on deleted');
        },
      },
    ]);
  };

  const getTypeColor = (type) => {
    return type === 'recommended' ? '#FF9800' : '#2196F3';
  };

  const renderServiceCard = (service) => (
    <View key={service._id} style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <View style={styles.serviceDetails}>
            <Text style={styles.serviceCategory}>{service.category}</Text>
            <Text style={styles.servicePrice}>₹{service.price}</Text>
            <Text style={styles.serviceDuration}>
              ⏱ {service.durationMins} mins
            </Text>
          </View>
        </View>
      </View>

      {/* Add-ons List */}
      {service.addOns.length > 0 ? (
        <View style={styles.addOnsContainer}>
          <Text style={styles.addOnsTitle}>Add-ons ({service.addOns.length})</Text>
          {service.addOns.map((addOn) => (
            <View key={addOn._id} style={styles.addOnItem}>
              <View style={styles.addOnInfo}>
                <Text style={styles.addOnName}>{addOn.name}</Text>
                <View style={styles.addOnMeta}>
                  <View
                    style={[
                      styles.typeBadge,
                      { backgroundColor: getTypeColor(addOn.type) },
                    ]}
                  >
                    <Text style={styles.typeBadgeText}>
                      {addOn.type.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.addOnPrice}>₹{addOn.price}</Text>
                </View>
              </View>
              <View style={styles.addOnActions}>
                <TouchableOpacity
                  onPress={() => openAddOnModal(service, addOn)}
                  style={styles.editIconButton}
                >
                  <Icon name="create-outline" size={18} color="#156778" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteAddOn(service._id, addOn._id)}
                  style={styles.deleteIconButton}
                >
                  <Icon name="trash-outline" size={18} color="#f44336" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.noAddOnsContainer}>
          <Text style={styles.noAddOnsText}>No add-ons yet</Text>
        </View>
      )}

      {/* Add Add-on Button */}
      <TouchableOpacity
        style={styles.addAddOnButton}
        onPress={() => openAddOnModal(service)}
      >
        <Icon name="add-circle" size={16} color="#fff" />
        <Text style={styles.addAddOnButtonText}>Add Add-on</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
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
            <Text style={styles.headerTitle}>Service Add-ons</Text>
            <Text style={styles.headerSubtitle}>Manage add-ons for your services</Text>
          </View>
        </View>

        {/* Services List */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {displayServices.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="layers-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No services available</Text>
            </View>
          ) : (
            displayServices.map(renderServiceCard)
          )}
        </ScrollView>
      </View>

      {/* Add/Edit Add-on Modal */}
      <Modal
        visible={addOnModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setAddOnModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setAddOnModalVisible(false)}>
                <Icon name="arrow-back" size={24} color="#156778" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {editingAddOn ? 'Edit Add-on' : 'Add New Add-on'}
              </Text>
              <Text style={styles.modalServiceName}>
                {selectedService?.name}
              </Text>
            </View>

            <View style={styles.modalContent}>
              {/* Add-on Name */}
              <Text style={styles.inputLabel}>Add-on Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Head Massage, Hair Wash"
                value={addOnForm.name}
                onChangeText={(text) =>
                  setAddOnForm({ ...addOnForm, name: text })
                }
                placeholderTextColor="#999"
              />

              {/* Price */}
              <Text style={styles.inputLabel}>Price (₹) *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 60"
                keyboardType="decimal-pad"
                value={addOnForm.price}
                onChangeText={(text) =>
                  setAddOnForm({ ...addOnForm, price: text })
                }
                placeholderTextColor="#999"
              />

              {/* Type Selection */}
              <Text style={styles.inputLabel}>Type</Text>
              <View style={styles.typeOptions}>
                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    addOnForm.type === 'optional' && styles.typeOptionActive,
                  ]}
                  onPress={() =>
                    setAddOnForm({ ...addOnForm, type: 'optional' })
                  }
                >
                  <View
                    style={[
                      styles.typeOptionRadio,
                      addOnForm.type === 'optional' &&
                        styles.typeOptionRadioActive,
                    ]}
                  />
                  <Text style={styles.typeOptionLabel}>Optional</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeOption,
                    addOnForm.type === 'recommended' && styles.typeOptionActive,
                  ]}
                  onPress={() =>
                    setAddOnForm({ ...addOnForm, type: 'recommended' })
                  }
                >
                  <View
                    style={[
                      styles.typeOptionRadio,
                      addOnForm.type === 'recommended' &&
                        styles.typeOptionRadioActive,
                    ]}
                  />
                  <Text style={styles.typeOptionLabel}>Recommended</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.typeExplain}>
                💡 Recommended add-ons will be suggested to customers
              </Text>

              {/* Info Box */}
              <View style={styles.infoBox}>
                <Icon name="information-circle" size={18} color="#2196F3" />
                <Text style={styles.infoText}>
                  Add-ons will appear in the service details when customers book this service
                </Text>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveAddOn}
              >
                <Icon name="checkmark" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>
                  {editingAddOn ? 'Update Add-on' : 'Add Add-on'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
  },
  serviceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  serviceHeader: {
    marginBottom: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  serviceDetails: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
    alignItems: 'center',
  },
  serviceCategory: {
    fontSize: 12,
    color: '#156778',
    fontWeight: '500',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4CAF50',
  },
  serviceDuration: {
    fontSize: 12,
    color: '#666',
  },
  addOnsContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  addOnsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  addOnItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: '#156778',
  },
  addOnInfo: {
    flex: 1,
  },
  addOnName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  addOnMeta: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
    alignItems: 'center',
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  typeBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },
  addOnPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2196F3',
  },
  addOnActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editIconButton: {
    padding: 6,
  },
  deleteIconButton: {
    padding: 6,
  },
  noAddOnsContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  noAddOnsText: {
    fontSize: 12,
    color: '#999',
  },
  addAddOnButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  addAddOnButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  modalTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  modalServiceName: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
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
  },
  typeOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    gap: 8,
  },
  typeOptionActive: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
  },
  typeOptionRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#999',
  },
  typeOptionRadioActive: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  typeOptionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  typeExplain: {
    fontSize: 11,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
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