import { useLocalSearchParams } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useEffect, useState } from "react";

export default function EventDetails() {
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const loadEvent = async () => {
      const ref = doc(db, "events", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setEvent({ id: snap.id, ...snap.data() });
      }
    };

    loadEvent();
  }, [id]);

  if (!event) return <Text style={styles.loading}>Loading...</Text>;

  const date = event.date?.toDate?.()
    ? event.date.toDate().toLocaleDateString()
    : "No date";

  const time = event.time?.toDate?.()
    ? event.time.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : event.time || "No time";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>

      <Text style={styles.info}>📍 {event.location}</Text>
      <Text style={styles.info}>📅 {date}</Text>
      <Text style={styles.info}>⏰ {time}</Text>
      <Text style={styles.desc}>{event.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  loading: { marginTop: 50, fontSize: 20, textAlign: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10 },
  info: { fontSize: 18, marginBottom: 8 },
  desc: { marginTop: 15, fontSize: 16 },
});
