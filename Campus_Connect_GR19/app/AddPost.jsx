import React, { useState, useEffect } from "react";
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
  Modal,
  ActionSheetIOS,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { collection, addDoc } from "firebase/firestore";
import ConfirmModal from "../components/ConfirmModal.jsx";
import { db, auth } from "../firebase.js"; 
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

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
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [eventPublisher, setEventPublisher] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setEventPublisher(u);
    });
    return () => unsubscribe();
  }, []);

  const handleAddPhotoPress = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Take Photo", "Choose from Library"],
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) await pickFromCamera();
          if (buttonIndex === 2) await pickFromLibrary();
        }
      );
    } else {
      setShowImagePickerModal(true);
    }
  };

  const pickFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Camera access is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3], 
      quality: 1,
    });

    if (!result.canceled) {
      await processImage(result.assets[0].uri);
    }
  };

  const pickFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Media library access is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3], 
      quality: 1,
    });

    if (!result.canceled) {
      await processImage(result.assets[0].uri);
    }
  };

  const processImage = async (uri) => {
    try {
      setUploadingImage(true);

   
      const manipulated = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], 
        {
          compress: 0.6,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      const base64String = `data:image/jpeg;base64,${manipulated.base64}`;
      setEventPhoto(base64String);
    } catch (error) {
      console.error("Image processing error:", error);
      Alert.alert("Error", "Failed to process image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemovePhoto = () => {
    setEventPhoto(null);
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
    if (hours === undefined || minutes === undefined) {
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
      return new Date();
    }
  };

  const addEvent = async () => {
    if (!eventTitle.trim() || !eventLocation.trim() || !eventDescription.trim() || !eventPublisher) {
      setError("Ju lutemi plotesoni te gjitha fushat!");
      return;
    }

    const fullDateTime = getEventDateTime();

    if (fullDateTime < new Date()) {
      setError("Data ose koha eshte vendosur gabim! Eventi duhet te jete ne te ardhmen.");
      return;
    }

    const finalEventImage = eventPhoto ? eventPhoto : null;

    const newEvent = {
      title: eventTitle,
      date: eventDate,
      time: eventTime,
      location: eventLocation,
      description: eventDescription,
      publisher: eventPublisher.uid,
      eventPhoto: finalEventImage,
      createdAt: new Date(),
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

  const getSafeDateValue = () => eventDate.toISOString().slice(0, 10);
  const getSafeTimeValue = () => eventTime.toTimeString().slice(0, 5);

  const ImagePickerModal = () => (
    <Modal
      visible={showImagePickerModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowImagePickerModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity 
            style={styles.modalOption}
            onPress={() => {
              setShowImagePickerModal(false);
              pickFromCamera();
            }}
          >
            <Ionicons name="camera-outline" size={24} color="#333" />
            <Text style={styles.modalOptionText}>Take Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.modalOption}
            onPress={() => {
              setShowImagePickerModal(false);
              pickFromLibrary();
            }}
          >
            <Ionicons name="images-outline" size={24} color="#333" />
            <Text style={styles.modalOptionText}>Choose from Library</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => setShowImagePickerModal(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

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
              onPress={handleAddPhotoPress} // Changed to use our new picker logic
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
                style={webInputStyle}
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
                style={webInputStyle}
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
          {uploadingImage ? (
             <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="calendar-sharp" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.submitText}>Shto Eventin</Text>
            </>
          )}
        </TouchableOpacity>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <ConfirmModal
          visible={modalVisible}
          type={modalType}
          message={modalMessage}
          onClose={handleModalClose}
        />

        <ImagePickerModal />
      </ScrollView>
    </SafeAreaView>
  );
}

const webInputStyle = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ccc",
  backgroundColor: "#fafafa",
  width: "100%",
  boxSizing: "border-box"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    color: "#820D0D",
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#848484ff",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fafafa",
    fontSize: 16,
  },
  photoSection: {
    marginBottom: 10,
    marginTop: 5,
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
    fontSize: 15,
  },
  uploadingText: {
    color: "#999",
  },
  photoPreviewContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  photoPreview: {
    width: '100%',
    aspectRatio: 4 / 3, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  removePhotoButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#fff',
    borderRadius: 15,
    zIndex: 10,
  },
  submitButton: {
    backgroundColor: "#820D0D",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 35,
    elevation: 3,
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
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: "center",
    marginTop: 15
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalOptionText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
  },
  cancelButton: {
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#820D0D",
    fontWeight: "600",
  },
});