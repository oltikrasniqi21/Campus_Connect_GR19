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
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";


const { width } = Dimensions.get("window");

export default function Profile() {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(width)).current;
  const [user, setUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUser({ ...currentUser, firstname: data.firstname, lastname: data.lastname, bio: data.bio || "", photoURL: data.photoURL | currentUser.photoURL });
        } else {
          setUser(currentUser);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const postsRef = collection(db, "events");
    const q = query(postsRef, where("publisher", "==", user.uid));
    const unsubscribePosts = onSnapshot(q, (snapshot) => {
      const userPosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(userPosts);
    });

    return unsubscribePosts;
  }, [user]);

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
          source={{
            uri: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid} || `,
          }}
          style={styles.avatar}
        />

        <View style={styles.nameRow}>
          <Text style={styles.fullName}>
            {user?.firstname && user?.lastname ? `${user.firstname} ${user.lastname}` : "User"}
          </Text>
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => router.push("/editProfile")}
          >
            <Ionicons name="pencil" size={20} color="#D40000" />
          </TouchableOpacity>

        </View>
        <Text style={styles.name}>{currentUser.email}</Text>
        <Text style={styles.subtitle}>
         {user.bio || "no bio yet"}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.postsContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Eventet e Juaja</Text>

        {posts.length === 0 ? (

          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Text style={{ fontSize: 16, marginBottom: 15 }}>Nuk keni krijuar asnje event</Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#820D0D",
                paddingVertical: 12,
                paddingHorizontal: 25,
                borderRadius: 12,
              }}
              onPress={() => router.push("/AddPost")}
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>Krijo Event të Ri</Text>
            </TouchableOpacity>
          </View>
        ) : (

          <View style={styles.gridContainer}>
            {posts.map((post) => (
              <TouchableOpacity key={post.id} style={styles.postItem}>
                {post.imageUrl && (
                  <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
                )}
                <Text style={styles.postTitle} numberOfLines={1}>
                  {post.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  fullName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#656565",
  },
  email: {
    fontSize: 16,
    color: "#898580",
    marginTop: 4,
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
