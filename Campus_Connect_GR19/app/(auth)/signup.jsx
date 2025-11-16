import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase.js"; 



export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const validateInputs = () => {
    if (!firstname.trim() || !lastname.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("All fields are required.");
      return false;
    }

    const nameRegex = /^[A-Za-z]{2,30}$/;

    if (!nameRegex.test(firstname)) {
      setError("First name must contain only letters and no numbers.");
      return false;
    }

    if (!nameRegex.test(lastname)) {
      setError("Last name must contain only letters and no numbers.");
      return false;
    }


    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return false;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return;
    setLoading(true);

    try {
     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
       const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
      u_id: user.uid,
      firstname,
      lastname,
      email: user.email,
    });
   
     setLoading(false);
      setModalVisible(true);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      if (error.code === "auth/email-already-in-use") {
        setError("Email already exists.");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/Logo1.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Campus Connect today.</Text>
      </View>

      <View style={styles.card}>
        <TextInput
          placeholder="First Name"
          placeholderTextColor="#9A9A9A"
          value={firstname}
          onChangeText={setFirstname}
          style={styles.input}
        />
        <TextInput
          placeholder="Last Name"
          placeholderTextColor="#9A9A9A"
          value={lastname}
          onChangeText={setLastname}
          style={styles.input}
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor="#9A9A9A"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#9A9A9A"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#9A9A9A"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.signupBtn} onPress={handleSignUp}>
          <Text style={styles.signupBtnText}>
            {loading ? "Creating account..." : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.linkText}>
            Already have an account?{" "}
            <Text style={{ color: "#820D0D" }}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Account Created 🎉</Text>
            <TouchableOpacity onPress={() => router.replace("/login")}>
              <Text style={styles.modalBtn}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingBottom: 60,
    backgroundColor: "#ffffff",
  },

  header: {
    alignItems: "center",
    marginTop: 50,
  },

  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 10,
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#820D0D",
  },

  subtitle: {
    fontSize: 15,
    color: "#6F6F6F",
    marginTop: 5,
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#FDFDFD",
    padding: 25,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  input: {
    backgroundColor: "#F3F3F3",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    marginBottom: 14,
    color: "#333",
    fontSize: 16,
  },

  signupBtn: {
    backgroundColor: "#820D0D",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 12,
  },

  signupBtnText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
  },

  linkText: {
    textAlign: "center",
    color: "#444",
    marginTop: 5,
    fontSize: 14,
  },

  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 16,
    alignItems: "center",
    elevation: 5,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },

  modalBtn: {
    backgroundColor: "#820D0D",
    color: "white",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    overflow: "hidden",
    fontWeight: "700",
    marginTop: 10,
  },
});
