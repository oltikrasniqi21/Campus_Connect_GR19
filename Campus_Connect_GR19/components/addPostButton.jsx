import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { Pressable } from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'

const screenWidth = Dimensions.get('window').width;
export const BUTTON_SIZE = screenWidth * 0.09;

export default function AddPostButton(){
  return (
    <View style={styles.container}>
      <Pressable style={styles.button}>
        <MaterialIcons name="add" size={BUTTON_SIZE*0.7}  color="#820D0D" />
      </Pressable>
    </View>
  )
};


const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'transparent',
        width:BUTTON_SIZE,
        height:BUTTON_SIZE,
    },
    button:{
        backgroundColor:"#fcfcfc",
        borderRadius:BUTTON_SIZE/2,
        width:BUTTON_SIZE,
        height:BUTTON_SIZE,
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    }
})