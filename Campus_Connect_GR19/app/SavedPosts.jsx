import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SavedPosts() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Posts</Text>
      <Text style={styles.subtitle}>Nuk keni postime te ruajtura.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#820D0D",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginTop: 8,
  },
});