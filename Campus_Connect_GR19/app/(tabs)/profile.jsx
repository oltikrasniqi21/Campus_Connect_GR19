import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity>
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
    <ScrollView contentContainerStyle={styles.postsContainer}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFCFC", 
    paddingTop: 50,
    paddingHorizontal: 20,
    maxWidth: 450,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
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
  postCard: {
    backgroundColor: "#E0DDD5",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  postText: {
    fontSize: 15,
    color: "#656565",
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

});
