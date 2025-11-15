import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import LFManager from "../../components/LFManager";

export default function LostFound() {
  return (
    <View style={{ flex: 1 }}>
      <LFManager />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/postLFItem")}
      >
        <Text style={styles.addButtonText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  addButtonText: {
    color: "#fff",
    fontSize: 28,
    lineHeight: 30,
  },
});
