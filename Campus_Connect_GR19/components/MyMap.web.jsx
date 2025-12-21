import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function MyMap({ onLocationSelect, initialCoords, readOnly = false }) {
  
  
  const lat = initialCoords ? initialCoords.latitude : 42.6629;
  const lng = initialCoords ? initialCoords.longitude : 21.1655;

  return (
    <View style={styles.container}>
      
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
      ></iframe>
       
       {!readOnly && (
           <View style={styles.overlay}>
             <Text style={styles.warningText}>
               * Use Mobile App to set precise location pins.
             </Text>
           </View>
       )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    height: 300, 
    width: '100%', 
    backgroundColor: '#eee', 
    borderRadius: 10, 
    overflow: 'hidden', 
    marginTop: 10,
    position: 'relative'
  },
  overlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 5,
    alignItems: 'center'
  },
  warningText: { fontSize: 10, color: '#555' }
});