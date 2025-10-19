import { StyleSheet, ScrollView} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View,} from '@/components/Themed';
import { Link } from 'expo-router';
import {Flashcard} from '@/components/Homepage/flashcards.jsx';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.eventsContainer}>
        <Text style={styles.sectionTitle}>Eventet Aktuale!</Text>
        <Flashcard title={"Festival"} date={"10 tetor"} time={'10:00-15:00'} location={'FIEK'}/>
        <Flashcard title={"Festival"} date={"10 tetor"} time={'10:00-15:00'} location={'FIEK'}/>
        <Flashcard title={"Festival"} date={"10 tetor"} time={'10:00-15:00'} location={'FIEK'}/>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 10,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    
    
  },    
  eventsContainer: {
    width: '100%',
    paddingRight: 15,
    paddingLeft:5,
    rowGap: 10,
    
  },
  sectionTitle:{
    fontSize: 24,
    fontWeight:'bold',
    fontFamily: 'SpaceMono',
    marginTop:10,
    marginBottom:10,

  }

});

