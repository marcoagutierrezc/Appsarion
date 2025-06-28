import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export function FishLoadingScreen(){
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Svg height="100" width="100" viewBox="0 0 100 100">
          <Path
            d="M50 10 C70 10 90 30 90 50 C90 70 70 90 50 90 C30 90 10 70 10 50 C10 30 30 10 50 10 Z M50 30 L70 50 L50 70 L30 50 Z"
            fill="#3B82F6"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
  },
});

export default FishLoadingScreen;