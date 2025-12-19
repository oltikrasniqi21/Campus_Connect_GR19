import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

export default function ItemDetails() {
  const { itemId, userId } = useLocalSearchParams();

  const [item, setItem] = useState(null);
  const [postUser, setPostUser] = useState(null);

  useEffect(() => {
    if (!itemId) return;

    return onSnapshot(doc(db, "lost_found_items", itemId), (snap) => {
      if (snap.exists()) {
        setItem({ id: snap.id, ...snap.data() });
      }
    });
  }, [itemId]);

  useEffect(() => {
    if (!userId) return;

    return onSnapshot(doc(db, "users", userId), (snap) => {
      if (snap.exists()) {
        setPostUser(snap.data());
      }
    });
  }, [userId]);

  if (!item || !postUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#820D0D" />
        </View>
      </SafeAreaView>
    );
  }

  const isLost = item.status === "Lost";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Image source={{ uri: item.photo }} style={styles.image} />

        <View style={styles.content}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: isLost ? "#FFD6D6" : "#D8F5D2" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: isLost ? "#C80000" : "#2E7D32" },
              ]}
            >
              {item.status}
            </Text>
          </View>

          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.location}>📍 {item.location}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Additional Information</Text>
          <Text style={styles.infoText}>
            {item.additionalInfo || "No additional information provided."}
          </Text>
        </View>

        <View style={styles.posterWrapper}>
          <View style={styles.posterRow}>
            <Image
              source={{ uri: postUser.photoURL }}
              style={styles.posterImage}
            />

            <View style={{ marginLeft: 12 }}>
              <Text style={styles.posterName}>
                {postUser.firstname} {postUser.lastname}
              </Text>
              <Text style={styles.posterTime}>
                {new Date(item.postedTime?.toDate()).toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.callButton}>
            <Text style={styles.callText}>📞 Call Now</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.messageButton}>
            <Text style={styles.messageText}>✉️ Send Email</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  image: {
    width: "100%",
    height: 260,
    borderRadius: 16,
    resizeMode: "cover",
    marginBottom: 20,

    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },

  content: { 
    paddingBottom: 10,
  },

  statusBadge: {
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 8,
  },

  statusText: {
    fontWeight: "700",
    fontSize: 13,
  },

  itemTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
    marginBottom: 6,
  },

  location: {
    color: "#820D0D",
    marginBottom: 10,
    fontWeight: "600",
    fontSize: 14,
  },

  description: {
    color: "#444",
    marginBottom: 18,
    fontSize: 15,
    lineHeight: 22,
  },

  infoBox: {
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    padding: 18,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#E2E2E2",
  },

  infoTitle: {
    color: "#820D0D",
    fontWeight: "700",
    marginBottom: 12,
    fontSize: 16,
  },

  infoText: { 
    color: "#333", 
    fontSize: 15, 
    lineHeight: 22 
  },
  posterWrapper: {
    marginTop: 25,
    paddingVertical: 14,
    paddingHorizontal: 6,
    backgroundColor: "#FAFAFA",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E2E2",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  posterRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  posterImage: {
    width: 48,
    height: 48,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#eee",
  },

  posterName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },

  posterTime: {
    fontSize: 12,
    color: "#777",
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: "#E4E4E4",
    marginTop: 14,
  },

  /** ACTION BUTTONS **/
  actions: {
    marginTop: 35,
    marginBottom: 70,
    width: "100%",
    paddingHorizontal: 4,
  },

  callButton: {
    backgroundColor: "#820D0D",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 14,

    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },

  callText: { 
    color: "#fff", 
    fontWeight: "700", 
    fontSize: 17 
  },

  messageButton: {
    backgroundColor: "#EFEFEF",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },

  messageText: { 
    color: "#333", 
    fontWeight: "700", 
    fontSize: 17 
  },
});

