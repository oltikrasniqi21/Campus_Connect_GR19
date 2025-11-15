import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { Pressable } from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Link } from 'expo-router';

const screenWidth = Dimensions.get('window').width;
export const BUTTON_SIZE = screenWidth * 0.09;

export default function AddPostButton(){
  return (
      <TouchableOpacity>
        <Link href="/AddPost">
          <MaterialIcons name="add" size={BUTTON_SIZE*1.2}  color="#fff" />
        </Link>
      </TouchableOpacity>
  )
};


const styles = StyleSheet.create({
})