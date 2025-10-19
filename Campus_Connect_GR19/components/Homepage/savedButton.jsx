import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {BUTTON_SIZE} from '@/components/Homepage/addPostButton';
import { TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Link } from 'expo-router';

const SavedButton = () => {
  return (
      <TouchableOpacity style={styles.button}>
        <Link href="/SavedPosts">
            <Entypo name="heart-outlined" size={BUTTON_SIZE}  color="#fff" />
        </Link>
      </TouchableOpacity>
  )
}

export default SavedButton

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'transparent',
        height:BUTTON_SIZE,
    },
    button:{
        flex:1,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        maxWidth:BUTTON_SIZE*0.5,
        height:BUTTON_SIZE,
    }
   
})