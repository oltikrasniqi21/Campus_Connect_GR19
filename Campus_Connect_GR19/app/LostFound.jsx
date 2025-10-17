import React, { useState } from "react";
import { useRouter } from "expo-router";
import {StyleSheet,Text,View,FlatList,Image,TouchableOpacity,SafeAreaView,StatusBar,Dimensions,} from "react-native";

import calculatorPhoto from "../assets/images/calculator.jpg";
import walletPhoto from "../assets/images/wallet.jpg";
import keyPhoto from "../assets/images/key.png";
import idCardPhoto from "../assets/images/idCard.jpg";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

export default function LostAndFoundScreen() {
  const router = useRouter();
  const [items] = useState([
    {
      id: 1,
      title: "Lost Calculator",
      description: "Black Casio calculator last seen in FIEK Lab 3",
      status: "Lost",
      photo: calculatorPhoto,
    },
    {
      id: 2,
      title: "Found Wallet",
      description: "Brown wallet found near cafeteria",
      status: "Found",
      photo: walletPhoto,
    },
    {
      id: 3,
      title: "Lost ID Card",
      description: "University ID card dropped near library",
      status: "Lost",
      photo: idCardPhoto,
    },
    {
      id: 4,
      title: "Found Keys",
      description: "Set of keys near parking lot",
      status: "Found",
      photo: keyPhoto,
    },
  ]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.photo} style={styles.cardImage} />

      <View style={styles.cardContent}>
        <Text style={styles.itemTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.itemDesc} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.metaRow}>
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
          <Text style={styles.metaText}>📍 FIEK</Text>
        </View>

        <TouchableOpacity style={styles.contactButton}>
          <Text style={styles.contactText}>Contact</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <Text style={styles.header}>Lost & Found</Text>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 12,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#820D0D",
    marginBottom: 12,
    textAlign: "center",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
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
  cardImage: {
    width: "100%",
    height: 110,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 10,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#222",
  },
  itemDesc: {
    fontSize: 12,
    color: "#666",
    marginTop: 3,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  metaText: {
    fontSize: 11,
    color: "#777",
  },
  contactButton: {
    backgroundColor: "#820D0D",
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: "center",
  },
  contactText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  addButton: {
    backgroundColor: "#820D0D",
    position: "absolute",
    bottom: 25,
    right: 25,
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
  },
  addButtonText: {
    color: "#fff",
    fontSize: 28,
    lineHeight: 30,
  },
});
