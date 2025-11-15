import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  StatusBar,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PostLFItem() {
  const router = useRouter();
  const [postType, setPostType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [photo, setPhoto] = useState(null);

  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = async () => {
    if (!postType.trim()) {
      setError("Please select Lost or Found");
      return;
    }
    if (!title.trim()) {
      setError("Please enter a title for the item.");
      return;
    }
    if (!description.trim()) {
      setError("Please enter a description for the item.");
      return;
    }
    if (title.trim().length < 5) {
      setError("Title must be at least 5 characters long.");
      return;
    }
    if (!location.trim()) {
      setError("Please enter the location where the item was lost or found.");
      return;
    }
    if (!additionalInfo.trim()) {
      setError("Please provide additional information about the item.");
      return;
    }
    setError("");

    const newItem = {
      id: Date.now().toString(),
      title,
      description,
      location,
      additionalInfo,
      status: postType,
      postedBy: "Current User",
      postedTime: "Just now",
      photo: photo || "https://i.imgur.com/2nCt3Sbl.jpg",
    };

    try {
      const stored = await AsyncStorage.getItem("lfItems");
      const items = stored ? JSON.parse(stored) : [];
      items.push(newItem);
      await AsyncStorage.setItem("lfItems", JSON.stringify(items));
    } catch (err) {
      console.error("Error saving item:", err);
    }
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    router.push("/(tabs)/LostFound");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={{ height: 20 }} />

        <View style={styles.postTypeContainer}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              postType === "Lost" && styles.activeLost,
            ]}
            onPress={() => setPostType("Lost")}
          >
            <Text
              style={[
                styles.typeText,
                postType === "Lost" && styles.activeLostText,
              ]}
            >
              Lost
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeButton,
              postType === "Found" && styles.activeFound,
            ]}
            onPress={() => setPostType("Found")}
          >
            <Text
              style={[
                styles.typeText,
                postType === "Found" && styles.activeFoundText,
              ]}
            >
              Found
            </Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
        ) : null}

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Lost calculator near FIEK"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Describe details like color, brand, etc."
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Where item was lost or found"
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Additional Information</Text>
        <View style={styles.infoBox}>
          <TextInput
            style={[styles.infoInput, { height: 100 }]}
            placeholder="Add extra details here (e.g. scratches, stickers, unique marks)"
            multiline
            value={additionalInfo}
            onChangeText={setAdditionalInfo}
          />
        </View>

        <Text style={styles.label}>Upload Photo</Text>
        <TouchableOpacity style={styles.uploadBox}>
          {photo ? (
            <Image source={photo} style={styles.previewImage} />
          ) : (
            <Text style={styles.uploadText}>📷 Tap to upload photo</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Post</Text>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Item posted successfully!</Text>

            <TouchableOpacity onPress={closeModal}>
              <Text style={styles.modalBtn}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  postTypeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
  },
  typeText: { fontWeight: "bold", color: "#666" },
  activeLost: { backgroundColor: "#FFD6D6" },
  activeLostText: { color: "#C80000" },
  activeFound: { backgroundColor: "#D8F5D2" },
  activeFoundText: { color: "#2E7D32" },
  label: {
    color: "#820D0D",
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fafafa",
  },
  infoBox: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 10,
    marginTop: 6,
  },
  infoInput: {
    color: "#333",
    fontSize: 14,
    lineHeight: 20,
    textAlignVertical: "top",
  },
  uploadBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    height: 160,
    marginTop: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
  },
  uploadText: { color: "#777", fontSize: 14 },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    resizeMode: "cover",
  },
  submitButton: {
    backgroundColor: "#820D0D",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 30,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    backgroundColor: "white",
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },

  modalBtn: {
    backgroundColor: "#820D0D",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
