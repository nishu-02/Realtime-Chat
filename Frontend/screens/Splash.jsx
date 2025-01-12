import { StyleSheet, StatusBar, Animated, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Title from '../common/Title';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const bounceAnim = new Animated.Value(0);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.3);
  const rotateAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 15,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: -15,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background circles */}
      <Animated.View style={[styles.backgroundCircle, {
        transform: [{ scale: scaleAnim }],
        opacity: fadeAnim,
      }]} />
      
      <Animated.View style={[styles.backgroundCircle, styles.secondCircle, {
        transform: [{ rotate: spin }],
        opacity: fadeAnim,
      }]} />

      <Animated.View style={[
        styles.titleContainer,
        {
          transform: [
            { translateY: bounceAnim },
            { scale: scaleAnim }
          ],
          opacity: fadeAnim,
        }
      ]}>
        <Title text='Realtime Chat' />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  backgroundCircle: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    backgroundColor: 'rgba(75, 0, 130, 0.1)',
  },
  secondCircle: {
    backgroundColor: 'rgba(138, 43, 226, 0.05)',
    transform: [{ scale: 1.2 }],
  },
  titleContainer: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
});