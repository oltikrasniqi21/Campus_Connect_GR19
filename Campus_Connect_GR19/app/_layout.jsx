import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/components/useColorScheme";
import { Text, StyleSheet, Dimensions } from "react-native";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return <RootLayoutNav />;
}

function CustomHeaderTitle({ title }) {
  const screenWidth = Dimensions.get("window").width;
  return (
    <Text style={[styles.headerText, { fontSize: screenWidth * 0.06 }]}>
      {title}
    </Text>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen
          name="PostLFItem"
          options={sharedHeaderOptions("Post Item")}
        />
        <Stack.Screen
          name="SavedPosts"
          options={sharedHeaderOptions("Saved Posts")}
        />
      <Stack.Screen
  name="items/[id]"
  options={sharedHeaderOptions("Lost & Found")} 
    />
      </Stack>
    </ThemeProvider>
  );
}

function sharedHeaderOptions(title) {
  return {
    headerTitle: () => <CustomHeaderTitle title={title} />,
    headerStyle: {
      backgroundColor: "#820D0D",
      height: 90,
    },
    headerTintColor: "#fff",
    headerTitleAlign: "center",
    headerShadowVisible: false,
    headerBackTitleVisible: false,
  };
}

const styles = StyleSheet.create({
  headerText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "SpaceMono",
  },
});
