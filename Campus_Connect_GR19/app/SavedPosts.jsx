import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase"; 
import { Flashcard } from "../components/Homepage/flashcards.jsx"; 
import { useAuth } from "../context/AuthContext";

export default function SavedPosts() {
  const { user, loading } = useAuth();
  const router = useRouter();  
  const [savedEvents, setSavedEvents] = useState([]);
  const [folders, setFolders] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [folderName, setFolderName] = useState("");

  useEffect(() => {
    if (loading || !user) return;
    const q = query(collection(db, "saved_events"), where("savedBy", "==", user.id));
    const unsub = onSnapshot(q, (snap) => setSavedEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, [loading, user?.id]);

  useEffect(() => {
    if (loading || !user) return;
    const q = query(collection(db, "folders"), where("createdBy", "==", user.id));
    const unsub = onSnapshot(q, (snap) => setFolders(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return unsub;
  }, [loading, user?.id]);


  const openFolder = useCallback((folder) => router.push(`/SavedFolder/${folder.id}`), [router]);

  const openEditModal = useCallback((folder) => {
    setSelectedFolder(folder);
    setFolderName(folder.name);
    setEditModalVisible(true);
  }, []);

  const renameFolder = async () => {
    if (!folderName.trim()) return;
    try {
      const folderRef = doc(db, "folders", selectedFolder.id);
      await setDoc(folderRef, { ...selectedFolder, name: folderName.trim() });
      setEditModalVisible(false);
    } catch (error) { console.error(error); }
  };

  const deleteFolder = async (folderId) => {
    try {
      const folderRef = doc(db, "folders", folderId);
      await deleteDoc(folderRef);
      setEditModalVisible(false);
    } catch (error) { Alert.alert("Delete Failed", error.message); }
  };

  const renderFolderItem = useCallback(({ item }) => (
    <TouchableOpacity style={styles.folderCard} onPress={() => openFolder(item)} testID={`folder-${item.id}`}>
      <View style={styles.folderContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.folderTitle} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.folderSubtitle}>Folder</Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(item)} testID={`edit-folder-${item.id}`}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  ), [openFolder, openEditModal]);

  const renderEventItem = useCallback(({ item }) => (
    <Flashcard
      id={item.id}
      title={item.title}
      date={item.date}
      time={item.time}
      location={item.location}
      saved={true}
    />
  ), []);

  if (loading) return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#820d0d" /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.header}>Your Folders</Text>
      </View>
     
      <View style={styles.foldersContainer}>
        <FlatList
          data={folders}
          renderItem={renderFolderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={true}
          removeClippedSubviews={true}
          initialNumToRender={4}
          ListEmptyComponent={<Text style={styles.emptyText}>No folders created.</Text>}
        />
      </View>

     
      <View style={styles.sectionHeaderContainer}>
        <Text style={styles.header}>Recently Saved</Text>
      </View>

      <View style={styles.eventsContainer}>
        <FlatList
          data={savedEvents}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: 20 }}
         
          removeClippedSubviews={true}
          initialNumToRender={2}
          ListEmptyComponent={<Text style={styles.emptyText}>No saved events.</Text>}
        />
      </View>

      
      <Modal
        animationType="fade" 
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Folder</Text>
            <TextInput
              value={folderName}
              onChangeText={setFolderName}
              placeholder="Folder name"
              style={styles.input}
            />
            <Pressable onPress={renameFolder} style={styles.saveButton} testID="rename-folder-button">
              <Text style={styles.buttonText}>Rename</Text>
            </Pressable>
            <Pressable  onPress={() => deleteFolder(selectedFolder.id)} style={styles.deleteButton} testID="delete-folder-button">
              <Text style={styles.buttonText}>Delete Folder</Text>
            </Pressable>
            <Pressable onPress={() => setEditModalVisible(false)} style={styles.cancelButton} testID="cancel-folder-button">
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: "#F9F9F9",
  
  },
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  sectionHeaderContainer: {
    marginBottom: 10,
    marginTop: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "800",
    color: "#8B0000",
  },
  

  foldersContainer: {
    height: 240, 
    marginBottom: 10,
  },
  eventsContainer: {
    flex: 1, 
    minHeight: 200, 
  },
  columnWrapper: { justifyContent: "space-between", marginBottom: 10 },
  folderCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    flex: 0.48, 
    marginVertical: 5,
    height: 100,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  folderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  folderTitle: { 
    fontWeight: "bold", 
    fontSize: 15, 
    color: "#333", 
    flexShrink: 1 },
  folderSubtitle: { 
    fontSize: 11, 
    color: "#666", 
    marginTop: 2 },
  editButton: { 
    backgroundColor: "#820d0d", 
    paddingVertical: 6, 
    paddingHorizontal: 10, 
    borderRadius: 8, 
    marginLeft: 5 },
  editButtonText: { 
    color: "#fff", 
    fontWeight: "600", 
    fontSize: 12 },
  emptyText: { 
    color: "#999", 
    fontStyle: "italic", 
    marginTop: 10 },

 
  modalOverlay: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { 
    width: "80%", 
    backgroundColor: "#fff", 
    borderRadius: 16, 
    padding: 20, 
    elevation: 5 },
  modalTitle: { 
    fontWeight: "bold", 
    fontSize: 18, 
    marginBottom: 15, 
    textAlign: 'center' },
  input: { 
    borderWidth: 1, 
    borderColor: "#E0E0E0", 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 15, 
    backgroundColor: '#FAFAFA' },
  saveButton: { 
    padding: 12, 
    backgroundColor: "#820d0d", 
    borderRadius: 8, 
    marginBottom: 10 },
  deleteButton: { 
    padding: 12, 
    backgroundColor: "#FF3B30", 
    borderRadius: 8, 
    marginBottom: 10 },
  cancelButton: { 
    marginTop: 5, 
    padding: 5 },
  buttonText: { 
    color: "#fff", 
    textAlign: "center", 
    fontWeight: "600" },
  cancelText: { 
    textAlign: "center", 
    color: "#666" }
});