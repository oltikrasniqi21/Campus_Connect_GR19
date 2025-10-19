import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Platform, Stack  } from "react-native";
import { useRouter } from 'expo-router';


const recentlySaved = [
  { id: '1', title: "Study Group at 626.", photo: require('../assets/images/studygroup.jpeg') },
  { id: '2', title: "FIEK Party at Rooftop", photo: require('../assets/images/studentParty.jpeg') },
  { id: '3', title: "Regjistrimi per semestrin e 4", photo: require('../assets/images/semestri4.jpeg') },
  { id: '4', title: "ID e humbur", photo: require('../assets/images/studentID.jpeg') },
];


const folders = [
  { id: '1', name: "Important" },
  { id: '2', name: "Events" },
  { id: '3', name: "Study Groups" },
  { id: '4', name: "Summer '25" },
];

export default function SavedPosts() {
   
  const router = useRouter();

const openFolder = (folder) => {
  router.push(`/SavedFolder/${folder.id}`);
};

 
  const renderFolder = ({ item }) => (
    <TouchableOpacity style={styles.folderCard} onPress={() => openFolder(item)}>
      <Text style={styles.folderTitle}>{item.name}</Text>
      <Text style={styles.folderSubtitle}>4 items</Text>
    </TouchableOpacity>
  );

  const renderRecent = ({ item }) => (
    <View style={styles.recentCard}>
      <Image source={item.photo} style={styles.recentImage} />
      <Text style={styles.recentTitle} numberOfLines={1}>{item.title}</Text>
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
        data={recentlySaved}
        renderItem={renderRecent}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.recentListContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
  header: {
    fontSize: 22,
    fontWeight: "800",
    color: '#8B0000',
    marginBottom: 15,
  },

  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 10
  },

  folderCard: {
    backgroundColor: '#c5c5c5ff',
    padding: 20,
    borderRadius: 15,
    flex: 1,
    marginHorizontal: 5,
    height: 100,
    justifyContent: "space-between",
  },

  folderTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: '#333333'
  },

  folderSubtitle: {
    fontSize: 12,
    color: '#666666',
  },

  recentListContainer: {
    paddingRight: 16,
  },

  recentCard: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 15,
    alignItems: "flex-start",
  },

  recentImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
    backgroundColor: '#ddd'
  },

  recentTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: '#333333',
  },
});
