import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Modal,
  Animated,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase.js";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

export default function EditProfile() {
  const router = useRouter();
  const currentUser = auth.currentUser;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (showImagePickerModal) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [showImagePickerModal]);

  useEffect(() => {
    if (!currentUser) return;

    const loadUser = async () => {
      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));
        if (snap.exists()) {
          const data = snap.data();
          setFirstName(data.firstname || "");
          setLastName(data.lastname || "");
          setBio(data.bio || "");
          setProfilePicture(data.photoURL || null);
        }
      } catch (err) {
        console.error("Error loading user:", err);
      }
    };

    loadUser();
  }, [currentUser]);

  const processImage = useCallback(async (uri) => {
    try {
      setUploading(true);
      const manipulated = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 300, height: 300 } }],
        {
          compress: 0.5,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );
      const base64String = `data:image/jpeg;base64,${manipulated.base64}`;
      setProfilePicture(base64String);
    } catch (error) {
      console.error("Image processing error:", error);
      Alert.alert("Error", "Failed to process image.");
    } finally {
      setUploading(false);
    }
  }, []);

  const pickFromCamera = useCallback(async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Camera access is required.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      await processImage(result.assets[0].uri);
    }
  }, [processImage]);

  const pickFromLibrary = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Media library access is required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      await processImage(result.assets[0].uri);
    }
  }, [processImage]);

  const closeImagePickerModal = (onFinishedCallback) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowImagePickerModal(false);
  
      if (onFinishedCallback && typeof onFinishedCallback === 'function') {
        setTimeout(onFinishedCallback, 100);
      }
    });
  };

  const handleSave = useCallback(async () => {
    if (!currentUser) {
      Alert.alert("Error", "No user logged in");
      return;
    }
    setUploading(true);
    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        firstname: firstName,
        lastname: lastName,
        bio: bio,
        photoURL: profilePicture,
      });
      Alert.alert("Success", "Profile updated successfully!");
      router.back();
    } catch (err) {
      console.error("Error saving profile:", err);
      Alert.alert("Error", "Failed to save profile.");
    } finally {
      setUploading(false);
    }
  }, [currentUser, firstName, lastName, bio, profilePicture, router]);

  const avatarSource = useMemo(() => {
    return profilePicture
      ? { uri: profilePicture }
      : require("../assets/images/avatar-placeholder.png");
  }, [profilePicture]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarSection}>
        <Image source={avatarSource} style={styles.avatar} resizeMode="cover" />
        <TouchableOpacity
          style={[styles.changePicBtn, uploading && styles.disabledBtn]}
          onPress={() => setShowImagePickerModal(true)}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="camera" size={24} color="#fff" />
          )}
          <Text style={styles.changePicText}>
            {uploading ? " Processing..." : " Change Picture"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          value={bio}
          onChangeText={setBio}
          multiline
        />

        <TouchableOpacity
          style={[styles.saveBtn, uploading && styles.disabledBtn]}
          onPress={handleSave}
          disabled={uploading}
        >
          <Text style={styles.saveBtnText}>
            {uploading ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showImagePickerModal}
        transparent
        animationType="none" 
        onRequestClose={() => closeImagePickerModal()}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[styles.modalContent, { opacity: fadeAnim, transform: [{translateY: fadeAnim.interpolate({inputRange: [0, 1], outputRange: [100, 0]})}] }]}
          >
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => closeImagePickerModal(pickFromCamera)}
            >
              <Ionicons name="camera-outline" size={24} color="#333" />
              <Text style={styles.modalOptionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => closeImagePickerModal(pickFromLibrary)}
            >
              <Ionicons name="images-outline" size={24} color="#333" />
              <Text style={styles.modalOptionText}>Choose from Library</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => closeImagePickerModal()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 50,
    backgroundColor: "#FCFCFC",
    alignItems: "center",
    maxWidth: 450,
    width: "100%",
    alignSelf: "center",
  },
  avatarSection: { alignItems: "center", marginBottom: 30 },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "#E0DDD5",
    backgroundColor: "#E0DDD5",
  },
  changePicBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#820D0D",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  disabledBtn: { backgroundColor: "#CCCCCC" },
  changePicText: { color: "#fff", marginLeft: 8, fontSize: 14 },
  form: { width: "100%" },
  label: {
    fontSize: 14,
    color: "#656565",
    marginBottom: 5,
    marginTop: 15,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#F3F3F3",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    fontSize: 16,
    color: "#333",
  },
  bioInput: { height: 100, textAlignVertical: "top" },
  saveBtn: {
    backgroundColor: "#820D0D",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 25,
    marginBottom: 10,
    width: "100%",
  },
  saveBtnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
  },
  cancelText: {
    color: "#820D0D",
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalOptionText: { fontSize: 16, marginLeft: 15, color: "#333" },
  cancelButton: { paddingVertical: 18, alignItems: "center", marginTop: 10 },
  cancelButtonText: { fontSize: 16, color: "#820D0D", fontWeight: "600" },
});