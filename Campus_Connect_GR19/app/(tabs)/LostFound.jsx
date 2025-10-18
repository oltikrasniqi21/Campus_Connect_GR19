import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import calculatorPhoto from "../../assets/images/calculator.jpg";
import idCardPhoto from "../../assets/images/idCard.jpg";
import keyPhoto from "../../assets/images/key.png";
import pfp from "../../assets/images/pfp.png";
import pfp1 from "../../assets/images/pfp1.jpeg";
import pfp2 from "../../assets/images/pfp2.jpeg";
import pfp3 from "../../assets/images/pfp3.png";
import walletPhoto from "../../assets/images/wallet.jpg";
// import keyPhoto from "../../assets/images/key.png";
// import idCardPhoto from "../../assets/images/idCard.jpg";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

export default function LostAndFoundScreen() {
  const router = useRouter();

  const items = [
    {
      id: 1,
      title: "Lost Calculator",
      description: "Black Casio calculator last seen in FIEK Lab 3",
      status: "Lost",
      photo: calculatorPhoto,
      postedBy: "Riga",
      postedTime: "2h ago",
      pfp: pfp,
    },
    {
      id: 2,
      title: "Found Wallet",
      description: "Brown wallet found near cafeteria",
      status: "Found",
      photo: walletPhoto,
      postedBy: "Rreze",
      postedTime: "1h ago",
      pfp: pfp1,
    },
    {
      id: 3,
      title: "Lost ID Card",
      description: "University ID card dropped near library",
      status: "Lost",
      photo: idCardPhoto,
      postedBy: "Olti",
      postedTime: "3h ago",
      pfp: pfp2,
    },
    {
      id: 4,
      title: "Found Keys",
      description: "I found a set of keys near parking lot",
      status: "Found",
      photo: keyPhoto,
      postedBy: "Rita",
      postedTime: "30m ago",
      pfp: pfp3,
    },
  ];

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
        </View>

        <Text style={styles.itemDesc} numberOfLines={2}>
          {item.description}
        </Text>

        <Text style={styles.metaText}>📍 FIEK</Text>

        <View style={styles.postedRow}>
          <View style={styles.profileContainer}>
            <Image source={item.pfp} style={styles.profileImage} />
            <Text style={styles.postedBy}>Posted by {item.postedBy}</Text>
          </View>
          <Text style={styles.postedTime}>{item.postedTime}</Text>
        </View>

        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => router.push({ pathname: "/ItemDetails" })}
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

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push({ pathname: "/PostLFItem" })}
      >
        <Text style={styles.addButtonText}>＋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
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
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    color: "#333",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 12,
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
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#222",
    flex: 1,
    marginRight: 6,
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
  itemDesc: {
    fontSize: 12,
    color: "#666",
    marginBottom: 6,
  },
  metaText: {
    fontSize: 11,
    color: "#777",
    marginBottom: 8,
  },
  postedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  postedBy: {
    fontSize: 11,
    color: "#444",
    fontWeight: "600",
  },
  postedTime: {
    fontSize: 11,
    color: "#777",
    fontStyle: "italic",
  },
  moreButton: {
    backgroundColor: "#820D0D",
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: "center",
  },
  moreText: {
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
