import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 12;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

export default function LFManager() {
  const router = useRouter();

  const [items, setItems] = useState([
    {
      id: "1",
      title: "Lost Calculator",
      description: "Black Casio calculator last seen in FIEK Lab 3",
      status: "Lost",
      photo: require("../assets/images/calculator.jpg"),
      location: "FIEK",
      postedBy: "Riga",
      postedTime: "2h ago",
      pfp: require("../assets/images/pfp.png"),
      additionalInfo: "Might have a blue sticker on the back.",
    },
    {
      id: "2",
      title: "Found Wallet",
      description: "Brown wallet found near cafeteria",
      status: "Found",
      photo: require("../assets/images/wallet.jpg"),
      location: "Cafeteria",
      postedBy: "Rreze",
      postedTime: "1h ago",
      pfp: require("../assets/images/pfp1.jpeg"),
      additionalInfo: "Contains ID and student card.",
    },
  ]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.photo} style={styles.cardImage} />

      <View style={styles.cardContent}>
        <View style={styles.titleRow}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: item.status === "Lost" ? "#FFD6D6" : "#D8F5D2" },
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
        </View>

        <Text style={styles.itemDesc} numberOfLines={2}>
          {item.description}
        </Text>
        <Text style={styles.metaText}>📍 {item.location}</Text>

        <View style={styles.postedRow}>
          <View style={styles.profileContainer}>
            {item.pfp && <Image source={item.pfp} style={styles.profileImage} />}
            <Text style={styles.postedBy}>Posted by {item.postedBy}</Text>
          </View>
          <Text style={styles.postedTime}>{item.postedTime}</Text>
        </View>

        <TouchableOpacity
          style={styles.moreButton}
          onPress={() =>
            router.push({
              pathname: `/items/${item.id}`,
              params: {
                id: item.id,
                title: item.title,
                description: item.description,
                status: item.status,
                location: item.location,
                postedBy: item.postedBy,
                postedTime: item.postedTime,
                additionalInfo:
                  item.additionalInfo || "No additional information provided.",
              },
            })
          }
        >
          <Text style={styles.moreText}>More</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#888" />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
        <Ionicons name="options-outline" size={20} color="#888" />
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 10 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8" },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  searchInput: { flex: 1, marginHorizontal: 8, color: "#333" },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: CARD_MARGIN,
    marginBottom: CARD_MARGIN,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    width: CARD_WIDTH,
  },
  cardImage: { width: "100%", height: 110, resizeMode: "cover" },
  cardContent: { padding: 10 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  itemTitle: { fontSize: 14, fontWeight: "bold", color: "#222", flex: 1 },
  statusBadge: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 11, fontWeight: "bold" },
  itemDesc: { fontSize: 12, color: "#666", marginBottom: 6 },
  metaText: { fontSize: 11, color: "#777", marginBottom: 8 },
  postedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileContainer: { flexDirection: "row", alignItems: "center" },
  profileImage: { width: 20, height: 20, borderRadius: 10, marginRight: 5 },
  postedBy: { fontSize: 11, color: "#444" },
  postedTime: { fontSize: 11, color: "#777", fontStyle: "italic" },
  moreButton: {
    backgroundColor: "#820D0D",
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: "center",
    marginTop: 4,
  },
  moreText: { color: "#fff", fontWeight: "600", fontSize: 13 },
});
