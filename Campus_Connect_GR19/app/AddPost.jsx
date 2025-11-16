import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  StatusBar,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { collection, query, orderBy, onSnapshot, addDoc } from "firebase/firestore";
import ConfirmModal from "../components/ConfirmModal.jsx";
import { db } from "../firebase";
import DateTimePicker from "@react-native-community/datetimepicker";
import { auth } from "../firebase.js";
import { useEffect } from "react";

export default function AddEvent() {
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [eventTime, setEventTime] = useState(new Date());
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventPhoto, setEventPhoto] = useState(null);

  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const generateRandomEventImage = () => {
    const width = 400;
    const height = 300;
    const seed = Math.random().toString(36).substring(2);

    return `https://picsum.photos/${width}/${height}?random=${seed}`;
  };

  const handleDateChange = (dateString) => {
    const newDate = new Date(dateString);
    
    if (isNaN(newDate.getTime())) {
      setError("Please enter a valid date!");
      return;
    }
    
    setEventDate(newDate);
    setError("");
  };

  const handleTimeChange = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const newTime = new Date(eventTime);
    
    if (hours === undefined || minutes === undefined || 
        isNaN(hours) || isNaN(minutes) || 
        hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      setError("Please enter a valid time!");
      return;
    }
    
    newTime.setHours(parseInt(hours));
    newTime.setMinutes(parseInt(minutes));
    setEventTime(newTime);
    setError("");
  };

  const getEventDateTime = () => {
    try {
      return new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate(),
        eventTime.getHours(),
        eventTime.getMinutes()
      );
    } catch (error) {
      console.error("Error calculating event date:", error);
      return new Date();
    }
  };

  const eventDateTime = getEventDateTime();

  const [eventPublisher, setEventPublisher] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setEventPublisher(u);
      console.log("Publisher set to:", u.email, " ", u.uid);
    });

    return () => unsubscribe();
  }, []);

  const handleAddPhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      if (file.size > 1024 * 1024) {
        Alert.alert("Error", "Ju lutem zgjidhni nje imazh me te vogel se 1MB");
        return;
      }
      
      setUploadingImage(true);
      
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Image = event.target.result;
          setEventPhoto(base64Image);
          setUploadingImage(false);
        };
        reader.onerror = () => {
          Alert.alert("Error", "Procesimi i imazhit deshtoi");
          setUploadingImage(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Error", "Procesimi i imazhit deshtoi");
        setUploadingImage(false);
      }
    };
    
    input.click();
  };

  const handleRemovePhoto = () => {
    setEventPhoto(null);
  };

  const addEvent = async () => {
    if (!eventTitle.trim() || !eventLocation.trim() || !eventDescription.trim() || !eventPublisher) {
      setError("Ju lutemi plotesoni te gjitha fushat!");
      return;
    }

    if (isNaN(eventDate.getTime())) {
      setError("Ju lutemi jepni nje date te vlefshme!");
      return;
    }

    if (isNaN(eventTime.getTime())) {
      setError("Ju lutemi jepni nje kohe te vlefshme");
      return;
    }

    if (eventDateTime < new Date()) {
      setError("Data ose koha eshte vendosur gabim! Eventi duhet te jete ne te ardhmen.");
      return;
    }

  
    const eventImage = eventPhoto || generateRandomEventImage();

    const newEvent = {
      title: eventTitle,
      date: eventDate,
      time: eventTime,
      location: eventLocation,
      description: eventDescription,
      publisher: eventPublisher.uid,
      eventPhoto: eventImage,
      createdAt: new Date()
    };

    try {
      await addDoc(collection(db, "events"), newEvent);
      
      setModalVisible(true);
      setModalType("success");
      setModalMessage("Event created successfully!");

      setError("");
      setEventTitle("");
      setEventDate(new Date());
      setEventTime(new Date());
      setEventLocation("");
      setEventDescription("");
      setEventPhoto(null);
    } catch (error) {
      console.error("Error adding event: ", error);
      setError("Failed to create event. Please try again.");
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    if (modalType === "success") {
      router.back();
    }
  };

  const getSafeDateValue = () => {
    try {
      return eventDate.toISOString().slice(0, 10);
    } catch (error) {
      return new Date().toISOString().slice(0, 10);
    }
  };

  const getSafeTimeValue = () => {
    try {
      return eventTime.toTimeString().slice(0, 5);
    } catch (error) {
      return new Date().toTimeString().slice(0, 5);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.label}>Emri Eventit</Text>
        <TextInput
          style={styles.input}
          placeholder="p.sh Coding Workshop"
          placeholderTextColor="gray"
          value={eventTitle}
          onChangeText={setEventTitle}
        />
        
        <Text style={styles.label}>Foto e Eventit (Opsionale)</Text>
        <View style={styles.photoSection}>
          {eventPhoto ? (
            <View style={styles.photoPreviewContainer}>
              <Image source={{ uri: eventPhoto }} style={styles.photoPreview} />
              <TouchableOpacity style={styles.removePhotoButton} onPress={handleRemovePhoto}>
                <Ionicons name="close-circle" size={24} color="#820D0D" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.photoUploadButton, uploadingImage && styles.uploadingButton]} 
              onPress={handleAddPhoto}
              disabled={uploadingImage}
            >
              <Ionicons name="camera" size={24} color={uploadingImage ? "#999" : "#820D0D"} />
              <Text style={[styles.photoUploadText, uploadingImage && styles.uploadingText]}>
                {uploadingImage ? "Processing..." : "Shto Nje Foto Eventit"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.dateTimeRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data</Text>

            {Platform.OS === "web" ? (
              <input
                type="date"
                value={getSafeDateValue()}
                onChange={(e) => handleDateChange(e.target.value)}
                style={{ 
                  padding: 10, 
                  borderRadius: 8, 
                  border: "1px solid #ccc",
                  backgroundColor: "#fafafa"
                }}
                min={new Date().toISOString().split('T')[0]}
              />
            ) : (
              <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                <Text style={{ color: "gray" }}>
                  {isNaN(eventDate.getTime()) ? "Select Date" : eventDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            )}

            {showDatePicker && (
              <DateTimePicker
                value={isNaN(eventDate.getTime()) ? new Date() : eventDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setEventDate(selectedDate);
                }}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Koha</Text>

            {Platform.OS === "web" ? (
              <input
                type="time"
                value={getSafeTimeValue()}
                onChange={(e) => handleTimeChange(e.target.value)}
                style={{ 
                  padding: 10, 
                  borderRadius: 8, 
                  border: "1px solid #ccc",
                  backgroundColor: "#fafafa"
                }}
              />
            ) : (
              <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
                <Text style={{ color: "gray" }}>
                  {isNaN(eventTime.getTime()) ? "Select Time" : eventTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
              </TouchableOpacity>
            )}

            {showTimePicker && (
              <DateTimePicker
                value={isNaN(eventTime.getTime()) ? new Date() : eventTime}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) setEventTime(selectedTime);
                }}
              />
            )}
          </View>
        </View>

        <Text style={styles.label}>Lokacioni</Text>
        <TextInput
          style={styles.input}
          placeholder="p.sh FIEK, Prishtine"
          placeholderTextColor="gray"
          value={eventLocation}
          onChangeText={setEventLocation}
        />

        <Text style={styles.label}>Pershkrimi</Text>
        <TextInput
          style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
          placeholder="Pershkruaj detajet e eventit, agjenden, dhe speakers."
          placeholderTextColor="gray"
          multiline
          value={eventDescription}
          onChangeText={setEventDescription}
        />

        <TouchableOpacity style={styles.submitButton} onPress={addEvent}>
          <Ionicons name="calendar-sharp" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.submitText}>Shto Eventin</Text>
        </TouchableOpacity>
        {error ? <Text style={{ color: 'red', fontSize: 18, textAlign: "center", marginTop: 10 }}>{error}</Text> : null}
        <ConfirmModal
          visible={modalVisible}
          type={modalType}
          message={modalMessage}
          onClose={handleModalClose}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginHorizontal: -5,
  },
  inputGroup: {
    flex: 1,
    paddingHorizontal: 5,
  },
  label: {
    color: "#820D0D",
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#848484ff",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fafafa",
  },
  
  photoSection: {
    marginBottom: 10,
  },
  photoUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: "#820D0D",
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    backgroundColor: "#fafafa",
    width: '100%',
  },
  uploadingButton: {
    borderColor: "#999",
  },
  photoUploadText: {
    color: "#820D0D",
    fontWeight: "600",
    marginLeft: 8,
  },
  uploadingText: {
    color: "#999",
  },
  photoPreviewContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  photoPreview: {
    width: 200,
    height: 150,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#820D0D",
  },
  removePhotoButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  submitButton: {
    backgroundColor: "#820D0D",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
});