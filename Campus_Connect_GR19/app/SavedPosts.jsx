import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useRouter } from 'expo-router';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Flashcard } from '../components/Homepage/flashcards.jsx';

const folders = [
  { id: '1', name: "Important" },
  { id: '2', name: "Events" },
  { id: '3', name: "Study Groups" },
  { id: '4', name: "Summer '25" },
];

export default function SavedPosts() {
  const router = useRouter();
  const [savedEvents, setSavedEvents] = useState([]);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email);

      const q = query(
        collection(db, "saved_events"),
        where("savedBy", "==", user.uid)
      );

      const unsub = onSnapshot(q, snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSavedEvents(data);
      });

      return unsub;
    }
  }, []);

  const openFolder = (folder) => {
    router.push(`/SavedFolder/${folder.id}`);
  };

  const renderFolder = ({ item }) => (
    <View style={styles.folderCard} key={item.id}>
      <Text style={styles.folderTitle}>{item.name}</Text>
      <Text style={styles.folderSubtitle}>4 items</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Folders</Text>
      <FlatList
        data={folders}
        renderItem={renderFolder}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        scrollEnabled={false}
      />

      <Text style={[styles.header, { marginTop: 30 }]}>Recently Saved</Text>
      <FlatList
        data={savedEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Flashcard
            id={item.id}
            title={item.title}
            date={item.date}
            time={item.time}
            location={item.location}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F9F9F9' },
  header: { fontSize: 22, fontWeight: "800", color: '#8B0000', marginBottom: 15 },
  columnWrapper: { justifyContent: "space-between", marginBottom: 10 },
  folderCard: {
    backgroundColor: '#c5c5c5ff',
    padding: 20,
    borderRadius: 15,
    flex: 1,
    marginHorizontal: 5,
    height: 100,
    justifyContent: "space-between",
  },
  folderTitle: { fontWeight: "bold", fontSize: 16, color: '#333333' },
  folderSubtitle: { fontSize: 12, color: '#666666' },
});
