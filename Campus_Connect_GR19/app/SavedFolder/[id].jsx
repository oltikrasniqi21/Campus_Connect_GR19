import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Platform, StatusBar } from "react-native";
import { useLocalSearchParams } from 'expo-router';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { Flashcard } from '../../components/Homepage/flashcards.jsx';

export default function FolderScreen() {
  const { id } = useLocalSearchParams(); 
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const folderRef = collection(db, "folders", id, "folder_posts");

    const q = query(folderRef, where("savedBy", "==", auth.currentUser.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(data);
    }, (error) => {
      console.error("Error fetching folder posts:", error);
    });

    return () => unsubscribe();
  }, [id]);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
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
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 8 : 16,
  },
});
