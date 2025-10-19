import { TouchableOpacity, StyleSheet,Text, View } from 'react-native'
import React from 'react'
import { Entypo, Ionicons } from '@expo/vector-icons'

import { Dimensions } from "react-native";
const { width } = Dimensions.get("window");


export function Flashcard({title, date, time, location}){
  return (
    <View style={styles.container}>
        <View style={styles.leftSection}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.info}>{date} <Text style={{fontWeight:'bold'}}>{time}</Text>{'\n'}Lokacioni: {location} </Text>
        </View>
        <View style={[styles.section, {alignItems:'flex-end'}]}>
            <TouchableOpacity style={styles.seeMoreButton} activeOpacity={0.7} >
                
                <Text style={styles.seeMoreText}>See More</Text>
                <Entypo name="chevron-right" size={width * 0.085} color="#fcfcfc" />
            </TouchableOpacity>
        </View>

    </View>
  );
}


const styles = StyleSheet.create({
    container:{
        width:'100%',
        height: width * 0.25,
        backgroundColor:'#FCF9EA',
        borderRadius:20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 9,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        padding:10,
        marginBottom:15,

    },
    section:{
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'flex-start',
    },
    title:{
        fontSize: width * 0.06,
        fontWeight:'bold',
        fontFamily:'SpaceMono',
    },
    info:{
        fontSize:width * 0.035,
        fontFamily:'SpaceMono',
    },
    seeMoreButton:{
        flexDirection:'row', 
        alignItems:'center',
        justifyContent:"center",
        backgroundColor:'#820d0d',
        borderRadius: width * 0.06,
        width:width * 0.33,
        height:width * 0.10,
        paddingRight:width * 0.01,
    },
     seeMoreText: {
    fontSize: width * 0.045, 
    fontFamily: "SpaceMono",
    color: "#fcfcfc",
    fontWeight: "500",
    marginRight: width * -0.01, 
    marginBottom: width * 0.01,
  },
})