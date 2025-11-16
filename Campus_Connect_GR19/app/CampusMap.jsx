import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Button,
  Text,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";

export default function CampusMap() {
  const webviewRef = useRef(null);
  const [location, setLocation] = useState(null);

  //   const fakultetet = [
  //     {
  //       name: "Fakulteti i Inxhinierisë Elektrike dhe Kompjuterike",
  //       lat: 42.6472523,
  //       lng: 21.1634765,
  //     },
  //     { name: "Fakulteti Filozofik", lat: 42.6562016, lng: 21.1586917 },
  //     {
  //       name: "Fakulteti i Shkencave Matematiko-Natyrore",
  //       lat: 42.655553,
  //       lng: 21.158752,
  //     },
  //     { name: "Fakulteti i Mjekësisë", lat: 42.6441274, lng: 21.1564606 },
  //     { name: "Fakulteti Ekonomik", lat: 42.65, lng: 21.163 },
  //   ];

  const fakultetet = [
    {
      name: "Fakulteti i Shkencave Matematike-Natyrore",
      lat: 42.655553,
      lng: 21.158752,
    },
    {
      name: "Fakulteti i Inxhinierisë Elektrike dhe Kompjuterike",
      lat: 42.6487946,
      lng: 21.1645758,
    },
    { name: "Fakulteti i Filozofik", lat: 42.6562016, lng: 21.1586917 },
    { name: "Fakulteti i Ekonomise", lat: 42.6596787, lng: 21.1611001 },
    { name: "Fakulteti i Mjekësisë", lat: 42.6441274, lng: 21.1564606 },
    { name: "Fakulteti i Edukimit", lat: 42.6577481, lng: 21.1609501 },
  ];

  const [selectedFakultet, setSelectedFakultet] = useState(fakultetet[0]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Leja për lokacion nuk u pranua!");
        return;
      }
      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  useEffect(() => {
    if (location && webviewRef.current) {
      webviewRef.current.postMessage(
        JSON.stringify({
          user: location,
          dest: { lat: selectedFakultet.lat, lng: selectedFakultet.lng },
        })
      );
    }
  }, [location, selectedFakultet]);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
      <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css"/>
      <style>#map { height:100vh; width:100vw; margin:0; padding:0; }</style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <script src="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.min.js"></script>
      <script>
        const map = L.map('map').setView([42.6486, 21.1670], 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        const fakultetet = ${JSON.stringify(fakultetet)};
        fakultetet.forEach(f => {
          L.marker([f.lat,f.lng]).addTo(map).bindPopup(f.name);
        });

        let routingControl;

        document.addEventListener("message", function(event){
          const data = JSON.parse(event.data);
          const user = data.user;
          const dest = data.dest;

          if (routingControl) map.removeControl(routingControl);

          routingControl = L.Routing.control({
            waypoints: [
              L.latLng(user.latitude, user.longitude),
              L.latLng(dest.lat, dest.lng)
            ],
            routeWhileDragging: true,
            showAlternatives: false,
            lineOptions: { styles: [{ color: 'blue', weight: 4 }] }
          }).addTo(map);

          L.marker([user.latitude, user.longitude]).addTo(map).bindPopup("Pozicioni yt");
        });
      </script>
    </body>
    </html>
  `;

  if (!location) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Po merret lokacioni...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal contentContainerStyle={styles.buttonContainer}>
        {fakultetet.map((f, idx) => (
          <Button
            key={idx}
            title={f.name.split(" ")[2]}
            onPress={() => setSelectedFakultet(f)}
          />
        ))}
      </ScrollView>

      <WebView
        ref={webviewRef}
        originWhitelist={["*"]}
        source={{ html }}
        style={styles.map}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  buttonContainer: { padding: 10, justifyContent: "space-around" },
});
