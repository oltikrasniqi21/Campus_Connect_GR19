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
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

const { width } = Dimensions.get("window");

export default function Profile() {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(width)).current;

  const { user, loading, logout } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [lfPosts, setLfPosts] = useState([]);
  const [tab, setTab] = useState("events");

  useEffect(() => {
    if (loading || !user) return;

    const q = query(
      collection(db, "events"),
      where("publisher", "==", user.id)
    );

    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return unsub;
  }, [loading, user?.id]);

  useEffect(() => {
    if (loading || !user) return;

    const q = query(
      collection(db, "lost_found_items"),
      where("userId", "==", user.id)
    );

    return onSnapshot(q, (snap) => {
      setLfPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [loading, user?.id]);

  const toggleMenu = () => setMenuVisible((prev) => !prev);
  useEffect(() => {
    global.toggleProfileMenu = toggleMenu;
    return () => (global.toggleProfileMenu = null);
  }, [toggleMenu]);

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

  const renderGrid = (data, type) => {
    if (data.length === 0) {
      return (
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <Text style={{ fontSize: 16, marginBottom: 15 }}>
            {type === "events"
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
              router.push(type === "events" ? "/AddPost" : "/postLFItem")
            }
          >
            <Text style={{ color: "#fff", fontWeight: "700" }}>
              {type === "events"
                ? "Krijo Event të Ri"
                : "Krijo nje postim te ri"}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.gridContainer}>
        {data.map((post) => (
          <TouchableOpacity
            key={post.id}
            style={styles.postItem}
            onPress={() => {
              if (type === "events") {
                router.push(`/eventDetail/${post.id}`);
              } else {
                let postedTime = "";
                if (post.postedTime?.toDate) {
                  const now = new Date();
                  const postDate = post.postedTime.toDate();
                  const diffMs = now - postDate;
                  const diffSec = Math.floor(diffMs / 1000);
                  const diffMin = Math.floor(diffSec / 60);
                  const diffHr = Math.floor(diffMin / 60);
                  const diffDay = Math.floor(diffHr / 24);

                  if (diffDay > 0)
                    postedTime = `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
                  else if (diffHr > 0)
                    postedTime = `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
                  else if (diffMin > 0)
                    postedTime = `${diffMin} min${diffMin > 1 ? "s" : ""} ago`;
                  else postedTime = "Just now";
                } else {
                  postedTime = post.postedTime || "";
                }

                router.push({
                  pathname: `/items/${post.id}`,
                  params: {
                    title: post.title,
                    description: post.description,
                    status: post.status,
                    location: post.location,
                    postedBy:
                      post.postedBy || `${user.firstname} ${user.lastname}`,
                    postedBy:
                      post.postedBy || `${user.firstname} ${user.lastname}`,
                    postedTime,
                    additionalInfo: post.additionalInfo,
                    photo: post.photo,
                    pfp: post.pfp,
                  },
                });
              }
            }}
          >
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
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
          }}
          style={styles.avatar}
        />

        <View style={styles.nameRow}>
          <Text style={styles.fullName}>
            {user.firstname && user.lastname
              ? `${user.firstname} ${user.lastname}`
              : "User"}
          </Text>
          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => router.push("/editProfile")}
          >
            <Ionicons name="pencil" size={20} color="#D40000" />
          </TouchableOpacity>
        </View>

        <Text
          style={styles.email}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          textAlign="center"
        >
          {user.email}
        </Text>
        <Text style={styles.subtitle}>{user.bio || "no bio yet"}</Text>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, tab === "events" ? styles.activeTab : null]}
          onPress={() => setTab("events")}
        >
          <Text
            style={[
              styles.tabText,
              tab === "events" ? styles.activeTabText : null,
            ]}
          >
            Eventet e Juaja
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, tab === "lf" ? styles.activeTab : null]}
          onPress={() => setTab("lf")}
        >
          <Text
            style={[styles.tabText, tab === "lf" ? styles.activeTabText : null]}
          >
            LF Postimet
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.postsContainer}
        showsVerticalScrollIndicator={false}
      >
        {tab === "events"
          ? renderGrid(posts, "events")
          : renderGrid(lfPosts, "lf")}
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
    marginBottom: 15,
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

  fullName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#656565",
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#656565",
    textAlign: "center",
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

  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },

  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },

  tab: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },

  activeTab: {
    borderBottomColor: "#820D0D",
  },

  tabText: {
    fontSize: 16,
    color: "#888",
    fontWeight: "600",
  },

  activeTabText: {
    color: "#820D0D",
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

  email: {
    fontSize: 16,
    color: "#898580",
    marginTop: 4,
  },
});
