import { StyleSheet, ScrollView} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View,} from 'react-native';
import { Link } from 'expo-router';
import {Flashcard} from '@/components/Homepage/flashcards.jsx';
import { SafeAreaView } from "react-native-safe-area-context";
import { screenWidth } from './_layout';

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
    backgroundColor: '#ffffff'
    
  },    
  eventsContainer: {
    width: '100%',
    paddingRight: 15,
    paddingLeft:5,
    rowGap: 10,
    
  },
  sectionTitle:{
    fontSize: screenWidth*0.07,
    fontWeight:'bold',
    fontFamily: 'Montserrat',
    marginTop:10,
    marginBottom:10,

  }

});

