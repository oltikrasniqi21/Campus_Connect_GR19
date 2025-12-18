import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import AddPostButton, {
  BUTTON_SIZE,
} from "@/components/Homepage/addPostButton";
import SavedButton from "@/components/Homepage/savedButton";

import { Dimensions, StyleSheet, View, Text } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { ActivityIndicator } from "react-native";

export const screenWidth = Dimensions.get("window").width;

const CustomHeaderTitle = () => (
  <View style={styles.headerContainer}>
    <Ionicons
      name="home"
      size={screenWidth * 0.08}
      color="#fff"
      style={styles.icon}
    />
    <Text style={styles.headerText}>Campus Connect</Text>
  </View>
);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#820D0D",
          height: screenWidth * 0.18,
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        },
        headerShadowVisible: true,
        headerTintColor: "#fff",
        headerTitleAlign: "left",
        headerTitleStyle: {
          fontSize: screenWidth * 0.12,
          fontWeight: "bold",
        },
        tabBarActiveTintColor: "#420202ff",
        tabBarInactiveTintColor: "white",
        tabBarStyle: {
          height: screenWidth * 0.14,
          backgroundColor: "#8B0000",
        },
        tabBarLabelStyle: {
          fontFamily: "Montserrat",
          fontSize: screenWidth * 0.03,
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          headerTitle: () => <CustomHeaderTitle />,
          headerRight: () => (
            <View
              style={{
                width: "83%",
                height: BUTTON_SIZE,
                backgroundColor: "transparent",
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems: "center",
                  backgroundColor: "transparent",
                }}
              >
                <SavedButton />
                <AddPostButton />
              </View>
            </View>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="LostFound"
        options={{
          headerTitle: () => (
            <CustomHeaderTitle title="Lost & Found" iconName="search" />
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="Q&AScreen"
        options={{
          headerTitle: () => (
            <CustomHeaderTitle title="Q&A Page" iconName="chatbubble" />
          ),
          headerTitleStyle: styles.headerText,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerTitle: () => (
            <CustomHeaderTitle title="Profile" iconName="person" />
          ),
          headerRight: ({ tintColor }) => (
            <TouchableOpacity
              onPress={() => {
                if (typeof global.toggleProfileMenu === "function") {
                  global.toggleProfileMenu();
                }
              }}
              style={{ marginRight: 16 }}
            >
              <Ionicons name="menu" size={screenWidth * 0.08} color="#fff" />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: screenWidth * 0.16,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "transparent",
    paddingTop: 4,
  },
  icon: {
    marginRight: 8,
    marginBottom: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: screenWidth * 0.06,
    fontWeight: "bold",
    fontFamily: "Montserrat",
  },
});
