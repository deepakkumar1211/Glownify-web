import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSalonServices,
  fetchAllCategories,
  createServiceItem,
  updateServiceItem,
  deleteServiceItem,
} from "../../redux/slices/salonAdminSlice";
import Loader from "../../components/Loader";

export default function ManageServicesScreen({ navigation }) {
  const dispatch = useDispatch();
  const { services = [], loading, error, categories = [] } = useSelector(
    (state) => state.salonAdmin
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Main service fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [durationMins, setDurationMins] = useState("30");
  const [discountPercent, setDiscountPercent] = useState("0");
  const [description, setDescription] = useState("");
  const [serviceMode, setServiceMode] = useState("salon");

  // Add-ons state
  const [addOns, setAddOns] = useState([]);
  const [showAddOnForm, setShowAddOnForm] = useState(false);

  // Gender filter states
  const [selectedGenderFilter, setSelectedGenderFilter] = useState("all");
  const [modalGenderFilter, setModalGenderFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchSalonServices());
    dispatch(fetchAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (editingService) {
      const catId =
        typeof editingService.category === "string"
          ? editingService.category
          : editingService.category?._id;

      if (catId && !category) {
        setCategory(catId);
      }

      const serviceGender = editingService.gender;
      const catObj = categories.find((c) => c._id === catId);
      const derivedGender = serviceGender || catObj?.gender || "all";

      if (modalGenderFilter !== derivedGender) {
        setModalGenderFilter(derivedGender);
      }
    }
  }, [categories, editingService]);

  const getModalFilteredCategories = () => {
    if (!categories) return [];
    if (modalGenderFilter === "all") {
      return categories;
    }
    return categories.filter(
      (cat) => cat.gender === modalGenderFilter || cat.gender === "unisex"
    );
  };

  const getGenderBadgeColor = (gender) => {
    switch (gender) {
      case "men":
        return "#2196F3";
      case "women":
        return "#E91E63";
      case "unisex":
        return "#9C27B0";
      default:
        return "#757575";
    }
  };

  // Add-on management functions
  const addNewAddOn = () => {
    setAddOns([
      ...addOns,
      {
        id: Date.now().toString(), // temporary ID for UI
        name: "",
        price: "",
        duration: "0",
        isRecommended: false,
      },
    ]);
    setShowAddOnForm(true);
  };

  const updateAddOn = (index, field, value) => {
    const updated = [...addOns];
    updated[index] = { ...updated[index], [field]: value };
    setAddOns(updated);
  };

  const removeAddOn = (index) => {
    Alert.alert("Remove Add-on", "Are you sure you want to remove this add-on?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          const updated = addOns.filter((_, idx) => idx !== index);
          setAddOns(updated);
          if (updated.length === 0) {
            setShowAddOnForm(false);
          }
        },
      },
    ]);
  };

  const toggleAddOnRecommended = (index) => {
    const updated = [...addOns];
    updated[index] = {
      ...updated[index],
      isRecommended: !updated[index].isRecommended,
    };
    setAddOns(updated);
  };

  const openModal = (service = null) => {
    if (service) {
      setEditingService(service);

      const catId =
        typeof service.category === "string"
          ? service.category
          : service.category?._id;

      setName(service.name || "");
      setCategory(catId || "");
      setPrice(service.price != null ? service.price.toString() : "");
      setDurationMins(
        service.durationMins != null ? service.durationMins.toString() : "30"
      );
      setDiscountPercent(
        service.discountPercent != null ? service.discountPercent.toString() : "0"
      );
      setDescription(service.description || "");
      setServiceMode(service.serviceMode || "salon");

      // Load existing add-ons
      if (service.addOns && service.addOns.length > 0) {
        setAddOns(
          service.addOns.map((addon) => ({
            id: addon._id || Date.now().toString(),
            name: addon.name || "",
            price: addon.price != null ? addon.price.toString() : "",
            duration: addon.duration != null ? addon.duration.toString() : "0",
            isRecommended: addon.isRecommended || false,
          }))
        );
        setShowAddOnForm(true);
      } else {
        setAddOns([]);
        setShowAddOnForm(false);
      }

      const serviceGender = service.gender;
      const catObj = categories.find((c) => c._id === catId);
      setModalGenderFilter(serviceGender || catObj?.gender || "all");
    } else {
      // Reset for Add
      setEditingService(null);
      setName("");
      setCategory("");
      setPrice("");
      setDurationMins("30");
      setDiscountPercent("0");
      setDescription("");
      setServiceMode("salon");
      setAddOns([]);
      setShowAddOnForm(false);
      setModalGenderFilter("all");
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name || !category || !price) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    // Validate add-ons
    const validAddOns = addOns.filter((addon) => addon.name && addon.price);
    const invalidAddOns = addOns.filter((addon) => !addon.name || !addon.price);

    if (invalidAddOns.length > 0) {
      Alert.alert(
        "Invalid Add-ons",
        "Some add-ons have missing name or price. They will be excluded."
      );
    }

    // Format add-ons for backend (remove temporary id field)
    const formattedAddOns = validAddOns.map((addon) => ({
      ...(addon._id && { _id: addon._id }), // Include _id only if editing existing addon
      name: addon.name,
      price: Number(addon.price),
      duration: Number(addon.duration),
      isRecommended: addon.isRecommended,
    }));

    const serviceData = {
      name,
      category,
      price: Number(price),
      durationMins: Number(durationMins),
      discountPercent: Number(discountPercent),
      description,
      serviceMode,
      providerType: "Salon",
      addOns: formattedAddOns,
    };

    try {
      if (editingService) {
        await dispatch(
          updateServiceItem({
            serviceId: editingService._id,
            updateData: serviceData,
          })
        ).unwrap();
      } else {
        await dispatch(createServiceItem(serviceData)).unwrap();
      }

      setModalVisible(false);
      setEditingService(null);
      dispatch(fetchSalonServices());
      dispatch(fetchAllCategories());
    } catch (err) {
      Alert.alert("Error", (err && err.message) || String(err));
    }
  };

  const handleDelete = (serviceId) => {
    Alert.alert("Delete Service", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await dispatch(deleteServiceItem(serviceId)).unwrap();
            dispatch(fetchSalonServices());
          } catch (err) {
            Alert.alert("Error", (err && err.message) || String(err));
          }
        },
      },
    ]);
  };

  const toggleStatus = async (service) => {
    try {
      await dispatch(
        updateServiceItem({
          serviceId: service._id,
          updateData: {
            status: service.status === "active" ? "inactive" : "active",
          },
        })
      ).unwrap();
      dispatch(fetchSalonServices());
    } catch (err) {
      Alert.alert("Error", (err && err.message) || String(err));
    }
  };

 const renderServiceCard = (service, index) => (
  <View key={service._id || index} style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.headerInfo}>
        <Text style={styles.name}>{service.name}</Text>
        <View style={styles.categoryRow}>
          {typeof service.category === "object" && service.category?.icon && (
            <Icon
              name={service.category.icon}
              size={14}
              color="#156778"
              style={{ marginRight: 4 }}
            />
          )}
          <Text style={styles.categoryText}>
            {typeof service.category === "object"
              ? service.category?.name
              : categories.find((c) => c._id === service.category)?.name ||
                ""}
          </Text>

          {/* Gender Badge */}
          {(service.gender ||
            (typeof service.category === "object" &&
              service.category?.gender) ||
            categories.find((c) => c._id === service.category)?.gender) && (
            <View
              style={[
                styles.genderBadge,
                {
                  backgroundColor: getGenderBadgeColor(
                    service.gender ||
                      (typeof service.category === "object" &&
                        service.category?.gender) ||
                      categories.find((c) => c._id === service.category)
                        ?.gender
                  ),
                  marginLeft: 8,
                },
              ]}
            >
              <Text style={styles.genderBadgeText}>
                {(service.gender ||
                  (typeof service.category === "object" &&
                    service.category?.gender) ||
                  categories.find((c) => c._id === service.category)
                    ?.gender ||
                  ""
                ).toString()}
              </Text>
            </View>
          )}

          {/* Service Mode Badge */}
          {service.serviceMode && (
            <View
              style={[
                styles.serviceModeBadge,
                {
                  backgroundColor:
                    service.serviceMode === "salon"
                      ? "#4CAF50"
                      : service.serviceMode === "home"
                      ? "#FF9800"
                      : "#9C27B0",
                },
              ]}
            >
              <Icon
                name={
                  service.serviceMode === "salon"
                    ? "business"
                    : service.serviceMode === "home"
                    ? "home"
                    : "list"
                }
                size={10}
                color="#fff"
              />
              <Text style={styles.serviceModeBadgeText}>
                {service.serviceMode.charAt(0).toUpperCase() +
                  service.serviceMode.slice(1)}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.statusContainer}>
        <Text
          style={[
            styles.statusText,
            { color: service.status === "active" ? "#4CAF50" : "#f44336" },
          ]}
        >
          {service.status === "active" ? "Active" : "Inactive"}
        </Text>
      </View>
    </View>

    <View style={styles.section}>
      <View style={styles.rowBetween}>
        <Text style={styles.priceText}>₹{service.price}</Text>
        <Text style={styles.durationText}>⏱ {service.durationMins} mins</Text>
      </View>
      {service.discountPercent > 0 && (
        <Text style={styles.discountText}>
          💸 {service.discountPercent}% off
        </Text>
      )}
    </View>

    {/* Display Add-ons */}
    {service.addOns && service.addOns.length > 0 && (
      <View style={styles.addOnsPreview}>
        <View style={styles.addOnsHeader}>
          <Icon name="add-circle-outline" size={14} color="#156778" />
          <Text style={styles.addOnsHeaderText}>
            {service.addOns.length} Add-on{service.addOns.length > 1 ? "s" : ""}
          </Text>
        </View>
        <View style={styles.addOnsList}>
          {service.addOns.slice(0, 2).map((addon, idx) => (
            <View key={idx} style={styles.addOnChip}>
              <Text style={styles.addOnChipText}>
                {addon.name} (+₹{addon.price})
              </Text>
              {addon.isRecommended && (
                <Icon name="star" size={10} color="#FFD700" />
              )}
            </View>
          ))}
          {service.addOns.length > 2 && (
            <Text style={styles.moreAddOns}>
              +{service.addOns.length - 2} more
            </Text>
          )}
        </View>
      </View>
    )}

    {service.description && (
      <Text style={styles.desc}>{service.description}</Text>
    )}

    <View style={styles.actions}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: "#156778" }]}
        onPress={() => openModal(service)}
      >
        <Icon name="create-outline" size={16} color="#fff" />
        <Text style={styles.actionText}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: "#4CAF50" }]}
        onPress={() => toggleStatus(service)}
      >
        <Icon name="swap-horizontal-outline" size={16} color="#fff" />
        <Text style={styles.actionText}>Toggle</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: "#f44336" }]}
        onPress={() => handleDelete(service._id)}
      >
        <Icon name="trash-outline" size={16} color="#fff" />
        <Text style={styles.actionText}>Delete</Text>
      </TouchableOpacity>
    </View>
  </View>
);


  const getFilteredServices = () => {
    if (selectedGenderFilter === "all") {
      return services;
    }
    return services.filter((service) => {
      const serviceGender =
        service.gender ||
        (typeof service.category === "object" && service.category?.gender) ||
        categories.find((c) => c._id === service.category)?.gender;
      return (
        serviceGender === selectedGenderFilter || serviceGender === "unisex"
      );
    });
  };

  const filteredServices = getFilteredServices();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Services</Text>
        <Text style={styles.count}>{services.length} Total</Text>
      </View>

      {/* Gender Filter */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter by Gender:</Text>
        <View style={styles.genderFilterButtons}>
          {["all", "men", "women", "unisex"].map((gender) => (
            <TouchableOpacity
              key={gender}
              style={[
                styles.genderFilterButton,
                selectedGenderFilter === gender &&
                  styles.genderFilterButtonActive,
              ]}
              onPress={() => setSelectedGenderFilter(gender)}
            >
              <Text
                style={[
                  styles.genderFilterText,
                  selectedGenderFilter === gender &&
                    styles.genderFilterTextActive,
                ]}
              >
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading && <Loader />}
      {error && (
        <Text style={{ color: "red", textAlign: "center", marginBottom: 20 }}>
          {error}
        </Text>
      )}

      {!loading && !error && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => openModal(null)}
          >
            <Icon name="add-circle-outline" size={18} color="#fff" />
            <Text style={styles.addButtonText}>Add Service</Text>
          </TouchableOpacity>

          {filteredServices.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="cut-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>
                {selectedGenderFilter === "all"
                  ? "No services yet"
                  : `No ${selectedGenderFilter} services found`}
              </Text>
            </View>
          ) : (
            filteredServices.map(renderServiceCard)
          )}
        </ScrollView>
      )}

      {/* Add/Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={true}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingService ? "Edit Service" : "Add Service"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setEditingService(null);
                }}
                style={styles.closeButton}
              >
                <Icon name="close-circle" size={28} color="#f44336" />
              </TouchableOpacity>
            </View>

            {/* Basic Service Info Section */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Basic Information</Text>

              <TextInput
                placeholder="Service Name *"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />

              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Select Category *</Text>
                <Picker
                  selectedValue={category}
                  onValueChange={(val) => setCategory(val)}
                  style={styles.picker}
                >
                  <Picker.Item label="-- Select Category --" value="" />
                  {getModalFilteredCategories().map((cat) => (
                    <Picker.Item
                      key={cat._id}
                      label={`${cat.name} (${cat.gender})`}
                      value={cat._id}
                    />
                  ))}
                </Picker>
              </View>

              {category && (
                <View style={styles.selectedCategoryInfo}>
                  <Icon name="information-circle" size={16} color="#156778" />
                  <Text style={styles.infoLabel}>Selected Category:</Text>
                  <Text style={styles.infoCategoryName}>
                    {categories.find((c) => c._id === category)?.name || ""}
                  </Text>
                  <View
                    style={[
                      styles.genderBadge,
                      {
                        backgroundColor: getGenderBadgeColor(
                          categories.find((c) => c._id === category)?.gender ||
                            "all"
                        ),
                        marginLeft: 8,
                      },
                    ]}
                  >
                    <Text style={styles.genderBadgeText}>
                      {categories.find((c) => c._id === category)?.gender ||
                        "all"}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.rowInputs}>
                <TextInput
                  placeholder="Price (₹) *"
                  keyboardType="numeric"
                  style={[styles.input, styles.halfInput]}
                  value={price}
                  onChangeText={setPrice}
                />

                <TextInput
                  placeholder="Duration (mins) *"
                  keyboardType="numeric"
                  style={[styles.input, styles.halfInput]}
                  value={durationMins}
                  onChangeText={setDurationMins}
                />
              </View>

              <TextInput
                placeholder="Discount %"
                keyboardType="numeric"
                style={styles.input}
                value={discountPercent}
                onChangeText={setDiscountPercent}
              />

              <TextInput
                placeholder="Description"
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={3}
                value={description}
                onChangeText={setDescription}
              />

              {/* Service Mode Selection */}
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Service Mode *</Text>
                <View style={styles.modeToggleContainer}>
                  {["salon", "home", "both"].map((mode) => (
                    <TouchableOpacity
                      key={mode}
                      style={[
                        styles.modeOption,
                        serviceMode === mode && styles.modeOptionActive,
                      ]}
                      onPress={() => setServiceMode(mode)}
                    >
                      <Text
                        style={[
                          styles.modeOptionText,
                          serviceMode === mode && styles.modeOptionTextActive,
                        ]}
                      >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Add-ons Section */}
            <View style={styles.formSection}>
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleRow}>
                  <Text style={styles.sectionTitle}>Add-ons</Text>
                  <Text style={styles.sectionSubtitle}>(Optional)</Text>
                </View>

                {!showAddOnForm && (
                  <TouchableOpacity
                    style={styles.showAddOnButton}
                    onPress={() => setShowAddOnForm(true)}
                  >
                    <Icon name="add-circle" size={20} color="#156778" />
                    <Text style={styles.showAddOnButtonText}>Add Add-ons</Text>
                  </TouchableOpacity>
                )}
              </View>

              {showAddOnForm && (
                <>
                  {addOns.map((addon, index) => (
                    <View key={addon.id || index} style={styles.addOnCard}>
                      <View style={styles.addOnHeader}>
                        <Text style={styles.addOnNumber}>Add-on #{index + 1}</Text>
                        <View style={styles.addOnActions}>
                          <TouchableOpacity
                            onPress={() => toggleAddOnRecommended(index)}
                            style={styles.recommendedButton}
                          >
                            <Icon
                              name={addon.isRecommended ? "star" : "star-outline"}
                              size={20}
                              color={addon.isRecommended ? "#FFD700" : "#999"}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => removeAddOn(index)}>
                            <Icon name="trash" size={20} color="#f44336" />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <TextInput
                        placeholder="Add-on Name *"
                        style={styles.input}
                        value={addon.name}
                        onChangeText={(val) => updateAddOn(index, "name", val)}
                      />

                      <View style={styles.rowInputs}>
                        <TextInput
                          placeholder="Price (₹) *"
                          keyboardType="numeric"
                          style={[styles.input, styles.halfInput]}
                          value={addon.price}
                          onChangeText={(val) => updateAddOn(index, "price", val)}
                        />

                        <TextInput
                          placeholder="Duration (mins)"
                          keyboardType="numeric"
                          style={[styles.input, styles.halfInput]}
                          value={addon.duration}
                          onChangeText={(val) =>
                            updateAddOn(index, "duration", val)
                          }
                        />
                      </View>

                      {addon.isRecommended && (
                        <View style={styles.recommendedBadge}>
                          <Icon name="star" size={12} color="#FFD700" />
                          <Text style={styles.recommendedText}>
                            Recommended Add-on
                          </Text>
                        </View>
                      )}
                    </View>
                  ))}

                  <TouchableOpacity
                    style={styles.addAnotherButton}
                    onPress={addNewAddOn}
                  >
                    <Icon name="add" size={18} color="#156778" />
                    <Text style={styles.addAnotherText}>Add Another Add-on</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Icon name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.modalButtonText}>
                  {editingService ? "Update Service" : "Add Service"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setEditingService(null);
                }}
              >
                <Icon name="close-circle" size={20} color="#fff" />
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    backgroundColor: "#156778",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  count: { fontSize: 12, color: "#ddd", marginTop: 4 },
  filterContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  genderFilterButtons: {
    flexDirection: "row",
    gap: 8,
  },
  genderFilterButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#156778",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  genderFilterButtonActive: {
    backgroundColor: "#156778",
  },
  genderFilterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#156778",
  },
  genderFilterTextActive: {
    color: "#fff",
  },
  scrollContent: { padding: 16 },
  addButton: {
    flexDirection: "row",
    backgroundColor: "#156778",
    borderRadius: 8,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },
  addButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerInfo: { flex: 1 },
  name: { fontSize: 16, fontWeight: "700", color: "#333" },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
    flexWrap: "wrap",
  },
  categoryText: { fontSize: 13, color: "#156778", fontWeight: "500" },
  genderBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  genderBadgeText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  statusContainer: { alignItems: "flex-end" },
  statusText: { fontSize: 13, fontWeight: "600" },
  section: { marginVertical: 8 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
  priceText: { fontSize: 15, fontWeight: "700", color: "#333" },
  durationText: { fontSize: 13, color: "#666" },
  discountText: { fontSize: 12, color: "#4CAF50", marginTop: 4 },
  serviceModeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 6,
    gap: 3,
  },
  serviceModeBadgeText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  // Add-ons preview in card
  addOnsPreview: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  addOnsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },
  addOnsHeaderText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#156778",
  },
  addOnsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    alignItems: "center",
  },
  addOnChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  addOnChipText: {
    fontSize: 11,
    color: "#156778",
    fontWeight: "500",
  },
  moreAddOns: {
    fontSize: 11,
    color: "#999",
    fontStyle: "italic",
  },
  desc: { fontSize: 12, color: "#555", marginVertical: 8, lineHeight: 18 },
  actions: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 8,
    gap: 4,
  },
  actionText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 10,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#156778",
  },
  closeButton: {
    padding: 4,
  },
  formSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#999",
    fontStyle: "italic",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  rowInputs: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 0,
  },
  halfInput: {
    flex: 1,
  },
  pickerContainer: {
    marginBottom: 12,
  },
  pickerLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
    fontWeight: "600",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  selectedCategoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    gap: 6,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  infoCategoryName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#156778",
  },
  modeToggleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  modeOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#156778",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  modeOptionActive: {
    backgroundColor: "#156778",
  },
  modeOptionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#156778",
  },
  modeOptionTextActive: {
    color: "#fff",
  },
  // Add-on form styles
  showAddOnButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#156778",
    borderStyle: "dashed",
  },
  showAddOnButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#156778",
  },
  addOnCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  addOnHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  addOnNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#156778",
  },
  addOnActions: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  recommendedButton: {
    padding: 4,
  },
  recommendedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  recommendedText: {
    fontSize: 11,
    color: "#F57C00",
    fontWeight: "600",
  },
  addAnotherButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#156778",
    borderStyle: "dashed",
    backgroundColor: "#fff",
  },
  addAnotherText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#156778",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    gap: 10,
    marginBottom: 20,
  },
  modalButton: {
    flex: 1,
    flexDirection: "row",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  saveButton: {
    backgroundColor: "#156778",
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});
