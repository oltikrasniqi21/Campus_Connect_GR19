import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#FFFFFF" },
        headerTintColor: "#820D0D",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="ItemDetails" options={{ title: "Item Details" }} />
      <Stack.Screen name="PostLFItem" options={{ title: "Post Item" }} />
    </Stack>
  );
}
