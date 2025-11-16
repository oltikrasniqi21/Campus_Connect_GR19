import { TouchableOpacity, StyleSheet, Text, View, Modal, Pressable, FlatList, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Dimensions } from "react-native";
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from '../../firebase';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const { width } = Dimensions.get("window");

export function Flashcard({ id, title, date, time, location }) {
    const [saved, setSaved] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [folders, setFolders] = useState([]);
    const [newFolderModalVisible, setNewFolderModalVisible] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");

    useFocusEffect(
    useCallback(() => {
        checkSaved(); 
    }, [id])
);

    const checkSaved = async () => {
        try {
            const eventSnap = await getDoc(doc(db, "saved_events", id));
            setSaved(eventSnap.exists());
        } catch (error) {
            console.error("Error checking saved event:", error);
        }
    };

    useEffect(() => {
        checkSaved();
    }, [id]);

    useEffect(() => {
        const foldersRef = collection(db, "folders");
        const unsub = onSnapshot(foldersRef, snapshot => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFolders(data);
        });
        return () => unsub();
    }, []);

    const toggleSave = async () => {
        try {
            const eventRef = doc(db, "saved_events", id);

            if (saved) {
                await deleteDoc(eventRef);
                const foldersSnap = await getDocs(collection(db, "folders"));
                for (const folderDoc of foldersSnap.docs) {
                    const postRef = doc(db, "folders", folderDoc.id, "folder_posts", id);
                    const postSnap = await getDoc(postRef);
                    if (postSnap.exists()) await deleteDoc(postRef);
                }
                setSaved(false);
            } else {
                await setDoc(eventRef, {
                    id, title, date, time, location,
                    savedAt: new Date()
                });
                setSaved(true);
            }
        } catch (error) {
            console.error("Error toggling save:", error);
        }
    };

    const saveToFolder = async (folderId) => {
        try {
            const postRef = doc(db, "folders", folderId, "folder_posts", id);
            await setDoc(postRef, {
                id,
                title,
                date,
                time,
                location,
                savedAt: new Date()
            });

            const mainRef = doc(db, "saved_events", id);
            await setDoc(mainRef, {
                id,
                title,
                date,
                time,
                location,
                savedAt: new Date()
            });

            setModalVisible(false);
            setSaved(true);
        } catch (error) {
            console.error("Error saving to folder:", error);
        }
    };

    const createNewFolder = async () => {
        if (!newFolderName.trim()) return;
        try {
            const folderRef = doc(collection(db, "folders"));
            await setDoc(folderRef, {
                name: newFolderName.trim(),
                createdAt: new Date()
            });
            setNewFolderName("");
            setNewFolderModalVisible(false);
        } catch (error) {
            console.error("Error creating folder:", error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.leftSection}>
                <Text style={styles.title}>{title}</Text>
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
                        color="#820d0d"
                    />
                </TouchableOpacity>
            </View>

            {/* Folder selection modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{
                    flex: 1, justifyContent: 'center', alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}>
                    <View style={{
                        width: '80%', backgroundColor: '#fff', borderRadius: 10,
                        padding: 20
                    }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 15 }}>Choose Folder</Text>

                        <FlatList
                            data={folders}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() => saveToFolder(item.id)}
                                    style={{
                                        padding: 12, marginBottom: 8,
                                        backgroundColor: '#efefef', borderRadius: 8
                                    }}
                                >
                                    <Text>{item.name}</Text>
                                </Pressable>
                            )}
                        />

                        <Pressable
                            onPress={() => setNewFolderModalVisible(true)}
                            style={{
                                padding: 12, backgroundColor: '#820d0d',
                                borderRadius: 8, marginTop: 10
                            }}
                        >
                            <Text style={{ color: '#fff', textAlign: 'center' }}>Add New Folder</Text>
                        </Pressable>

                        <Pressable onPress={() => setModalVisible(false)} style={{ marginTop: 10 }}>
                            <Text style={{ textAlign: 'center', color: 'red' }}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* New folder modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={newFolderModalVisible}
                onRequestClose={() => setNewFolderModalVisible(false)}
            >
                <View style={{
                    flex: 1, justifyContent: 'center', alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}>
                    <View style={{
                        width: '80%', backgroundColor: '#fff', borderRadius: 10,
                        padding: 20
                    }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 15 }}>New Folder Name</Text>

                        <TextInput
                            value={newFolderName}
                            onChangeText={setNewFolderName}
                            placeholder="Folder name"
                            style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 8,
                                padding: 10,
                                marginBottom: 15
                            }}
                        />

                        <Pressable
                            onPress={createNewFolder}
                            style={{
                                padding: 12, backgroundColor: '#820d0d',
                                borderRadius: 8
                            }}
                        >
                            <Text style={{ color: '#fff', textAlign: 'center' }}>Create</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => setNewFolderModalVisible(false)}
                            style={{ marginTop: 10 }}
                        >
                            <Text style={{ textAlign: 'center', color: 'red' }}>Cancel</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: width * 0.25,
        backgroundColor: '#efefefff',
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 9,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        marginBottom: 15,
    },
    leftSection: { flex: 1 },
    rightSection: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 10,
        marginLeft: 10
    },
    heartButton: { marginTop: 0 },
    title: { fontSize: width * 0.06, fontWeight: 'bold', fontFamily: 'Montserrat' },
    info: { fontSize: width * 0.035, fontFamily: 'Montserrat' },
    seeMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "flex-end",
        backgroundColor: '#820d0d',
        borderRadius: width * 0.06,
        width: width * 0.33,
        height: width * 0.10,
        marginBottom: 5
    },
    seeMoreLink: { paddingHorizontal: 5 },
    seeMoreText: {
        fontSize: width * 0.045,
        fontFamily: "Montserrat",
        color: "#fcfcfc",
        fontWeight: "500",
        marginRight: width * -0.01,
        marginBottom: width * 0.01,
    },
});
