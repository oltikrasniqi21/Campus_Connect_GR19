import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ActivityIndicator, 
  TouchableOpacity 
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from "@expo/vector-icons";

export default function MyMap({ onLocationSelect, initialCoords, readOnly = false }) {
  const [region, setRegion] = useState(null);
  const [marker, setMarker] = useState(initialCoords || null);
  const [statusMsg, setStatusMsg] = useState(initialCoords ? "Location Saved ✅" : "No location selected");


  useEffect(() => {
    if (initialCoords) {
      setRegion({
        latitude: initialCoords.latitude,
        longitude: initialCoords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } else if (!readOnly) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        let location = await Location.getCurrentPositionAsync({});
        const userRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        
        setRegion(userRegion);
       
      })();
    }
  }, []);


  const handleMapPress = (e) => {
    if (readOnly) return;
    
    const newCoords = e.nativeEvent.coordinate;
    setMarker(newCoords);
    setStatusMsg("Location Saved ✅");
    
    if (onLocationSelect) {
      onLocationSelect(newCoords);
    }
  };

  if (!region) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#820D0D" />
        <Text style={{marginTop: 10}}>Getting GPS...</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={region}
          region={readOnly ? region : undefined}
          onPress={handleMapPress}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {marker && (
            <Marker 
              coordinate={marker} 
              draggable={!readOnly}
              onDragEnd={handleMapPress}
            />
          )}
        </MapView>
      </View>

      {!readOnly && (
        <View style={[
          styles.statusBar, 
          marker ? styles.statusSaved : styles.statusEmpty
        ]}>
          <Ionicons 
            name={marker ? "checkmark-circle" : "alert-circle"} 
            size={20} 
            color="white" 
          />
          <Text style={styles.statusText}>
            {marker 
              ? " Location Selected Successfully" 
              : " Tap on the map to set location"
            }
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10,
    marginBottom: 10,
  },
  container: { 
    height: 300, 
    width: '100%', 
    borderRadius: 10, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: '#ddd',
    backgroundColor: '#eee'
  },
  map: { width: '100%', height: '100%' },
  loader: { 
    height: 300, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f0f0f0', 
    borderRadius: 10, 
    marginTop: 10 
  },

  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: -5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  statusSaved: {
    backgroundColor: '#2e7d32',
  },
  statusEmpty: {
    backgroundColor: '#757575',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14
  }
});