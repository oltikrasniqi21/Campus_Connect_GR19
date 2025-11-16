import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { Pressable } from 'react-native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Link } from 'expo-router';
// import  ConfirmModal  from "../components/ConfirmModal.jsx";
// import { useState, useEffect } from 'react';
// import { auth } from '../firebase';

const screenWidth = Dimensions.get('window').width;
export const BUTTON_SIZE = screenWidth * 0.09;

export default function AddPostButton(){
  // const [modalVisible, setModalVisible] = useState(false);

  // const checkAuthentication = () => {
  //   if (!loggedIn) {
  //     return (
  //       <ConfirmModal
  //         visible={modalVisible}
  //         type="error"  
  //         message="You must be logged in to add a post."
  //         onClose={() => {setModalVisible(false)}}
  //       />
  //     );
  //   }

  return (
      <TouchableOpacity>
        <Link href="/AddPost">
          <MaterialIcons name="add" size={BUTTON_SIZE*1.2}  color="#fff" />
        </Link>
      </TouchableOpacity>
  )
};