import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerLocalNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== "granted") {
    Alert.alert(
      "Leja e nevojshme",
      "Duhet te lejosh njoftimet per te marre update"
    );
    return false;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "CampusConnect Notifications",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return true;
}

export const notifyAnswerToQuestion = async (questionText) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Pergjigje e re",
      body: `Dikush iu pergjigj pytjes tende: "${questionText}"`,
    },
    trigger: null,
  });
};
