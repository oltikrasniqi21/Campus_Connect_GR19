import { useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export default function EventDetails() {
  const { id } = useLocalSearchParams(); 
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{event.title}</Text>
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
});
