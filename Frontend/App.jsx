import React, { useState } from 'react';
import { StyleSheet, StatusBar } from 'react-native';

import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import './src/fontawesome';

import SplashScreen from './screens/Splash';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import MessageScreen from './screens/Message';
import SearchScreen from './screens/Search';
import HomeScreen from './screens/Home';

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
  const [initialized] = useState(true);
  const [authenticated] = useState(false);

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
            <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
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
