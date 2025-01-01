import React from 'react';
import {StyleSheet, StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './screens/Splash';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import MessageScreen from './screens/Message';
import SearchScreen from './screens/Search';
import HomeScreen from './screens/Home';

const stack = createNativeStackNavigator();
function App() {

  const[intialized] = useState(false);
  const[authenticated] =useState(false);

  return (
    <NavigationContainer>
      <StatusBar barStyle={dark-content} />
      <Stack.Navigatior>
        {!intialized ? (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false}} />
        </>
        ) : !authenticated ?(
          <>
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </>
        ) : (
          <>
          <Stack.Screen name="Home" component={HomeScreen} options = {{ headerShown: false}}/>
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Message" component={MessageScreen} />        
        </>          
        )}     
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
