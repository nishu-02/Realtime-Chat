import React, { useEffect, useState } from 'react';
import { StyleSheet, StatusBar } from 'react-native';

import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import './src/fontawesome';

import SplashScreen from './screens/Splash';
import SignInScreen from './screens/SignIn';
import SignUp from './screens/SignUp';
import MessageScreen from './screens/Message';
import SearchScreen from './screens/Search';
import HomeScreen from './screens/Home';

import useGlobal from "./core/globalStore";

const LightTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};

const Stack = createNativeStackNavigator();

function App() {
  const initialized = useGlobal((state) => state.initialized)
	const authenticated = useGlobal((state) => state.authenticated)

	const init = useGlobal((state) => state.init)

	useEffect(() => {
		init()
	}, [])
  
  return (
    <NavigationContainer theme={LightTheme}>
      <StatusBar barStyle="dark-content" />
      <Stack.Navigator>
        {!initialized ? (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          </>
        ) : !authenticated ? (
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="Message" component={MessageScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'beige',
  },
});

export default App;
