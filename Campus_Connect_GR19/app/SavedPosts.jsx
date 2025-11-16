import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Pressable, Alert } from "react-native";
import { useRouter } from 'expo-router';
import { collection, onSnapshot, doc, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Flashcard } from '../components/Homepage/flashcards.jsx';

export default function SavedPosts() {
  const router = useRouter();
  const [savedEvents, setSavedEvents] = useState([]);
  const [folders, setFolders] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderName, setFolderName] = useState("");

  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const savedRef = collection(db, "saved_events");
    const q = query(savedRef, where("savedBy", "==", currentUser.uid));

    const unsub = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSavedEvents(data);
    });

    return unsub;
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const foldersRef = collection(db, "folders");
    const q = query(foldersRef, where("createdBy", "==", currentUser.uid));

    const unsub = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFolders(data);
    });

    return unsub;
  }, [currentUser]);

  const openFolder = (folder) => router.push(`/SavedFolder/${folder.id}`);
  const openEditModal = (folder) => {
    setSelectedFolder(folder);
    setFolderName(folder.name);
    setEditModalVisible(true);
  };

  const renameFolder = async () => {
    if (!folderName.trim()) return;
    try {
      const folderRef = doc(db, "folders", selectedFolder.id);
      await setDoc(folderRef, { ...selectedFolder, name: folderName.trim() });
      setEditModalVisible(false);
      setSelectedFolder(null);
      setFolderName("");
    } catch (error) {
      console.error("Error renaming folder:", error);
    }
  };

  const deleteFolder = async (folderId) => {
    try {
      if (!folderId) throw new Error("No folder ID provided");
      const folderRef = doc(db, "folders", folderId);
      await deleteDoc(folderRef);
      setEditModalVisible(false);
      setSelectedFolder(null);
      setFolderName("");
    } catch (error) {
      console.error(error);
      Alert.alert("Delete Failed", error.message);
    }
  };

  const renderFolder = ({ item }) => (
    <TouchableOpacity style={styles.folderCard} key={item.id} onPress={() => openFolder(item)}>
      <View style={styles.folderContent}>
        <View>
          <Text style={styles.folderTitle}>{item.name}</Text>
          <Text style={styles.folderSubtitle}>Folder</Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(item)}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
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
            saved={true} 
          />
        )}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)'}}>
          <View style={{ width:'80%', backgroundColor:'#fff', borderRadius:10, padding:20 }}>
            <Text style={{ fontWeight:'bold', fontSize:18, marginBottom:15 }}>Edit Folder</Text>
            <TextInput
              value={folderName}
              onChangeText={setFolderName}
              placeholder="Folder name"
              style={{ borderWidth:1, borderColor:'#ccc', borderRadius:8, padding:10, marginBottom:15 }}
            />
            <Pressable onPress={renameFolder} style={{ padding:12, backgroundColor:'#820d0d', borderRadius:8, marginBottom:10 }}>
              <Text style={{ color:'#fff', textAlign:'center', fontWeight:'600' }}>Rename</Text>
            </Pressable>
            <Pressable onPress={() => deleteFolder(selectedFolder.id)} style={{ padding:12, backgroundColor:'#FF3B30', borderRadius:8, marginBottom:10 }}>
              <Text style={{ color:'#fff', textAlign:'center', fontWeight:'600' }}>Delete Folder</Text>
            </Pressable>
            <Pressable onPress={() => setEditModalVisible(false)} style={{ marginTop:10 }}>
              <Text style={{ textAlign:'center', color:'red' }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F9F9F9' },
  header: { fontSize: 22, fontWeight: "800", color: '#8B0000', marginBottom: 15 },
  columnWrapper: { justifyContent: "space-between", marginBottom: 10 },
  folderCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 5,
    height: 100,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  folderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  folderTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: '#333333'
  },
  folderSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4
  },
  editButton: {
    backgroundColor: '#820d0d',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
