import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Platform,
    StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from 'expo-router';

const folderPosts = {
    '1': [
        { id: '1-1', title: "ID lost - contact me", photo: require('../../assets/images/studentID.jpeg') },
        { id: '1-2', title: "Important: Scholarship deadline",  photo: require('../../assets/images/studygroup.jpeg') },
    ],
    '2': [
        { id: '2-1', title: "FIEK Party - Rooftop", photo: require('../../assets/images/studentParty.jpeg') },
        { id: '2-2', title: "Open Mic Night",  photo: require('../../assets/images/studentParty.jpeg') },
        { id: '2-3', title: "Guest Lecture - AI",  photo: require('../../assets/images/semestri4.jpeg') },
    ],
    '3': [
        { id: '3-1', title: "Study Group - Calculus",  photo: require('../../assets/images/studygroup.jpeg') },
    ],
    '4': [
        { id: '4-1', title: "Beach meetup",  photo: require('../../assets/images/studentParty.jpeg') },
    ],
};

export default function FolderScreen() {
    const { id } = useLocalSearchParams(); 
  const router = useRouter();
    const posts = folderPosts[id] ?? [];

    const renderPost = ({ item }) => (
        <View style={styles.postRow}>
            <Image source={item.photo} style={styles.postImage} />
            <Text style={styles.postTitle} numberOfLines={1}>{item.title}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                    <View style={{ width: 60 }} /> 
            </View>

            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={renderPost}
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
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    backText: {
        color: '#8B0000',
        fontWeight: '700',
    },
    header: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '800',
        color: '#8B0000',
    },
    postRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    postImage: {
        width: 80,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
        backgroundColor: '#eee',
    },
    postTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
});
