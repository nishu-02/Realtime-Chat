import {StyleSheet, StatusBar, Animated } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Title from '../common/Title';
export default function SplashScreen() {

  const animated = new Animated.Value(0);
    const duration = 800;

    useEffect (() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animated, {
            toValue: 30,
            duration: duration,
            useNativeDriver: true
          }),
          Animated.timing(animated, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true
          })
        ])
      ).start()
    }, [])
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View style = {[{ transform : [{ translateY: animated}] }]}>
        <Title text='Realtime Chat'/>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  
});
