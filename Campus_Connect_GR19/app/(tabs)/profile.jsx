import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  Easing,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

const { width } = Dimensions.get("window");

const PostItem = memo(({ post, type, onPress }) => {
  return (
    <TouchableOpacity style={styles.postItem} onPress={onPress}>
      {post.eventPhoto || post.photo ? (
        <Image
          source={{ uri: post.eventPhoto || post.photo }}
          style={styles.postImage}
        />
      ) : (
        <View style={[styles.postImage, styles.placeholderImage]}>
          <Ionicons name="calendar" size={24} color="#820D0D" />
        </View>
      )}
      <Text style={styles.postTitle} numberOfLines={1}>
        {post.title}
      </Text>
    </TouchableOpacity>
  );
});

export default function Profile() {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(width)).current;

  const { user, loading, logout } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [lfPosts, setLfPosts] = useState([]);
  const [tab, setTab] = useState("events");
  const [currentUserData, setCurrentUserData] = useState(null);

  useEffect(() => {
    if (loading || !user) return;

    const unsub = onSnapshot(doc(db, "users", user.id), (docSnap) => {
      if (docSnap.exists()) {
        setCurrentUserData(docSnap.data());
      }
    });

    return unsub;
  }, [loading, user?.id]);

 
  useEffect(() => {
    if (loading || !user) return;

    const userId = user.uid || user.id;

    const q = query(
      collection(db, "events"),
      where("publisher", "==", userId)
    );

    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return unsub;
  }, [loading, user]);

  useEffect(() => {
    if (loading || !user) return;

    const userId = user.uid || user.id;

    const q = query(
      collection(db, "lost_found_items"),
      where("userId", "==", userId)
    );

    return onSnapshot(q, (snap) => {
      setLfPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [loading, user]);

  const toggleMenu = () => setMenuVisible((prev) => !prev);

  useEffect(() => {
    global.toggleProfileMenu = toggleMenu;
    return () => (global.toggleProfileMenu = null);
  }, []);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: menuVisible ? 0 : width,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [menuVisible]);

  if (loading || !user) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#820D0D" />
        <Text style={{ marginTop: 10 }}>Loading user...</Text>
      </View>
    );
  }

  const displayUser = currentUserData || user;
  const dataToRender = tab === "events" ? posts : lfPosts;

 
  const renderItem = useCallback(
    ({ item }) => (
      <PostItem
        post={item}
        type={tab}
        onPress={() =>
          router.push(
            tab === "events"
              ? `/eventDetail/${item.id}`
              : `/items/${item.id}`
          )
        }
      />
    ),
    [tab]
  );

  return (
    <View style={styles.container}>
      
      <View style={styles.profileSection}>
        {displayUser.photoURL ? (
          <Image source={{ uri: displayUser.photoURL }} style={styles.avatar} />
        ) : (
          <View
            style={[
              styles.avatar,
              { backgroundColor: "#ccc", justifyContent: "center", alignItems: "center" },
            ]}
          >
            <Ionicons name="person" size={40} color="#fff" />
          </View>
        )}

        <View style={styles.nameRow}>
          <Text style={styles.fullName}>
            {displayUser.firstname && displayUser.lastname
              ? `${displayUser.firstname} ${displayUser.lastname}`
              : "User"}
          </Text>
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => router.push("/editProfile")}
          >
            <Ionicons name="pencil" size={20} color="#D40000" />
          </TouchableOpacity>
        </View>

        <Text style={styles.email}>{displayUser.email}</Text>
        <Text style={styles.subtitle}>{displayUser.bio || "No bio yet"}</Text>
      </View>

      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, tab === "events" && styles.activeTab]}
          onPress={() => setTab("events")}
        >
          <Text style={[styles.tabText, tab === "events" && styles.activeTabText]}>
            Eventet e Juaja
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, tab === "lf" && styles.activeTab]}
          onPress={() => setTab("lf")}
        >
          <Text style={[styles.tabText, tab === "lf" && styles.activeTabText]}>
            LF Postimet
          </Text>
        </TouchableOpacity>
      </View>

     
      <FlatList
        data={dataToRender}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={renderItem}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.postsContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <Text style={{ fontSize: 16, marginBottom: 15 }}>
              {tab === "events"
                ? "Nuk keni krijuar asnje event"
                : "Ju nuk keni krijuar asnje postim"}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#820D0D",
                paddingVertical: 12,
                paddingHorizontal: 25,
                borderRadius: 12,
              }}
              onPress={() =>
                router.push(tab === "events" ? "/AddPost" : "/postLFItem")
              }
            >
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                {tab === "events"
                  ? "Krijo Event të Ri"
                  : "Krijo nje postim te ri"}
              </Text>
            </TouchableOpacity>
          </View>
        }
      />

    
      <Modal visible={menuVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={toggleMenu}>
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

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                toggleMenu();
                router.push("/editProfile");
              }}
            >
              <Feather name="edit" size={22} color="#fff" />
              <Text style={styles.menuText}>Edit Profile Details</Text>
            </TouchableOpacity>

            <View style={styles.spacer} />

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
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
    marginBottom: 15 },
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
    alignItems: "center" },
  fullName: { 
    fontSize: 22, 
    fontWeight: "bold", 
    color: "#656565" },
  editIcon: { marginLeft: 8 },
  subtitle: { 
    fontSize: 14, 
    color: "#898580", 
    marginTop: 4 },
  email: { 
    fontSize: 16, 
    color: "#898580", 
    marginTop: 4 },
  postsContainer: { 
    paddingBottom: 100, 
    paddingHorizontal: 5 },
  postItem: { 
    width:"30%",
    marginHorizontal:5, 
    marginBottom: 15, 
    alignItems: "center" },
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
    textAlign: "center" },
  placeholderImage: { 
    justifyContent: "center", 
    alignItems: "center" },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  tab: { 
    paddingVertical: 8,
    paddingHorizontal: 15, 
    borderBottomWidth: 2 },
  activeTab: { borderBottomColor: "#820D0D" },
  tabText: { 
    fontSize: 16, 
    color: "#888", 
    fontWeight: "600" },
  activeTabText: { color: "#820D0D" },
  overlay: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.3)" },
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
    marginBottom: 20 },
  menuItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginVertical: 15 },
  menuText: { 
    color: "#fff", 
    fontSize: 16, 
    marginLeft: 10 },
  spacer: { flex: 1 },
  logoutButton: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 20 },
  columnWrapper: {
  justifyContent: "space-between",
},
});