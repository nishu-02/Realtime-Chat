import { View, Text } from 'react-native'
import React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ProfileScreen from './Profile';
import RequestScreen from './Requests';
import FriendsScreen from './Friends';

const Tab = createBottomTabNavigator();


export default function HomeScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />      
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Requests" component={RequestScreen} />

      
    </Tab.Navigator>
  )
}