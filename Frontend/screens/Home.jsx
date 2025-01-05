import {TouchableOpacity, View } from 'react-native';
import React from 'react';
import { FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ProfileScreen from './Profile';
import RequestScreen from './Requests';
import FriendsScreen from './Friends';

const Tab = createBottomTabNavigator();

function HomeScreen() {
  return (
    <Tab.Navigator 
      screenOptions={({route, navigation}) => ({
        headerLeft: () => (
          <View style = {{ marginLeft: 10 ,width: 30, height: 30, borderRadius: 10, backgroundColor: 'e0e0e0'}}>
            {/* <Image source = { require('../assets/profile.png')} /> */}
          
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity>
            <FontAwesomeIcon style = {{ marginRight : 18}} icon="magnifying-glass" size={24} color="black" />
          </TouchableOpacity>
        ),
        tabBarIcon: ({focused, color, size}) => {
         const icons = {
          Requests: 'bell',
          Friends: 'inbox',
          Profile: 'user'
         } 
         const icon = icons[route.name]
         return (
          <FontAwesomeIcon icon = {icon} size={27} color={color} />
         )
        },
        tabBarActiveTintColor: 'teal',
        tabBarInactiveTintColor: 'thistle',
      })}
    >
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Requests" component={RequestScreen} />     
    </Tab.Navigator>
  )
}

export default HomeScreen;