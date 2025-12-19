import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { addDoc, collection, doc, getDoc, Timestamp } from "firebase/firestore";
import { useState, useEffect } from "react";
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function PostLFItem() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [postType, setPostType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [photo, setPhoto] = useState(null);

  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const imageScale = useSharedValue(0.9);
  const imageOpacity = useSharedValue(0);

  useEffect(() => {
    if (!photo) return;

    imageScale.value = 0.9;
    imageOpacity.value = 0;

    imageScale.value = withSpring(1, {
      damping: 12,
      stiffness: 120,
    });

    imageOpacity.value = withTiming(1, { duration: 200 });
  }, [photo]);

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    opacity: imageOpacity.value,
    transform: [{ scale: imageScale.value }],
  }));

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Permission to access media library is required!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      const base64Img = `data:image/jpg;base64,${result.assets[0].base64}`;
      setPhoto(base64Img);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "Permission to access camera is required!"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      base64: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      const base64Img = `data:image/jpg;base64,${result.assets[0].base64}`;
      setPhoto(base64Img);
    }
  };

  const handleSubmit = async () => {
    if (loading || !user) {
      setError("User not authenticated.");
      return;
    }

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
    if (!photo) {
      setError("Please upload a photo of the item.");
      return;
    }

    setError("");

    try {
      const userDocRef = doc(db, "users", user.id);
      const userSnap = await getDoc(userDocRef);
      let postedByName = user.email;
      if (userSnap.exists()) {
        const userData = userSnap.data();
        postedByName = `${userData.firstname} ${userData.lastname}`;
      }

      await addDoc(collection(db, "lost_found_items"), {
        title,
        description,
        location,
        additionalInfo,
        status: postType,
        userId: user.id,
        postedBy: postedByName,
        pfp: user.photoURL ?? null,
        postedTime: Timestamp.now(),
        photo: photo,
      });

      setModalVisible(true);
    } catch (err) {
      console.error("Error saving item:", err);
      setError("Something went wrong");
    }
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
        <View style={styles.postTypeContainer}>
          {["Lost", "Found"].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                postType === type &&
                  (type === "Lost" ? styles.activeLost : styles.activeFound),
              ]}
              onPress={() => setPostType(type)}
            >
              <Text
                style={[
                  styles.typeText,
                  postType === type &&
                    (type === "Lost"
                      ? styles.activeLostText
                      : styles.activeFoundText),
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Additional Information</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          multiline
          value={additionalInfo}
          onChangeText={setAdditionalInfo}
        />

        <Text style={styles.label}>Upload Photo</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
          {photo ? (
            <Animated.Image
              source={{ uri: photo }}
              style={[styles.previewImage, imageAnimatedStyle]}
            />
          ) : (
            <Text style={styles.uploadText}>📷 Tap to upload photo</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: "#555" }]}
          onPress={takePhoto}
        >
          <Text style={styles.submitText}>Take Photo</Text>
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
    previewImage: { width: "100%", height: "100%", borderRadius: 8 },
  },
});
