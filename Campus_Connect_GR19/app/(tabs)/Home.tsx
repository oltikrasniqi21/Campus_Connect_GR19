import { StyleSheet,} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View,} from 'react-native';
import { Link } from 'expo-router';
import {Flashcard} from '@/components/Homepage/flashcards.jsx';
import { SafeAreaView } from "react-native-safe-area-context";
export default function TabOneScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.eventsContainer}>
        <Text style={styles.sectionTitle}>Eventet Aktuale!</Text>
        <Flashcard title={"Festival"} date={"10 tetor"} time={'10:00-15:00'} location={'FIEK'}/>
        <Flashcard title={"Festival"} date={"10 tetor"} time={'10:00-15:00'} location={'FIEK'}/>
        <Flashcard title={"Festival"} date={"10 tetor"} time={'10:00-15:00'} location={'FIEK'}/>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#ffffff'
    
  },    
  eventsContainer: {
    width: '100%',
    gap: 15,
  },
  sectionTitle:{
    fontSize: 24,
    fontWeight:'bold',
    fontFamily: 'SpaceMono',

  }

});

