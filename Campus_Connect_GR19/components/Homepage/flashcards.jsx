import { 
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  FlatList,
  TextInput
} from 'react-native';
import React, { useState, useEffect, useCallback, memo } from 'react';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Dimensions } from "react-native";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
  query,
  where
} from "firebase/firestore";
import { db, auth } from '../../firebase';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get("window");

const FlashcardComponent = ({ id, title, date, time, location }) => {
  const [saved, setSaved] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [folders, setFolders] = useState([]);
  const [newFolderModalVisible, setNewFolderModalVisible] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const checkSaved = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return setSaved(false);

    const snap = await getDoc(doc(db, "saved_events", id));
    setSaved(snap.exists() && snap.data().savedBy === user.uid);
  }, [id]);

  useFocusEffect(useCallback(() => {
    checkSaved();
  }, [checkSaved]));

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const foldersRef = collection(db, "folders");
    const q = query(foldersRef, where("createdBy", "==", user.uid));

    const unsub = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFolders(data);
    });

    return () => unsub();
  }, []);

  const toggleSave = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) return;

    const eventRef = doc(db, "saved_events", id);

    if (saved) {
      await deleteDoc(eventRef);
      setSaved(false);
    } else {
      await setDoc(eventRef, {
        id,
        title,
        date,
        time,
        location,
        savedBy: user.uid,
        savedAt: new Date()
      });
      setSaved(true);
    }
  }, [id, title, date, time, location, saved]);

  const saveToFolder = useCallback(async (folderId) => {
    const user = auth.currentUser;
    if (!user) return;

    const data = {
      id,
      title,
      date,
      time,
      location,
      savedBy: user.uid,
      savedAt: new Date()
    };

    await setDoc(doc(db, "folders", folderId, "folder_posts", id), data);
    await setDoc(doc(db, "saved_events", id), data);

    setModalVisible(false);
    setSaved(true);
  }, [id, title, date, time, location]);

  const createNewFolder = useCallback(async () => {
    const user = auth.currentUser;
    if (!user || !newFolderName.trim()) return;

    const folderRef = doc(collection(db, "folders"));
    await setDoc(folderRef, {
      name: newFolderName.trim(),
      createdAt: new Date(),
      createdBy: user.uid
    });

    setNewFolderName("");
    setNewFolderModalVisible(false);
  }, [newFolderName]);

  const renderFolderItem = useCallback(
    ({ item }) => (
      <Pressable
        onPress={() => saveToFolder(item.id)}
        style={styles.folderSelectItem}
      >
        <Ionicons
          name="folder-outline"
          size={20}
          color="#820d0d"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.folderText}>{item.name}</Text>
      </Pressable>
    ),
    [saveToFolder]
  );

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.info}>
          {date} <Text style={{ fontWeight: 'bold' }}>{time}</Text>{'\n'}
          Lokacioni: {location}
        </Text>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity activeOpacity={0.7}>
          <Link href={`eventDetail/${id}`} style={styles.seeMoreLink}>
            <View style={styles.seeMoreButton}>
              <Text style={styles.seeMoreText}>See More</Text>
              <Entypo name="chevron-right" size={width * 0.085} color="#fcfcfc" />
            </View>
          </Link>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.heartButton}
          onPress={toggleSave}
          onLongPress={() => setModalVisible(true)}
        >
          <Ionicons
            name={saved ? "heart" : "heart-outline"}
            size={width * 0.08}
            color={saved ? "#820d0d" : "#000"}
          />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Choose Folder</Text>

            <FlatList
              data={folders}
              keyExtractor={(item) => item.id}
              renderItem={renderFolderItem}
              style={{ maxHeight: 200 }}
            />

            <Pressable
              onPress={() => setNewFolderModalVisible(true)}
              style={styles.addFolderBtn}
            >
              <Text style={styles.addFolderText}>+ Add New Folder</Text>
            </Pressable>

            <Pressable
              onPress={() => setModalVisible(false)}
              style={{ marginTop: 15 }}
            >
              <Text style={{ textAlign: 'center', color: 'red', fontWeight: '600' }}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent
        visible={newFolderModalVisible}
        onRequestClose={() => setNewFolderModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>New Folder Name</Text>

            <TextInput
              value={newFolderName}
              onChangeText={setNewFolderName}
              placeholder="Folder name"
              style={styles.input}
            />

            <Pressable onPress={createNewFolder} style={styles.createBtn}>
              <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
                Create
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setNewFolderModalVisible(false)}
              style={{ marginTop: 15 }}
            >
              <Text style={{ textAlign: 'center', color: 'red' }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export const Flashcard = memo(FlashcardComponent);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: width * 0.25,
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 15
  },
  leftSection: { flex: 1 },
  rightSection: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "flex-end", 
    gap: 8 
  },
  title: { 
    fontSize: width * 0.055,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Montserrat' 
  },
  info: { 
    fontSize: width * 0.035,
    color: '#666',
    marginTop: 4,
    fontFamily: 'Montserrat' 
  },
  seeMoreButton: { 
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#820d0d',
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 35 
  },
  seeMoreText: {
    fontSize: 15,
    color: "#fcfcfc",
    fontWeight: "600",
    fontFamily: 'Montserrat'
  },
  heartButton: { padding: 5 },
  modalOverlay: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)' 
  },
  modalContent: { 
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowOpacity: 0.25,
    elevation: 10 
  },
  modalHeader: { 
    fontWeight: '800',
    fontSize: 20,
    marginBottom: 20, 
    textAlign: 'center', 
    color: '#820d0d',
    fontFamily: 'Montserrat'
  },
  folderSelectItem: { 
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15, 
    marginBottom: 10, 
    backgroundColor: '#f9f9f9', 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#eee' 
  },
  folderText: { 
    fontSize: 16, 
    color: '#333', 
    fontWeight: '500',
    fontFamily: 'Montserrat' 
  },
  addFolderBtn: { 
    padding: 12, 
    backgroundColor: '#fff', 
    borderRadius: 8,
    backgroundColor: '#820d0d',
    marginTop: 10, 
    borderWidth: 1, 
    borderColor: '#820d0d' 
  },
  addFolderText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontWeight: '700',
    fontFamily: 'Montserrat'
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 10, 
    padding: 12, 
    marginBottom: 20, 
    backgroundColor: '#fafafa',
    fontFamily: 'Montserrat'
  },
  createBtn: { 
    padding: 15, 
    backgroundColor: '#820d0d', 
    borderRadius: 10 
  }
});
