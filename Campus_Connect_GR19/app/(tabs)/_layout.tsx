import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { StyleSheet,} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View,} from '@/components/Themed';
import { Link } from 'expo-router';
import AddPostButton, { BUTTON_SIZE } from '@/components/addPostButton';


const CustomHeaderTitle = () => (
  <View style={styles.headerContainer}>
    <Ionicons name="chatbubbles" size={30} color="#fff" style={styles.icon} /> 
    <Text style={styles.headerText}>Campus Connect</Text>
  </View>
);

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#820D0D',
          flex:1,
          width:'100%',
          flexDirection:'row',
          justifyContent:'center',
          alignItems:'center',
          padding:0,
          margin:0,
        },
        headerShadowVisible: true,
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontSize:28,
          fontWeight: 'bold',
        },
        

        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: 'white',
        tabBarStyle:{
          backgroundColor: '#8B0000',
        },

      }} 

      
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Home',
          headerTitle: () => <CustomHeaderTitle />,
          headerRight: () => (
          <View style={{width:BUTTON_SIZE, height:BUTTON_SIZE, marginRight: 10, backgroundColor: 'transparent' }}> 
              <AddPostButton/>
          </View>),
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="LostFound"
        options={{
          title: 'Lost & Found',
          tabBarIcon: ({ color, size }) => <Ionicons name="search" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="newpost"
        options={{
          title: 'New Post',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="Q&AScreen"
        options={{
          title: 'Q&A',
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'transparent',
  },
  icon: {
    marginRight: 8, 
  },
  headerText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
});