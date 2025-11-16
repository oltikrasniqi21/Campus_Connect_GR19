import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Dimensions } from "react-native";
const { width } = Dimensions.get("window");
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from '../../firebase';

export function Flashcard({ id, title, date, time, location }) {
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const checkSaved = async () => {
            try {
                const eventSnap = await getDoc(doc(db, "saved_events", id));
                if (eventSnap.exists()) {
                    setSaved(true);
                }
            } catch (error) {
                console.error("Error checking saved event:", error);
            }
        };
        checkSaved();
    }, [id]);

    const toggleSave = async () => {
        try {
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
        } catch (error) {
            console.error("Error toggling save:", error);
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
                    <Link href={`../../app/eventDetail/${id}`} style={styles.seeMoreLink}>
                        <View style={styles.seeMoreButton}>
                            <Text style={styles.seeMoreText}>See More</Text>
                            <Entypo name="chevron-right" size={width * 0.085} color="#fcfcfc" />
                        </View>
                    </Link>
                </TouchableOpacity>

                <TouchableOpacity style={styles.heartButton} onPress={toggleSave}>
                    <Ionicons
                        name={saved ? "heart" : "heart-outline"}
                        size={width * 0.08}
                        color="#820d0d"
                    />
                </TouchableOpacity>
            </View>

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
    heartButton: {
        marginTop: 0,                
    },

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
