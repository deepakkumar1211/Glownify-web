import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalonSpecialists, deleteSpecialist } from '../../../redux/slices/salonAdminSlice';
import AddSpecialistModal from './AddSpecialistScreen';

export default function ManageSpecialistScreen() {
  const dispatch = useDispatch();
  const { specialists, loading, error } = useSelector((state) => state.salonAdmin);
  const [expandedId, setExpandedId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    dispatch(fetchSalonSpecialists());
  }, [dispatch]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Specialist',
      'Are you sure you want to remove this specialist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteSpecialist(id));
            Alert.alert('Success', 'Specialist removed');
          },
        },
      ]
    );
  };

  const renderAvailabilityDay = (day) => (
    <View key={day.day} style={styles.availabilityItem}>
      <Text style={styles.dayText}>{day.day}</Text>
      <Text style={styles.timeText}>{day.start} - {day.end}</Text>
    </View>
  );

  const renderSpecialistCard = (specialist) => (
    <View key={specialist._id} style={styles.card}>
      {/* Header */}
     <View style={styles.cardHeader}>
  <Image
    source={{
      uri:
        specialist.image && specialist.image.trim() !== ''
          ? specialist.image
          : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    }}
    style={styles.specialistImage}
  />

  <View style={styles.headerInfo}>
    <Text style={styles.name}>
      {specialist.user?.name || 'Unnamed Specialist'}
    </Text>

    <Text style={styles.contact}>
      {specialist.user?.phone || 'N/A'}
    </Text>

    <Text style={styles.expertise}>
      {specialist.expertise?.join(', ') || 'No expertise'}
    </Text>

    <View style={styles.experienceRow}>
      <Icon name="briefcase" size={14} color="#156778" />
      <Text style={styles.experience}>
        {specialist.experienceYears || 0} years exp
      </Text>
    </View>
  </View>
</View>

      {/* Certifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Certifications</Text>
        {specialist.certifications.length === 0 ? (
          <Text style={styles.noDataText}>No certifications</Text>
        ) : (
          specialist.certifications.map((cert, idx) => (
            <View key={idx} style={styles.certItem}>
              <Icon name="checkmark-circle" size={14} color="#4CAF50" />
              <Text style={styles.certText}>{cert}</Text>
            </View>
          ))
        )}
      </View>

      {/* Availability Toggle */}
      <TouchableOpacity style={styles.expandButton} onPress={() => toggleExpand(specialist._id)}>
        <Text style={styles.expandButtonText}>
          {expandedId === specialist._id ? 'Hide' : 'Show'} Availability
        </Text>
        <Icon name={expandedId === specialist._id ? 'chevron-up' : 'chevron-down'} size={20} color="#156778" />
      </TouchableOpacity>

      {/* Availability */}
      {expandedId === specialist._id && (
        <View style={styles.availabilityContainer}>
          <Text style={styles.sectionTitle}>Weekly Schedule</Text>
          {specialist.availability.length === 0 ? (
            <Text style={styles.noDataText}>No availability set</Text>
          ) : (
            specialist.availability.map(renderAvailabilityDay)
          )}
        </View>
      )}

      {/* Delete */}
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(specialist._id)}>
        <Icon name="trash" size={16} color="#fff" />
        <Text style={styles.deleteButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
  <Text style={styles.title}>Specialists</Text>
  <Text style={styles.count}>{specialists.length} Total</Text>

  {/* Add Button - only show if no error */}
  {!error && !loading && (
    <TouchableOpacity style={styles.addButton} onPress={() => setShowAddModal(true)}>
      <Icon name="add-circle" size={22} color="#fff" />
      <Text style={styles.addButtonText}>Add</Text>
    </TouchableOpacity>
  )}
</View>
      {/* Content */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#156778" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={50} color="#f44336" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {specialists.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="person-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>No specialists yet</Text>
            </View>
          ) : (
            specialists.map(renderSpecialistCard)
          )}
        </ScrollView>
      )}

      {/* Add Specialist Modal */}
      <AddSpecialistModal visible={showAddModal} onClose={() => setShowAddModal(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#156778',
    paddingHorizontal: 16,
    paddingVertical: 16,
    position: 'relative',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  count: { fontSize: 12, color: '#ddd', marginTop: 4 },
  scrollContent: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', marginBottom: 16 },
  specialistImage: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e0e0e0' },
  headerInfo: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: '700', color: '#333' },
  contact: { fontSize: 13, color: '#156778' },
  expertise: { fontSize: 13, color: '#156778', fontWeight: '600', marginTop: 2 },
  experienceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  experience: { fontSize: 12, color: '#666', marginLeft: 4 },
  section: { marginVertical: 12 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#333', marginBottom: 8 },
  certItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  certText: { fontSize: 12, color: '#555', marginLeft: 8 },
  noDataText: { fontSize: 12, color: '#999' },
  expandButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginVertical: 12,
  },
  expandButtonText: { fontSize: 13, fontWeight: '600', color: '#156778' },
  availabilityContainer: { marginVertical: 12, paddingVertical: 10, backgroundColor: '#f9f9f9', borderRadius: 8, padding: 10 },
  availabilityItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  dayText: { fontSize: 12, fontWeight: '600', color: '#333' },
  timeText: { fontSize: 12, color: '#666' },
  deleteButton: { flexDirection: 'row', backgroundColor: '#f44336', paddingVertical: 10, borderRadius: 8, justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 10 },
  deleteButtonText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, color: '#999', marginTop: 10 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  errorText: { fontSize: 16, color: '#f44336', marginTop: 10, textAlign: 'center', paddingHorizontal: 20 },
  addButton: { position: 'absolute', right: 16, top: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a8e9f', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  addButtonText: { color: '#fff', fontWeight: '600', marginLeft: 4 },
});
