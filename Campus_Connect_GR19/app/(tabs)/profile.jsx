import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
  Easing,
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function Profile() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current; // Start completely off-screen to the right

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: menuVisible ? 0 : width, // 0 = fully visible (aligned to right), width = off-screen
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [menuVisible]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Profile</Text>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="menu" size={28} color="#820D0D" />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          style={styles.avatar}
        />
        <View style={styles.nameRow}>
          <Text style={styles.name}>Filan Fisteku</Text>
          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="pencil" size={20} color="#D40000" />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>budalla ma i madh</Text>
      </View>

      {/* Posts Section */}
      <ScrollView
        contentContainerStyle={styles.postsContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Your Posts</Text>

        <View style={styles.gridContainer}>
          {[
            { id: 1, title: "ID i humbur", image: "https://picsum.photos/200/200?random=1" },
            { id: 2, title: "Study Group", image: "https://picsum.photos/200/200?random=2" },
            { id: 3, title: "Event Per Data Security", image: "https://picsum.photos/200/200?random=3" },
            { id: 4, title: "This is the best University Ever o My gOD!", image: "https://picsum.photos/200/200?random=4" },
            { id: 5, title: "Football Game", image: "https://picsum.photos/200/200?random=5" },
            { id: 6, title: "Group Study", image: "https://picsum.photos/200/200?random=6" },
          ].map((post) => (
            <TouchableOpacity key={post.id} style={styles.postItem}>
              <Image source={{ uri: post.image }} style={styles.postImage} />
              <Text style={styles.postTitle} numberOfLines={1}>
                {post.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Right-side Slide Menu */}
      <Modal visible={menuVisible} transparent animationType="none">
        {/* Background overlay */}
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleMenu}
        >
          <Animated.View
            style={[
              styles.menuContainer,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <Text style={styles.menuTitle}>Menu</Text>

            {/* Saved */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
                router.push("/SavedPosts");
              }}
            >
              <MaterialIcons name="bookmark-outline" size={24} color="#fff" />
              <Text style={styles.menuText}>Saved</Text>
            </TouchableOpacity>

            {/* Edit account details */}
            <TouchableOpacity style={styles.menuItem}>
              <Feather name="edit" size={22} color="#fff" />
              <Text style={styles.menuText}>Edit Account Details</Text>
            </TouchableOpacity>

            <View style={styles.spacer} />

            {/* Log out */}
            <TouchableOpacity style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={22} color="#fff" />
              <Text style={styles.menuText}>Log Out</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC",
    paddingTop: 15,
    paddingHorizontal: 20,
    maxWidth: 450,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#820D0D",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#E0DDD5",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#656565",
  },
  editIcon: {
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#898580",
    marginTop: 4,
  },
  postsContainer: {
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#820D0D",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  postItem: {
    width: "31%",
    marginBottom: 15,
    alignItems: "center",
  },
  postImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: "#E0DDD5",
  },
  postTitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#656565",
    textAlign: "center",
  },

  /* ===== Menu Styles ===== */
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  menuContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: width * 0.5,
    backgroundColor: "#820D0D",
    padding: 20,
  },
  menuTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  menuText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  spacer: {
    flex: 1,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
});
