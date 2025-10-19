import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View,} from '@/components/Themed';
import { Link } from 'expo-router';
import AddPostButton, { BUTTON_SIZE } from '@/components/Homepage/addPostButton';
import SavedButton from '@/components/Homepage/savedButton';

import { Dimensions, StyleSheet } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const CustomHeaderTitle = () => (
  <View style={styles.headerContainer}>
    <Ionicons name="chatbubbles" size={screenWidth*0.08} color="#fff" style={styles.icon} /> 
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
          height: screenWidth * 0.18,
          flexDirection:'row',
          justifyContent:'center',
          alignItems:'center',
          padding:0,
          margin:0,
        },
        headerShadowVisible: true,
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontSize: screenWidth*0.12,
          fontWeight: 'bold',
        },
        

        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: 'white',
        tabBarStyle:{
          height:screenWidth * 0.14,
          backgroundColor: '#8B0000',
        },
        tabBarLabelStyle: { 
          fontFamily: 'SpaceMono',
          fontSize: screenWidth * 0.030,
        },

      }} 

      
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Home',
          headerTitle: () => <CustomHeaderTitle />,
          headerRight: () => (
          <View style={{width:'60%', height:BUTTON_SIZE, backgroundColor: 'transparent' }}> 
              <View style={{flex:1,flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor: 'transparent'}}>
                <SavedButton/>
                <AddPostButton/>
              </View> 
          </View>),
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
          
        }}
      />
      <Tabs.Screen
        name="LostFound"
        options={{
          title: 'Lost & Found',
          headerTitleStyle: styles.headerText,
          tabBarIcon: ({ color, size }) => <Ionicons name="search" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="newpost"
        options={{
          title: 'New Post',
          headerTitleStyle: styles.headerText,
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="Q&AScreen"
        options={{
          title: 'Q&A',
          headerTitleStyle: styles.headerText,
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitleStyle: styles.headerText,
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size}/>,
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
    fontSize: screenWidth*0.06,
    fontWeight: 'bold',
    fontFamily:'SpaceMono',
  },
});