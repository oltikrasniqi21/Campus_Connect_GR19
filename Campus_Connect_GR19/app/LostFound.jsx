import React, { useState } from "react";
import {StyleSheet,Text,View,TextInput,TouchableOpacity,FlatList,Image,SafeAreaView,StatusBar,} from "react-native";
import calculatorPhoto from "../assets/images/calculator.jpg";
import walletPhoto from "../assets/images/wallet.jpg";


export default function LostAndFoundScreen() {
  const [items, setItems] = useState([
    {
      id: 1,
      title: "Lost Calculator",
      description: "Black Casio calculator last seen in FIEK Lab 3",
      status: "Lost",
      comments: ["E pash ne lab 2", "Ka mundesi te jete tek biblioteka"],
      photo:calculatorPhoto,
    },
    {
      id: 2,
      title: "Lost Wallet",
      description: "Brown wallet found near cafeteria",
      status: "Lost",
      comments: ["Eshte e imja!", "Cfare ngjyre eshte brenda?"],
      photo:walletPhoto,
    },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [newComment, setNewComment] = useState("");

  const handleAddItem = () => {
    if (newTitle.trim() === "" || newDescription.trim() === "") return;
    const newItem = {
      id: items.length + 1,
      title: newTitle,
      description: newDescription,
      status: "Lost",
      comments: [],
      photo: Photo,
    };
    setItems([...items, newItem]);
    setNewTitle("");
    setNewDescription("");
  };

  const handleAddComment = (id) => {
    if (newComment.trim() === "") return;
    const updated = items.map((it) =>
      it.id === id ? { ...it, comments: [...it.comments, newComment] } : it
    );
    setItems(updated);
    setNewComment("");
    setSelectedItemId(null);
  };

  const handleMarkFound = (id) => {
    const updated = items.map((it) =>
      it.id === id ? { ...it, status: "Found ✅" } : it
    );
    setItems(updated);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.photo} style={styles.photo} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      <Text style={styles.status}>
        Status: <Text style={item.status.includes("Lost") ? styles.found : styles.lost}>{item.status}</Text>
      </Text>

      {item.comments.map((c, i) => (
        <Text key={i} style={styles.comment}>
          💬 {c}
        </Text>
      ))}

      {selectedItemId === item.id ? (
        <View style={styles.commentInputBox}>
          <TextInput
            style={styles.input}
            placeholder="Write a comment..."
            value={newComment}
            onChangeText={setNewComment}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAddComment(item.id)}
          >
            <Text style={styles.buttonText}>Post</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.commentButton}
            onPress={() => setSelectedItemId(item.id)}
          >
            <Text style={styles.commentText}>Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.markButton}
            onPress={() => handleMarkFound(item.id)}
          >
            <Text style={styles.markText}>Mark as Found</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <Text style={styles.header}>Lost & Found</Text>

      <View style={styles.addBox}>
        <TextInput
          style={styles.input}
          placeholder="Item title..."
          value={newTitle}
          onChangeText={setNewTitle}
        />
        <TextInput
          style={[styles.input, { marginTop: 8 }]}
          placeholder="Description..."
          value={newDescription}
          onChangeText={setNewDescription}
        />
        <TouchableOpacity style={styles.button} onPress={handleAddItem}>
          <Text style={styles.buttonText}>Post</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8", padding: 12 },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#820D0D",
    marginBottom: 10,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: { fontSize: 17, fontWeight: "bold", marginTop: 8 },
  desc: { color: "#555", marginVertical: 4 },
  status: { color: "#333", marginBottom: 4 },
  found: { color: "green", fontWeight: "bold" },
  lost: { color: "red", fontWeight: "bold" },
  photo: { width: "100%", height: 150, borderRadius: 8 ,resizeMode: 'cover' },
  addBox: { marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#820D0D",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  comment: { color: "#555", marginLeft: 4, marginTop: 2 },
  commentInputBox: { flexDirection: "row", marginTop: 6 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  commentButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#820D0D",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 6,
  },
  commentText: { color: "#820D0D", fontWeight: "bold" },
  markButton: {
    flex: 1,
    backgroundColor: "#820D0D",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  markText: { color: "#fff", fontWeight: "bold" },
});
