import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function EditProfile() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(
    "https://i.pravatar.cc/150?img=12"
  );

  const handleSave = () => {
    console.log("Save button pressed");
  };

  const handleChangePicture = () => {
    console.log("Change picture pressed");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.avatarSection}>
        <Image source={{ uri: profilePicture }} style={styles.avatar} />
        <TouchableOpacity style={styles.changePicBtn} onPress={handleChangePicture}>
          <Ionicons name="camera" size={24} color="#fff" />
          <Text style={styles.changePicText}>Change Picture</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter first name"
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter last name"
          value={lastName}
          onChangeText={setLastName}
        />

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          placeholder="Write something about yourself"
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
  header: {
    fontSize: 22,
    fontWeight: "800",
    color: "#8B0000",
    marginBottom: 20,
    alignSelf: "flex-start",
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
  changePicText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
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
