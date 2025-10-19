import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Entypo, Ionicons } from '@expo/vector-icons'

export function Flashcard({title, date, time, location}){
  return (
    <View style={styles.container}>
        <View style={styles.section}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.info}>{date} <Text style={{fontWeight:'bold'}}>{time}</Text>{'\n'}Lokacioni: {location} </Text>
        </View>
        <View style={[styles.section, {alignItems:'flex-end'}]}>
            <Pressable style={styles.seeMoreButton}>
                <Text style={{fontSize:'4.5vw',fontFamily:'SpaceMono', marginBottom:'1vw',color:'#fcfcfc', fontWeight:'500', marginRight:'-1vw'}}>See More</Text>
                <Entypo name="chevron-right" size={'8.5vw'} color="#fcfcfc" />
            </Pressable>
        </View>
     
    </View>
  )
}


const styles = StyleSheet.create({
    container:{
        width:'100%',
        height:'25vw',
        backgroundColor:'#FCF9EA',
        borderRadius:20,
        dropShadowColor: 'lightgrey',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 9,
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        boxSizing:'border-box',
        padding:10,

    },
    section:{
        width:'50%',
        height:'100%',
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'left',
    },
    title:{
        fontSize:'6vw',
        fontWeight:'bold',
        fontFamily:'SpaceMono',
    },
    info:{
        fontSize:'3.5vw',
        fontFamily:'SpaceMono',
    },
    seeMoreButton:{
        flexDirection:'row', 
        alignItems:'center',
        justifyContent:"right",
        backgroundColor:'#820d0d',
        borderRadius:'6vw',
        width:'33vw',
        height:'10vw',
        boxSizing:'border-box',
        paddingRight:'1vw',
    }
})