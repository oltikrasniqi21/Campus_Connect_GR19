import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ItemDetails() {
  const params = useLocalSearchParams();
  const isLost = params.status === "Lost";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={{ height: 20 }} />

        <Image source={{ uri: params.photo }} style={styles.image} />

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
              {params.status}
            </Text>
          </View>

          <Text style={styles.itemTitle}>{params.title}</Text>
          <Text style={styles.location}>📍 {params.location}</Text>
          <Text style={styles.description}>{params.description}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Additional Information</Text>
          <Text style={styles.infoText}>
            {params.additionalInfo || "No additional information provided."}
          </Text>
        </View>

        <View style={styles.postedByContainer}>
          <Image source={{ uri: params.pfp }} style={styles.profileImage} />
          <View>
            <Text style={styles.postedByText}>Posted by {params.postedBy}</Text>
            <Text style={styles.postedTime}>{params.postedTime}</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.callButton}>
            <Text style={styles.callText}>📞 Call Now</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.messageButton}>
            <Text style={styles.messageText}>✉️ Send Email</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
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
  },
  image: {
    width: "100%",
    height: 240,
    borderRadius: 12,
    resizeMode: "cover",
    marginBottom: 15,
  },
  content: { paddingBottom: 10 },
  statusBadge: {
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 6,
  },
  statusText: { fontWeight: "600" },
  itemTitle: { fontSize: 18, fontWeight: "700", color: "#000" },
  location: { color: "#820D0D", marginVertical: 4 },
  description: {
    color: "#555",
    marginBottom: 12,
    fontSize: 14,
    lineHeight: 20,
  },

  infoBox: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 16,
    marginTop: 10,
  },
  infoTitle: {
    color: "#820D0D",
    fontWeight: "700",
    marginBottom: 10,
    fontSize: 15,
  },
  infoText: { color: "#333", fontSize: 14, lineHeight: 20 },

  postedByContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    marginBottom: 10,
  },
  profileImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  postedByText: {
    color: "#444",
    fontWeight: "600",
    fontSize: 15,
    textAlign: "center",
  },
  postedTime: {
    color: "#777",
    fontSize: 12,
    fontStyle: "italic",
    textAlign: "center",
  },

  actions: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  callButton: {
    backgroundColor: "#820D0D",
    width: "90%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  callText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  messageButton: {
    backgroundColor: "#D8D8D8",
    width: "90%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  messageText: { color: "#000", fontWeight: "600", fontSize: 16 },
});
