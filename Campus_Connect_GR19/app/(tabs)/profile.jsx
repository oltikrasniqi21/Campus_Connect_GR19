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
  ActivityIndicator,
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { auth } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const { width } = Dimensions.get("window");

export default function Profile() {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(width)).current;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.error("error", error);
    }
  };

  const toggleMenu = () => {
    setMenuVisible((prev) => !prev);
  };

  useEffect(() => {
    global.toggleProfileMenu = toggleMenu;
    return () => {
      global.toggleProfileMenu = null;
    };
  }, [toggleMenu]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: menuVisible ? 0 : width,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [menuVisible]);

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#820D0D" />
        <Text style={{ marginTop: 10 }}>Loading user...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          style={styles.avatar}
        />
        <View style={styles.nameRow}>
          <Text style={styles.name}>{currentUser.email}</Text>
          <TouchableOpacity style={styles.editIcon}>
            <Ionicons name="pencil" size={20} color="#D40000" />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>
          Student Ne Fakultetin e Inxhinierise Kompjuterike
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.postsContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Your Posts</Text>

        <View style={styles.gridContainer}>
          {[
            {
              id: 1,
              title: "ID i humbur",
              image: "https://picsum.photos/200/200?random=1",
            },
            {
              id: 2,
              title: "Study Group",
              image: "https://picsum.photos/200/200?random=2",
            },
            {
              id: 3,
              title: "Event Per Data Security",
              image: "https://picsum.photos/200/200?random=3",
            },
            {
              id: 4,
              title: "This is the best University Ever o My gOD!",
              image: "https://picsum.photos/200/200?random=4",
            },
            {
              id: 5,
              title: "Mbledhemi per loje Volleyboll",
              image: "https://picsum.photos/200/200?random=5",
            },
            {
              id: 6,
              title: "Trajnim ne UI/UX",
              image: "https://picsum.photos/200/200?random=6",
            },
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

      <Modal visible={menuVisible} transparent animationType="none">
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

            <TouchableOpacity style={styles.menuItem}>
              <Feather name="edit" size={22} color="#fff" />
              <Text style={styles.menuText}>Edit Account Details</Text>
            </TouchableOpacity>

            <View style={styles.spacer} />

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleSignOut}
            >
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
