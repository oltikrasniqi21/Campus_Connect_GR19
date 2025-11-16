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
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { collection, query, orderBy, onSnapshot, addDoc } from "firebase/firestore";
import  ConfirmModal  from "../components/ConfirmModal.jsx";
import {db} from "../firebase"
import DateTimePicker from "@react-native-community/datetimepicker";


export default function AddEvent() {
  const router = useRouter();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);


  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [eventTime, setEventTime] = useState(new Date());
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("")
  const [modalMessage, setModalMessage] = useState("")

  //perdoret vetem me krahasu nese koha eventit eshte me e madhe se data aktuale
  const eventDateTime = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate(),
      eventTime.getHours(),
      eventTime.getMinutes()
  );

  const addEvent = async () => {
    if (!eventTitle.trim() || !eventLocation.trim() || !eventDescription.trim()) {
      setError("Please fill all fields!");
      return;
    }

    if(eventDateTime < new Date()  || eventDateTime < new Date()){
      setError("Data ose koha eshte vendosur gabim!");
      return;
    }

    const newEvent = {
      title: eventTitle,
      date: eventDate,
      time: eventTime,
      location: eventLocation,
      description: eventDescription,
    };

    try{
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
    }catch(error){
      console.error("Error adding event: ", error);
    }
  };

  const handleModalClose = () => {
        setModalVisible(false);
  }


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
        
        <View style={styles.dateTimeRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Data</Text>

            {Platform.OS === "web" ? (
              <input
                type="date"
                value={eventDate.toISOString().slice(0, 10)}
                onChange={(e) => setEventDate(new Date(e.target.value))}
                style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
              />
            ) : (
                <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
                  <Text style={{color:"gray"}}>{eventDate.toLocaleDateString()}</Text>
                </TouchableOpacity>
            )}

            {showDatePicker && (
              <DateTimePicker
                value={eventDate}
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
                  value={eventTime.toTimeString().slice(0,5)}
                  onChange={(e) => {
                    const [hours, minutes] = e.target.value.split(":");
                    const newTime = new Date(eventTime);
                    newTime.setHours(hours);
                    newTime.setMinutes(minutes);
                    setEventTime(newTime);
                  }}
                  style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
                />
              ) : (
              <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
                <Text style={{color:"gray"}}>{eventTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
              </TouchableOpacity>
            )}

              {showTimePicker && (
                <DateTimePicker
                  value={eventTime}
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
          <Ionicons name="calendar-sharp" size={20} color="#fff" style={{marginRight: 8}}/>
          <Text style={styles.submitText}>Shto Eventin</Text>
        </TouchableOpacity>
        {error ? <Text style={{color: 'red', fontSize: 18, textAlign:"center", marginTop: 10}}>{error}</Text> : null}
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
  },
  headerContainer: {
    paddingVertical: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#820D0D',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
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
  infoBox: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
  },
  infoInput: {
    color: "#333",
    fontSize: 14,
    lineHeight: 20,
    textAlignVertical: "top", 
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
