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

// Assuming you have a component that handles date/time picking, 
// for simplicity here we use TextInput. In a real app, you'd use a DatePicker.

export default function AddEvent() {
  const router = useRouter();

  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState(""); 
  const [eventTime, setEventTime] = useState(""); 
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const handleSubmit = () => {
    if (!eventTitle.trim() || !eventDate.trim() || !eventTime.trim()) {
      alert("Please fill in the Title, Date, and Time fields.");
      return;
    }

    const newEvent = {
      id: Date.now().toString(),
      title: eventTitle,
      date: eventDate,
      time: eventTime,
      location: eventLocation,
      description: eventDescription,
      contact: contactInfo,
    };

    router.replace({
      pathname: "/(tabs)/Home",
      params: { newEvent: JSON.stringify(newEvent) },
    });
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
          value={eventTitle}
          onChangeText={setEventTitle}
        />
        
        <View style={styles.dateTimeRow}>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Data</Text>
                <TextInput
                    style={styles.input}
                    placeholder="DD/MM/YYYY"
                    value={eventDate}
                    onChangeText={setEventDate}
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Koha</Text>
                <TextInput
                    style={styles.input}
                    placeholder="HH:MM AM/PM"
                    value={eventTime}
                    onChangeText={setEventTime}
                />
            </View>
        </View>


        <Text style={styles.label}>Lokacioni</Text>
        <TextInput
          style={styles.input}
          placeholder="p.sh FIEK, Prishtine"
          value={eventLocation}
          onChangeText={setEventLocation}
        />

        <Text style={styles.label}>Pershkrimi</Text>
        <TextInput
          style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
          placeholder="Pershkruaj detajet e eventit, agjenden, dhe speakers."
          multiline
          value={eventDescription}
          onChangeText={setEventDescription}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Ionicons name="calendar-sharp" size={20} color="#fff" style={{marginRight: 8}}/>
          <Text style={styles.submitText}>Shto Eventin</Text>
        </TouchableOpacity>
        <View style={{ height: 50 }} />
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
    borderColor: "#ddd",
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
