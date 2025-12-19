import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Dimensions,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../firebase";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Animated, {
  FadeInDown,
  FadeOutUp,
  ZoomIn,
  Layout,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 12;
const CARD_WIDTH = width - CARD_MARGIN * 2;

function AnimatedCard({ item, postUser, onDelete, onPress, timeAgo, isOwner }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.duration(250)}
      layout={Layout.springify()}
      style={animatedStyle}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() => (scale.value = withSpring(0.97))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={onPress}
      >
        <View style={styles.card}>
          <Animated.Image
            entering={FadeInDown.springify()}
            source={{ uri: item.photo }}
            style={styles.cardImage}
          />

          <View style={styles.cardContent}>
            <View style={styles.titleRow}>
              <Text style={styles.itemTitle} numberOfLines={1}>
                {item.title}
              </Text>

              <View style={styles.headerRight}>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        item.status === "Lost" ? "#FFD6D6" : "#D8F5D2",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: item.status === "Lost" ? "#C80000" : "#2E7D32",
                      },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>

                {isOwner && (
                  <TouchableOpacity
                    onPress={onDelete}
                    style={styles.deleteIcon}
                  >
                    <Ionicons name="trash-outline" size={18} color="#820D0D" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <Text style={styles.itemDesc} numberOfLines={2}>
              {item.description}
            </Text>
            <Text style={styles.metaText}>📍 {item.location}</Text>

            <View style={styles.postedRow}>
              <View style={styles.profileContainer}>
                <Image
                  source={
                    postUser?.photoURL ? { uri: postUser.photoURL } : undefined
                  }
                  style={styles.profileImage}
                />

                <Text style={styles.postedBy}>
                  Posted by{" "}
                  {postUser
                    ? `${postUser.firstname ?? ""} ${
                        postUser.lastname ?? ""
                      }`.trim()
                    : "User"}
                </Text>
              </View>

              <Text style={styles.postedTime}>{timeAgo(item.postedTime)}</Text>
            </View>

            <TouchableOpacity style={styles.moreButton} onPress={onPress}>
              <Text style={styles.moreText}>More</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function LFManager() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showFilter, setShowFilter] = useState(false);
  const [usersMap, setUsersMap] = useState({});

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      const map = {};
      snap.forEach((doc) => {
        map[doc.id] = doc.data();
      });
      setUsersMap(map);
    });

    return unsub;
  }, []);

  useEffect(() => {
    if (loading || !user) return;

    const unsub = onSnapshot(
      collection(db, "lost_found_items"),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setItems(data);
      },
      (error) => console.error("Snapshot error:", error)
    );

    return unsub;
  }, [loading, user?.id]);

  const timeAgo = (timestamp) => {
    if (!timestamp) return "";

    const date = timestamp.toDate();
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 172800) return "Yesterday";

    return date.toLocaleDateString();
  };

  const deleteItem = (id) => {
    setSelectedItem(id);
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;

    await deleteDoc(doc(db, "lost_found_items", selectedItem));

    setModalVisible(false);
    setSelectedItem(null);
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || item.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const renderEmpty = () => (
    <Animated.View entering={FadeInDown.delay(150)}>
      <View style={styles.emptyContainer}>
        <Ionicons name="folder-open-outline" size={40} color="#820D0D" />
        <Text style={styles.emptyTitle}>No items yet</Text>
        <Text style={styles.emptySubtitle}>
          Start by posting a lost or found item.
        </Text>
      </View>
    </Animated.View>
  );

  const renderItem = ({ item }) => {
    const postUser = usersMap[item.userId];

    return (
      <AnimatedCard
        item={item}
        postUser={postUser}
        isOwner={user?.id === item.userId}
        timeAgo={timeAgo}
        onDelete={() => deleteItem(item.id)}
        onPress={() =>
          router.push({
            pathname: `/items/${item.id}`,
            params: {
              itemId: item.id,
              userId: item.userId,
            },
          })
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#888" />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#888"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
        <Ionicons
          name="options-outline"
          size={20}
          color="#888"
          onPress={() => setShowFilter(!showFilter)}
        />
      </View>
      {showFilter && (
        <Animated.View
          entering={FadeInDown.duration(180)}
          exiting={FadeOutUp.duration(150)}
          style={styles.filterDropdown}
        >
          {["All", "Lost", "Found"].map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => {
                setFilterStatus(opt);
                setShowFilter(false);
              }}
              style={[
                styles.filterItem,
                filterStatus === opt && styles.filterItemActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filterStatus === opt && styles.filterTextActive,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
      <Modal visible={modalVisible} transparent>
        <View style={styles.modalOverlay}>
          <Animated.View
            entering={ZoomIn.duration(200)}
            style={styles.modalBox}
          >
            <Text style={styles.modalTitle}>Delete this item?</Text>
            <Text style={styles.modalSubtitle}>
              This action cannot be undone.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteTextBtn}>Delete</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,

    width: "92%",
    alignSelf: "center",

    marginVertical: 12,
    paddingBottom: 10,
  },
  cardImage: { width: "100%", height: 250, resizeMode: "cover" },
  cardContent: { padding: 14 },
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
  deleteButton: {
    backgroundColor: "#b00000",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 14,
    width: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#e0e0e0",
  },
  cancelText: {
    color: "#333",
    fontWeight: "bold",
  },
  deleteBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#820D0D",
  },
  deleteTextBtn: {
    color: "white",
    fontWeight: "bold",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  deleteIcon: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  emptyContainer: {
    marginTop: 80,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#820D0D",
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
    textAlign: "center",
  },
  filterDropdown: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 4,
    borderRadius: 10,
    paddingVertical: 6,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  filterItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  filterItemActive: {
    backgroundColor: "#F3E8E8",
  },

  filterText: {
    fontSize: 14,
    color: "#333",
  },

  filterTextActive: {
    color: "#820D0D",
    fontWeight: "bold",
  },
});
