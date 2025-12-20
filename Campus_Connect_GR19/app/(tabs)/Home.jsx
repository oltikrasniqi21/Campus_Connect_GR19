import { ScrollView, StyleSheet } from "react-native";
import { Flashcard } from "@/components/Homepage/flashcards.jsx";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  registerLocalNotifications,
  newEventAdded
} from "../notifications";
import { useEffect, useState, useRef } from "react";
import { Text, View } from "react-native";
import { screenWidth } from "./_layout";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

export default function TabOneScreen() {
  const { user, loading } = useAuth();
  const [events, setEvents] = useState([]);

  const initialLoad = useRef(true);

  useEffect(() => {
    registerLocalNotifications();
  }, []);
  
  useEffect(() => {
    if (loading || !user) return;

    const q = query(collection(db, "events"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {

    if (!initialLoad.current) {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const event = change.doc.data();
          newEventAdded(event.title);
        }
      });
    }

    initialLoad.current = false;

      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setEvents(data);
    });

    return unsub;
  }, [loading, user?.id]);
  
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Welcome, User</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {user.firstname || "User"}</Text>

      <ScrollView style={styles.eventsContainer}>
        <Text style={styles.sectionTitle}>Eventet Aktuale!</Text>
        {events.map((event) => {
          const date = event.date?.toDate?.()
            ? event.date.toDate().toLocaleDateString()
            : "No date";

          const time = event.time?.toDate?.()
            ? event.time
                .toDate()
                .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : event.time || "No time";

          return (
            <Flashcard
              key={event.id}
              id={event.id}
              title={event.title}
              date={date}
              time={time}
              location={event.location}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  eventsContainer: {
    width: "100%",
    paddingRight: 15,
    paddingLeft: 5,
    rowGap: 10,
  },
  sectionTitle: {
    fontSize: screenWidth * 0.07,
    fontWeight: "bold",
    fontFamily: "Montserrat",
    marginTop: 10,
    marginBottom: 10,
  },
  welcome: {
    fontSize: 22,
    fontWeight: "700",
    color: "#820D0D",
    marginTop: 25,
    marginBottom: 15,
    alignSelf: "flex-start",
    marginLeft: 10,
    fontFamily: "Montserrat",
  },
});
