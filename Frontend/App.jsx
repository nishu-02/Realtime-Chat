import React from 'react';
import { Text, View, StyleSheet, StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './screens/Splash';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Home from './screens/Home';
import MessageScreen from './screens/MessageScreen';
import SearchScreen from './screens/SearchScreen';

const stack = createNativeStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle={dark-content} />
      <Stack.Navigatior>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen name="MessageScreen" component={MessageScreen} />        
      </Stack.Navigatior>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'beige',
  },
});

export default App;
