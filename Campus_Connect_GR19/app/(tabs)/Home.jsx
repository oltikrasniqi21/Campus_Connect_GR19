import { ScrollView, StyleSheet } from "react-native";

import { Flashcard } from "@/components/Homepage/flashcards.jsx";
import { router } from "expo-router";
import { collection, onSnapshot, orderBy, query, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { auth } from "../../firebase";
import { screenWidth } from "./_layout";
import { db } from "../../firebase";

export default function TabOneScreen() {
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserEmail(user.email);
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserName(`${data.firstname} ${data.lastname}`); 
        } else {
          setUserName("User");
        }
      } else {
        router.replace("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const ref = collection(db, "events");

    const unsub = onSnapshot(ref, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(data);
    });

    return unsub;
  }, []);

  const loadEvents = (user, setEvents) => {
    const eventsRef = collection(db, "events");
    const q = query(eventsRef, orderBy("createdAt", "desc"));

    return onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setevents(events);
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome, {userName || "User"}</Text>

      <ScrollView style={styles.eventsContainer}>
        <Text style={styles.sectionTitle}>Eventet Aktuale!</Text>
        {events.map((event) => {
          const date = event.date?.toDate?.()
            ? event.date.toDate().toLocaleDateString()
            : "No date";

          const time = event.time?.toDate?.()
            ? event.time.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
          )
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
