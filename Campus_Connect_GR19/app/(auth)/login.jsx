import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!email.trim() || !password.trim()) {
      setError("Both fields are required.");
      return false;
    }
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return false;
    }
    setError("");
    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/");
    } catch (error) {
      setError(
        error.code === "auth/invalid-credential"
          ? "Incorrect email or password"
          : error.message
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/Logo1.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Campus Connect</Text>
        <Text style={styles.subtitle}>Welcome back! Log in to continue.</Text>
      </View>

      <View style={styles.card}>
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

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginBtnText}>
            {loading ? "Logging in..." : "Log In"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={styles.linkText}>
            Don't have an account? <Text style={{ color: "#820D0D" }}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
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

  loginBtn: {
    backgroundColor: "#820D0D",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 12,
  },

  loginBtnText: {
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
});
