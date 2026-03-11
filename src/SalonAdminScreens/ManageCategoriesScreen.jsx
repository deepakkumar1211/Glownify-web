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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCategories } from '../../redux/slices/salonAdminSlice';

// Mock data for categories
const MOCK_CATEGORIES = [
  {
    _id: '1',
    name: 'Haircut',
    icon: 'cut',
    gender: 'unisex',
    subcategories: ['Men', 'Women', 'Kids'],
    description: 'Hair cutting services',
  },
  {
    _id: '2',
    name: 'Hair Spa',
    icon: 'water',
    gender: 'unisex',
    subcategories: ['Oil Treatment', 'Protein Treatment'],
    description: 'Relaxing hair spa treatments',
  },
  {
    _id: '3',
    name: 'Facial',
    icon: 'face',
    gender: 'women',
    subcategories: ['Hydrating', 'Brightening', 'Anti-Aging'],
    description: 'Professional facial treatments',
  },
  {
    _id: '4',
    name: 'Makeup',
    icon: 'sparkles',
    gender: 'women',
    subcategories: ['Bridal', 'Party', 'Casual'],
    description: 'Professional makeup services',
  },
  {
    _id: '5',
    name: 'Waxing',
    icon: 'flame',
    gender: 'women',
    subcategories: ['Full Body', 'Face', 'Legs'],
    description: 'Professional waxing services',
  },
  {
    _id: '6',
    name: 'Grooming',
    icon: 'people',
    gender: 'men',
    subcategories: ['Beard', 'Shaving', 'Massage'],
    description: 'Professional grooming services',
  },
];

export default function ManageCategoriesScreen({navigation}) {
  const dispatch = useDispatch();
  const { categories = [] } = useSelector((state) => state.salonAdmin);

  const [displayCategories, setDisplayCategories] = useState(MOCK_CATEGORIES);
  const [modalVisible, setModalVisible] = useState(false);
  const [subcategoryModalVisible, setSubcategoryModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategoryForSubcategory, setSelectedCategoryForSubcategory] = useState(null);

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    icon: 'cut',
    gender: 'unisex',
    description: '',
  });

  const [newSubcategory, setNewSubcategory] = useState('');

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const genderOptions = [
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Unisex', value: 'unisex' },
  ];

  const iconOptions = [
    { label: 'Cut', value: 'cut' },
    { label: 'Water', value: 'water' },
    { label: 'Face', value: 'face' },
    { label: 'Sparkles', value: 'sparkles' },
    { label: 'Flame', value: 'flame' },
    { label: 'People', value: 'people' },
  ];

  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      icon: 'cut',
      gender: 'unisex',
      description: '',
    });
    setModalVisible(true);
  };

  const openEditCategoryModal = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      icon: category.icon,
      gender: category.gender,
      description: category.description,
    });
    setModalVisible(true);
  };

  const handleSaveCategory = () => {
    if (!categoryForm.name.trim()) {
      Alert.alert('Error', 'Please enter category name');
      return;
    }

    if (editingCategory) {
      // Update category
      setDisplayCategories(
        displayCategories.map((cat) =>
          cat._id === editingCategory._id
            ? { ...cat, ...categoryForm }
            : cat
        )
      );
      Alert.alert('Success', 'Category updated successfully');
    } else {
      // Add new category
      const newCategory = {
        _id: Date.now().toString(),
        ...categoryForm,
        subcategories: [],
      };
      setDisplayCategories([...displayCategories, newCategory]);
      Alert.alert('Success', 'Category added successfully');
    }

    setModalVisible(false);
    setCategoryForm({
      name: '',
      icon: 'cut',
      gender: 'unisex',
      description: '',
    });
  };

  const handleDeleteCategory = (categoryId) => {
    Alert.alert('Delete Category', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setDisplayCategories(
            displayCategories.filter((cat) => cat._id !== categoryId)
          );
          Alert.alert('Success', 'Category deleted');
        },
      },
    ]);
  };

  const openSubcategoryModal = (category) => {
    setSelectedCategoryForSubcategory(category);
    setNewSubcategory('');
    setSubcategoryModalVisible(true);
  };

  const handleAddSubcategory = () => {
    if (!newSubcategory.trim()) {
      Alert.alert('Error', 'Please enter subcategory name');
      return;
    }

    if (selectedCategoryForSubcategory.subcategories.includes(newSubcategory)) {
      Alert.alert('Error', 'Subcategory already exists');
      return;
    }

    setDisplayCategories(
      displayCategories.map((cat) =>
        cat._id === selectedCategoryForSubcategory._id
          ? {
              ...cat,
              subcategories: [...cat.subcategories, newSubcategory],
            }
          : cat
      )
    );

    Alert.alert('Success', 'Subcategory added');
    setSubcategoryModalVisible(false);
    setNewSubcategory('');
  };

  const handleDeleteSubcategory = (categoryId, subcategoryName) => {
    Alert.alert('Delete Subcategory', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setDisplayCategories(
            displayCategories.map((cat) =>
              cat._id === categoryId
                ? {
                    ...cat,
                    subcategories: cat.subcategories.filter(
                      (sub) => sub !== subcategoryName
                    ),
                  }
                : cat
            )
          );
          Alert.alert('Success', 'Subcategory deleted');
        },
      },
    ]);
  };

  const getGenderColor = (gender) => {
    switch (gender) {
      case 'men':
        return '#2196F3';
      case 'women':
        return '#E91E63';
      case 'unisex':
        return '#9C27B0';
      default:
        return '#757575';
    }
  };

  const renderCategoryCard = (category) => (
    <View key={category._id} style={styles.categoryCard}>
      <View style={styles.cardHeader}>
        <View style={styles.categoryIconContainer}>
          <Icon name={category.icon} size={32} color="#156778" />
        </View>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{category.name}</Text>
          <View style={styles.genderBadgeRow}>
            <View
              style={[
                styles.genderBadge,
                { backgroundColor: getGenderColor(category.gender) },
              ]}
            >
              <Text style={styles.genderBadgeText}>
                {category.gender.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.subcategoryCount}>
              {category.subcategories.length} subcategories
            </Text>
          </View>
        </View>
      </View>

      {category.description && (
        <Text style={styles.descriptionText}>{category.description}</Text>
      )}

      {/* Subcategories */}
      {category.subcategories.length > 0 && (
        <View style={styles.subcategoriesContainer}>
          <Text style={styles.subcategoriesTitle}>Subcategories:</Text>
          {category.subcategories.map((subcategory, index) => (
            <View key={index} style={styles.subcategoryItem}>
              <Text style={styles.subcategoryText}>• {subcategory}</Text>
              <TouchableOpacity
                onPress={() =>
                  handleDeleteSubcategory(category._id, subcategory)
                }
              >
                <Icon name="close-circle" size={18} color="#f44336" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
          onPress={() => openSubcategoryModal(category)}
        >
          <Icon name="add-circle" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Add Subcategory</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#156778' }]}
          onPress={() => openEditCategoryModal(category)}
        >
          <Icon name="create-outline" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#f44336' }]}
          onPress={() => handleDeleteCategory(category._id)}
        >
          <Icon name="trash-outline" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
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
                    <Text style={styles.headerTitle}>Service Category</Text>
                    <Text style={styles.headerSubtitle}>Manage your service categories</Text>
                  </View>
                </View>

        {/* Add Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={openAddCategoryModal}
        >
          <Icon name="add-circle" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add New Category</Text>
        </TouchableOpacity>

        {/* Categories List */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {displayCategories.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="folder-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No categories yet</Text>
            </View>
          ) : (
            displayCategories.map(renderCategoryCard)
          )}
        </ScrollView>
      </View>

      {/* Add/Edit Category Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="arrow-back" size={24} color="#156778" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={styles.modalContent}>
              {/* Category Name */}
              <Text style={styles.inputLabel}>Category Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Haircut, Facial"
                value={categoryForm.name}
                onChangeText={(text) =>
                  setCategoryForm({ ...categoryForm, name: text })
                }
                placeholderTextColor="#999"
              />

              {/* Icon Selection */}
              <Text style={styles.inputLabel}>Icon</Text>
              <View style={styles.iconGrid}>
                {iconOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.iconOption,
                      categoryForm.icon === option.value &&
                        styles.iconOptionActive,
                    ]}
                    onPress={() =>
                      setCategoryForm({ ...categoryForm, icon: option.value })
                    }
                  >
                    <Icon
                      name={option.value}
                      size={24}
                      color={
                        categoryForm.icon === option.value
                          ? '#fff'
                          : '#156778'
                      }
                    />
                    <Text
                      style={[
                        styles.iconOptionLabel,
                        categoryForm.icon === option.value &&
                          styles.iconOptionLabelActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Gender Selection */}
              <Text style={styles.inputLabel}>Gender</Text>
              <View style={styles.genderGrid}>
                {genderOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.genderOption,
                      categoryForm.gender === option.value &&
                        styles.genderOptionActive,
                    ]}
                    onPress={() =>
                      setCategoryForm({ ...categoryForm, gender: option.value })
                    }
                  >
                    <Text
                      style={[
                        styles.genderOptionLabel,
                        categoryForm.gender === option.value &&
                          styles.genderOptionLabelActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Description */}
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                placeholder="Describe this category"
                value={categoryForm.description}
                onChangeText={(text) =>
                  setCategoryForm({ ...categoryForm, description: text })
                }
                multiline
                placeholderTextColor="#999"
              />

              {/* Save Button */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveCategory}
              >
                <Icon name="checkmark" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>Save Category</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Add Subcategory Modal */}
      <Modal
        visible={subcategoryModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSubcategoryModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setSubcategoryModalVisible(false)}>
              <Icon name="arrow-back" size={24} color="#156778" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              Add Subcategory to {selectedCategoryForSubcategory?.name}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>Subcategory Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Men, Women, Kids"
              value={newSubcategory}
              onChangeText={setNewSubcategory}
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleAddSubcategory}
            >
              <Icon name="add" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Add Subcategory</Text>
            </TouchableOpacity>
          </View>
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
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#ddd',
    marginTop: 4,
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
  categoryCard: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  genderBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 8,
  },
  genderBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  genderBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'uppercase',
  },
  subcategoryCount: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  descriptionText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    lineHeight: 18,
  },
  subcategoriesContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#156778',
  },
  subcategoriesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  subcategoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  subcategoryText: {
    fontSize: 12,
    color: '#555',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
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
    paddingVertical: 60,
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
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconOption: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  iconOptionActive: {
    backgroundColor: '#156778',
    borderColor: '#156778',
  },
  iconOptionLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 6,
  },
  iconOptionLabelActive: {
    color: '#fff',
  },
  genderGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  genderOption: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  genderOptionActive: {
    backgroundColor: '#156778',
    borderColor: '#156778',
  },
  genderOptionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  genderOptionLabelActive: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#156778',
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 20,
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