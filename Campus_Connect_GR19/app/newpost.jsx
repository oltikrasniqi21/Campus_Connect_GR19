import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function NewPostScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Event</Text>
      {/* Add your form fields here */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#fff',
    padding:16,
  },
  title: {
    fontSize:24,
    fontWeight:'bold',
  }
});
