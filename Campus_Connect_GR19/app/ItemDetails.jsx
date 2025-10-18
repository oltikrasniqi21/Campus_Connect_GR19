import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import pfp from "../assets/images/pfp.png";

export default function ItemDetails() {
  const item = {
    title: "Lost Calculator",
    description:
      "Black Casio calculator last seen in FIEK Lab 3 near workstation 7.",
    status: "Lost",
    location: "FIEK Building, Lab 3",
    photo: require("../assets/images/calculator.jpg"),
    color: "Black",
    brand: "Casio",
    category: "Electronics",
    postedBy: "Riga",
    pfp: pfp,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>
          {item.status === "Lost" ? "Lost Item" : "Found Item"}
        </Text>

        <Image source={item.photo} style={styles.image} />

        <View style={styles.content}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: item.status === "Lost" ? "#FFD6D6" : "#D8F5D2",
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: item.status === "Lost" ? "#C80000" : "#2E7D32" },
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
            This calculator may have a small scratch near the display and a blue
            sticker on the back. If found, please handle it carefully and return
            it to the Lost & Found office.
          </Text>
        </View>

        <View style={styles.postedByContainer}>
          <Image source={item.pfp} style={styles.profileImage} />
          <Text style={styles.postedByText}>Posted by {item.postedBy}</Text>
        </View>

        <View style={styles.actions}>
          <Text style={styles.postedBy}> Posted By {item.postedBy}</Text>

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
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20 },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#820D0D",
    marginVertical: 10,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 230,
    borderRadius: 12,
    resizeMode: "cover",
    marginBottom: 10,
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
  description: { color: "#555", marginBottom: 12, fontSize: 14 },
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
  infoText: {
    color: "#333",
    fontSize: 14,
    lineHeight: 20,
  },
  postedByContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  profileImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  postedByText: {
    color: "#444",
    fontWeight: "600",
    fontSize: 14,
  },

  actions: {
    alignItems: "center",
    marginTop: 10,
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
  callText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  messageButton: {
    backgroundColor: "#D8D8D8",
    width: "90%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  messageText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
  },
});
