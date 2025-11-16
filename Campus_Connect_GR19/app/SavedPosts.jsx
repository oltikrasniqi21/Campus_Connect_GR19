import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';
import { collection, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Flashcard } from '../components/Homepage/flashcards.jsx';

export default function SavedPosts() {
  const router = useRouter();
  const [savedEvents, setSavedEvents] = useState([]);
  const [folders, setFolders] = useState([]);

  // Fetch saved events
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const q = collection(db, "saved_events");
      const unsub = onSnapshot(q, snapshot => {
        const data = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(event => event.savedBy === user.uid);
        setSavedEvents(data);
      });

      return unsub;
    }
  }, []);

  // Fetch folders
  useEffect(() => {
    const foldersRef = collection(db, "folders");
    const unsub = onSnapshot(foldersRef, snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFolders(data);
    });

    return unsub;
  }, []);

  const openFolder = (folder) => {
    // Navigate to SavedFolder/[id].jsx
    router.push(`/SavedFolder/${folder.id}`);
  };

  const renderFolder = ({ item }) => (
    <TouchableOpacity style={styles.folderCard} key={item.id} onPress={() => openFolder(item)}>
      <Text style={styles.folderTitle}>{item.name}</Text>
      <Text style={styles.folderSubtitle}>Folder</Text>
    </TouchableOpacity>
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
