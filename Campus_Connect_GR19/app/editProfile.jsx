import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function EditProfile() {
  const router = useRouter();
  const currentUser = auth.currentUser;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);

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
          setProfilePicture(data.photoURL || profilePicture);
        }
      } catch (err) {
        console.error("Error loading user:", err);
      }
    };

    loadUser();
  }, [currentUser]);

  const handleChangePicture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      
      if (file.size > 1024 * 1024) {
        Alert.alert("Error", "Please select an image smaller than 1MB");
        return;
      }
      
      setUploading(true);
      
      try {
      
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64Image = event.target.result;
          setProfilePicture(base64Image);
          setUploading(false);
        };
        reader.onerror = () => {
          Alert.alert("Error", "Failed to process image");
          setUploading(false);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Error", "Failed to process image");
        setUploading(false);
      }
    };
    
    input.click();
  };

  const handleSave = async () => {
    if (!currentUser) {
      Alert.alert("Error", "No user logged in");
      return;
    }

    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        firstname: firstName,
        lastname: lastName,
        bio,
        photoURL: profilePicture,
      });

      Alert.alert("Success", "Profile updated successfully!");
      router.replace("/profile");
    } catch (err) {
      console.error("Error saving profile:", err);
      Alert.alert("Error", "Failed to save profile.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarSection}>
        <Image source={{ uri: profilePicture }} style={styles.avatar} />
        <TouchableOpacity
          style={[styles.changePicBtn, uploading && styles.disabledBtn]}
          onPress={handleChangePicture}
          disabled={uploading}
        >
          <Ionicons name="camera" size={24} color="#fff" />
          <Text style={styles.changePicText}>
            {uploading ? "Processing..." : "Change Picture"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.noteText}>Note: Images stored locally</Text>
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

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 50,
    backgroundColor: "#FCFCFC",
    alignItems: "center",
    maxWidth: 450,
    width: "100%",
    alignSelf: "center",
  },
  avatarSection: {
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
  changePicBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#820D0D",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
  },
  disabledBtn: {
    backgroundColor: "#CCCCCC",
  },
  changePicText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
  },
  noteText: {
    marginTop: 8,
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  form: {
    width: "100%",
  },
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
  bioInput: {
    height: 100,
    textAlignVertical: "top",
  },
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
});