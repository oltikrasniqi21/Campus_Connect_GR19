import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import AddPostButton, { BUTTON_SIZE } from '@/components/Homepage/addPostButton';
import SavedButton from '@/components/Homepage/savedButton';

import { Dimensions, StyleSheet } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const CustomHeaderTitle = ({title = "Campus Connect", iconName="home"}) => (
  <View style={styles.headerContainer}>
    <Ionicons name={iconName} size={screenWidth*0.08} color="#fff" style={styles.icon} /> 
    <Text style={styles.headerText}>{title}</Text>
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
          height: screenWidth * 0.18,
        },
        headerShadowVisible: true,
        headerTintColor: '#fff',
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: screenWidth*0.12,
          fontWeight: 'bold',
        },
         tabBarActiveTintColor: '#898589',
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
          headerTitle: () => <CustomHeaderTitle title="Lost & Found" iconName="search"/>,
          tabBarIcon: ({ color, size }) => <Ionicons name="search" color={color} size={size} />,
        }}
      />
    
      <Tabs.Screen
        name="Q&AScreen"
        options={{
            headerTitle: () => <CustomHeaderTitle title="Q&A Page" iconName="chatbubble"/>,
          headerTitleStyle: styles.headerText,
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble" color={color} size={size} />,
        }}
      />
    <Tabs.Screen
  name="profile"
  options={{
    headerTitle: () => <CustomHeaderTitle title="Profile" iconName="person" />,
    headerRight: ({ tintColor }) => (
      <TouchableOpacity
        onPress={() => {
          if (typeof global.toggleProfileMenu === "function") {
            global.toggleProfileMenu();
          }
        }}
        style={{ marginRight: 16 }}
      >
        <Ionicons name="menu" size={screenWidth * 0.08} color="#fff" />
      </TouchableOpacity>
    ),
    tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
  }}
/>

    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: screenWidth * 0.16,
    width: '100%',
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    justifyContent: 'flex-start', 
        paddingHorizontal: 16,  
    backgroundColor: 'transparent',
    paddingTop:4
  },
  icon: {
    marginRight: 8, 
    marginTop: 5,
  },
  headerText: {
    color: '#fff',
    fontSize: screenWidth*0.06,
    fontWeight: 'bold',
    fontFamily:'SpaceMono',
    marginTop: 5,
  },
});