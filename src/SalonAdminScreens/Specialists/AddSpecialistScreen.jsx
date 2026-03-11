import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { useDispatch } from "react-redux";
import { addSpecialist } from "../../../redux/slices/salonAdminSlice";
import { uploadImageToCloudinary } from "../../../api/claudinary";
import { showSnackbar } from "../../../redux/slices/snackbarSlice";

// Time Picker Component
function TimePicker({ label, value, onSelect }) {
  const [open, setOpen] = useState(false);
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = ["00", "30"];
  const periods = ["AM", "PM"];

  return (
    <View style={{ marginBottom: 10 }}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.timeInput}
        onPress={() => setOpen(!open)}
        activeOpacity={0.7}
      >
        <Text style={{ color: value ? "#000" : "#999" }}>{value || "Select Time"}</Text>
        <Icon name={open ? "chevron-up" : "time-outline"} size={18} color="#156778" />
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdown}>
          <ScrollView nestedScrollEnabled style={{ maxHeight: 150 }}>
            {periods.map((p) =>
              hours.map((h) =>
                minutes.map((m) => {
                  const time = `${h}:${m} ${p}`;
                  return (
                    <TouchableOpacity
                      key={time}
                      style={styles.dropdownItem}
                      onPress={() => {
                        onSelect(time);
                        setOpen(false);
                      }}
                    >
                      <Text style={styles.dropdownText}>{time}</Text>
                    </TouchableOpacity>
                  );
                })
              )
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

//Experties Picker Component
function ExpertiesPicker({selectedExperties, onSelect}){
  const Experties = ["Hair","Skin","Makeup","Massage","Nails","Other"]
  const toggleExperties = (exp)=>{
    if(selectedExperties.includes(exp)) onSelect(selectedExperties.filter((e)=>e!==exp))
    else onSelect([...selectedExperties,exp])
  }

  return(
    <View style={{ marginBottom: 15 }}>
      <Text style={styles.label}>Expertise</Text>
      <View style={styles.daysContainer}>
        {Experties.map((exp) => {
          const selected = selectedExperties.includes(exp);
          return (
            <TouchableOpacity
              key={exp}
              style={[styles.dayItem, selected && styles.dayItemSelected]}
              onPress={() => toggleExperties(exp)}
            >
              <Text style={[styles.dayText, selected && styles.dayTextSelected]}>{exp}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  )
}

// Day Picker Component
function DayPicker({ selectedDays, onSelect }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const toggleDay = (day) => {
    if (selectedDays.includes(day)) onSelect(selectedDays.filter((d) => d !== day));
    else onSelect([...selectedDays, day]);
  };

  return (
    <View style={{ marginBottom: 15 }}>
      <Text style={styles.label}>Available Days</Text>
      <View style={styles.daysContainer}>
        {days.map((day) => {
          const selected = selectedDays.includes(day);
          return (
            <TouchableOpacity
              key={day}
              style={[styles.dayItem, selected && styles.dayItemSelected]}
              onPress={() => toggleDay(day)}
            >
              <Text style={[styles.dayText, selected && styles.dayTextSelected]}>{day}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function AddSpecialistModal({ visible, onClose }) {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    phone:"",
    email:"",
    expertise: [],
    expertiseInput: "",
    experienceYears: "",
    image: "",
    certifications: [],
    certificateInput: "",
    availabilityDays: [],
    startTime: "",
    endTime: "",
  });

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleAddCertificate = () => {
    if (!form.certificateInput.trim()) return;
    setForm({
      ...form,
      certifications: [...form.certifications, form.certificateInput.trim()],
      certificateInput: "",
    });
  };

  const handleRemoveCertificate = (index) => {
    const updated = [...form.certifications];
    updated.splice(index, 1);
    setForm({ ...form, certifications: updated });
  };

const handlePickImage = () => {
  Alert.alert(
    "Upload Image",
    "Choose an option",
    [
      {
        text: "Camera",
        onPress: () =>
          launchCamera({ mediaType: "photo", quality: 0.7 }, (response) => {
            if (response.didCancel || response.errorCode) return;
            // Extract only the URI string
            handleChange("image", response.assets[0].uri);
          }),
      },
      {
        text: "Gallery",
        onPress: () =>
          launchImageLibrary({ mediaType: "photo", quality: 0.7 }, (response) => {
            if (response.didCancel || response.errorCode) return;
            // Extract only the URI string
            handleChange("image", response.assets[0].uri);
          }),
      },
      { text: "Cancel", style: "cancel" },
    ],
    { cancelable: true }
  );
};


  const handleSubmit = async () => {
  if (!form.name || !form.phone || !form.email || form.expertise.length === 0) {
    Alert.alert("Missing Fields", "Please fill all required fields.");
    return;
  }

  if (!form.startTime || !form.endTime || form.availabilityDays.length === 0) {
    Alert.alert("Missing Availability", "Please select days and time.");
    return;
  }

  let imageUrl = "";
  if (form.image) {
    // upload to Cloudinary
    try {
      imageUrl = await uploadImageToCloudinary(form.image);
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      Alert.alert("Error", "Image upload failed. Please try again.");
      return;
    }
  }

  // Create availability array
  const availability = form.availabilityDays.map((day) => ({
    day,
    start: form.startTime,
    end: form.endTime,
  }));

  const newSpecialist = {
    name: form.name,
    email: form.email,
    phone: form.phone,
    expertise: form.expertise,
    experienceYears: Number(form.experienceYears) || 0,
    image: imageUrl || "", // Cloudinary URL
    certifications: form.certifications,
    availability,
  };

  try {
    const result = await dispatch(addSpecialist(newSpecialist)).unwrap();
    Alert.alert("Success", "Specialist added successfully.");
    onClose();
    setForm({
      name: "",
      phone:"",
      email:"",
      expertise: [],
      expertiseInput: "",
      experienceYears: "",
      image: "",
      certifications: [],
      certificateInput: "",
      availabilityDays: [],
      startTime: "",
      endTime: "",
    });
  } catch (err) {
    Alert.alert("Error", err || "Failed to add specialist. Please try again.");
    console.error("Add Specialist Error:", err);
  }
};


  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Specialist</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={22} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Image Upload */}
            <TouchableOpacity style={styles.imageBox} onPress={handlePickImage} activeOpacity={0.8}>
  {form.image ? (
    <Image source={{ uri: form.image }} style={styles.imagePreview} />
  ) : (
    <View style={styles.imagePlaceholder}>
      <Icon name="camera" size={30} color="#156778" />
      <Text style={{ color: "#156778", marginTop: 5 }}>Upload Image</Text>
    </View>
  )}
</TouchableOpacity>

            {/* Name & Contact */}
            <TextInput
              placeholder="Name"
              style={styles.input}
              value={form.name}
              onChangeText={(v) => handleChange("name", v)}
            />
            <TextInput
              placeholder="Phone Number"
              style={styles.input}
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(v) => handleChange("phone", v)}
            />
            <TextInput
              placeholder="Email"
              style={styles.input}
              keyboardType="email-address"
              value={form.email}
              onChangeText={(v) => handleChange("email", v)}
            />

            <ExpertiesPicker 
              selectedExperties={form.expertise}
              onSelect={(v) => handleChange("expertise", v)}
            />

            {/* Experience */}
            <TextInput
              placeholder="Experience (in years)"
              style={styles.input}
              keyboardType="numeric"
              value={form.experienceYears}
              onChangeText={(v) => handleChange("experienceYears", v)}
            />

            {/* Certifications */}
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.label}>Certifications</Text>
              <View style={styles.certRow}>
                <TextInput
                  placeholder="Enter certificate name"
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  value={form.certificateInput}
                  onChangeText={(v) => handleChange("certificateInput", v)}
                />
                <TouchableOpacity style={styles.addCertBtn} onPress={handleAddCertificate}>
                  <Icon name="add-circle" size={26} color="#156778" />
                </TouchableOpacity>
              </View>

              {form.certifications.map((cert, idx) => (
                <View key={idx} style={styles.certItem}>
                  <Text style={styles.certText}>{cert}</Text>
                  <TouchableOpacity onPress={() => handleRemoveCertificate(idx)}>
                    <Icon name="close-circle" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Availability */}
            <DayPicker
              selectedDays={form.availabilityDays}
              onSelect={(days) => handleChange("availabilityDays", days)}
            />
            <TimePicker label="Start Time" value={form.startTime} onSelect={(v) => handleChange("startTime", v)} />
            <TimePicker label="End Time" value={form.endTime} onSelect={(v) => handleChange("endTime", v)} />
          </ScrollView>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Add Specialist</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// Styles
const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  modalBox: { backgroundColor: "#fff", borderRadius: 12, padding: 16, width: "100%", maxHeight: "90%" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  title: { fontSize: 18, fontWeight: "700", color: "#156778" },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 4, color: "#156778" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 10, fontSize: 14 },
  submitButton: { backgroundColor: "#156778", paddingVertical: 12, borderRadius: 8, alignItems: "center", marginTop: 10 },
  submitText: { color: "#fff", fontWeight: "600" },
  dropdown: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginTop: 4, backgroundColor: "#fff" },
  dropdownItem: { paddingVertical: 8, paddingHorizontal: 12 },
  dropdownText: { fontSize: 14, color: "#156778" },
  timeInput: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  daysContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  dayItem: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12 },
  dayItemSelected: { backgroundColor: "#156778", borderColor: "#156778" },
  dayText: { color: "#333", fontSize: 13 },
  dayTextSelected: { color: "#fff", fontWeight: "600" },
  certRow: { flexDirection: "row", alignItems: "center" },
  addCertBtn: { marginLeft: 6 },
  certItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#F1F5F9", padding: 8, borderRadius: 8, marginTop: 6 },
  certText: { color: "#156778", fontSize: 14, fontWeight: "500" },
  imageBox: { alignSelf: "center", marginBottom: 16 },
  imagePreview: { width: 110, height: 110, borderRadius: 55, borderWidth: 2, borderColor: "#156778" },
  imagePlaceholder: { width: 110, height: 110, borderRadius: 55, borderWidth: 2, borderColor: "#156778", justifyContent: "center", alignItems: "center", backgroundColor: "#F9FAFB" },
});