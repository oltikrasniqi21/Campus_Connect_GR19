import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Platform, StatusBar } from "react-native";
import { useLocalSearchParams } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Flashcard } from '../../components/Homepage/flashcards.jsx';

export default function FolderScreen() {
  const { id } = useLocalSearchParams(); 
  const [posts, setPosts] = useState([]);

  // Fetch posts from folder_posts subcollection
  useEffect(() => {
    const fetchFolderPosts = async () => {
      try {
        const postsSnapshot = await getDocs(
          collection(db, "folders", id, "folder_posts")
        );
        const data = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPosts(data);
      } catch (error) {
        console.error("Error fetching folder posts:", error);
      }
    };

    fetchFolderPosts();
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
