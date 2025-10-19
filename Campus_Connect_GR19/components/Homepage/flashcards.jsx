import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export function Flashcard(){
  return (
    <View style={styles.container}>
      
    </View>
  )
}


const styles = StyleSheet.create({
    container:{
        width:250,
        backgroundColor:'yellow',
        borderRadius:20,
        dropShadowColor: 'lightgrey',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 9,
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',

    }
})