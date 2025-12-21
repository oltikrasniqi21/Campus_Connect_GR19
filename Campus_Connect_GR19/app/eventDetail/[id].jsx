  import { useLocalSearchParams, useRouter } from "expo-router";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import ConfirmModal from "@/components/ConfirmModal.jsx";

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
      try {
        await deleteDoc(doc(db, "events", id));
        setModalType("success");
        setModalMessage("Event deleted successfully.");
        setModalVisible(true);
      } catch (err) {
        console.error("Failed to delete event:", err);
      }
    };

    const handleModalClose = () => {
      setModalVisible(false);
      if (modalType === "success") {
      router.back();
    }
    }

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

          {user && user.id === event.publisher && (
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteEvent(id)}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                Delete Event
              </Text>
            </TouchableOpacity>
        )}

        <ConfirmModal
          visible={modalVisible}
          type={modalType}
          message={modalMessage}
          onClose={handleModalClose}
        />
      
        </View>
      </ScrollView>
    );
  }

  const styles = StyleSheet.create({
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
    deleteButton: {
      alignItems: "center",
      marginTop: 30,
      backgroundColor: '#820d0d',
      borderRadius: 10,
      marginBottom: 5,
      paddingVertical: 12,
    },
  });
