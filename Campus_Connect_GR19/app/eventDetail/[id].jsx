import { useLocalSearchParams } from "expo-router";
import { 
  Text, 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Linking, 
  Platform ,
  Image
} from "react-native";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import MyMap from "../../components/MyMap"; 
import ConfirmModal from "../../components/ConfirmModal";
import { useRouter } from "expo-router";

  export default function EventDetails() {
    const { id } = useLocalSearchParams(); 
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user, loadingg } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState("");
    const [modalMessage, setModalMessage] = useState("");

    const router = useRouter();

    useEffect(() => {
      const loadEvent = async () => {
        try {
          const docRef = doc(db, "events", id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setEvent({ id: docSnap.id, ...docSnap.data() });
          } else {
            setEvent(null);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      loadEvent();
    }, [id]);

    if (loading) return <Text style={styles.loading}>Loading...</Text>;
    if (!event) return <Text style={styles.loading}>Event not found</Text>;

    const date = event.date?.toDate?.()
      ? event.date.toDate().toLocaleDateString()
      : event.date || "No date";

    const time = event.time?.toDate?.()
      ? event.time.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : event.time || "No time";

  const deleteEvent = async (id) => {
    await deleteDoc(doc(db, "events", id));
    setModalType("success");
    setModalMessage("Event deleted successfully.");
    setModalVisible(true);
  };

  const openExternalMap = () => {
    let url = "";
    
    if (event.coordinates) {
      const { latitude, longitude } = event.coordinates;
      const label = encodeURIComponent(event.title || "Event Location");

      if (Platform.OS === 'ios') {
        url = `maps:0,0?q=${label}@${latitude},${longitude}`;
      } else if (Platform.OS === 'android') {
        url = `geo:0,0?q=${latitude},${longitude}(${label})`;
      } else {
        url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      }
    } 
    else if (event.location) {
      const query = encodeURIComponent(event.location);
      if (Platform.OS === 'ios') {
        url = `maps:0,0?q=${query}`;
      } else if (Platform.OS === 'android') {
        url = `geo:0,0?q=${query}`;
      } else {
        url = `https://www.google.com/maps/search/?api=1&query=${query}`;
      }
    }

    if (url) {
      Linking.openURL(url).catch(err => console.error("An error occurred", err));
    }
  };

    return (
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>{event.title}</Text>
          <View>
            {event.eventPhoto && (
              <Image
                source={{ uri: event.eventPhoto }}
                style={{
                  width: "100%",
                  height: 200,
                  borderRadius: 16,
                  marginBottom: 15,
                  resizeMode: "cover",
                }}
              />
        )}
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.icon}>📍</Text>
            <Text style={styles.infoText}>{event.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.icon}>📅</Text>
            <Text style={styles.infoText}>{date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.icon}>⏰</Text>
            <Text style={styles.infoText}>{time}</Text>
          </View>

        <Text style={styles.sectionTitle}>Detaje</Text>
        <Text style={styles.description}>{event.description}</Text>

        <Text style={styles.sectionTitle}>Harta</Text>
        
        {event.coordinates ? (
          <MyMap 
            initialCoords={event.coordinates} 
            readOnly={true} 
          />
        ) : (
          <View style={styles.noMapContainer}>
             <Ionicons name="location-outline" size={40} color="#ccc" />
             <Text style={styles.noMapText}>No pin dropped for this event.</Text>
          </View>
        )}

        <TouchableOpacity style={styles.mapButton} onPress={openExternalMap}>
          <Ionicons name="map" size={20} color="white" style={{marginRight: 10}} />
          <Text style={styles.mapButtonText}>
            {event.coordinates 
              ? `Open Pin in ${Platform.OS === 'ios' ? 'Apple Maps' : 'Google Maps'}`
              : `Search "${event.location}" in Maps`
            }
          </Text>
        </TouchableOpacity>

        {user && user.uid === event.publisherId && (
          <TouchableOpacity style={styles.deleteButton} onPress={() => deleteEvent(id)}>
            <Text style={{color: 'white', marginTop: 30, fontWeight: 'bold'}}>Delete Event</Text>
          </TouchableOpacity>
        )}

          <ConfirmModal
            visible={modalVisible}
            type={modalType}
            message={modalMessage}
            onClose={() => router.back()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
   deleteButton: { 
    alignItems: 'center',
    backgroundColor: '#820d0d',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 35 
  },
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 15,
  },
  loading: {
    marginTop: 50,
    fontSize: 18,
    textAlign: "center",
    color: "#820D0D",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#820D0D",
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  infoText: {
    fontSize: 18,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#820D0D",
    marginTop: 20,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
  },
  mapButton: {
    backgroundColor: "#820D0D", 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 15,
    elevation: 2
  },
  mapButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noMapContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#eee'
  },
  noMapText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    fontWeight: '500'
  },
});