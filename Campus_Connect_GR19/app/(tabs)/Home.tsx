import { StyleSheet,} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View,} from '@/components/Themed';
import { Link } from 'expo-router';
import {Flashcard} from '@/components/Homepage/flashcards.jsx';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Flashcard />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height:280, 
  },    

});

