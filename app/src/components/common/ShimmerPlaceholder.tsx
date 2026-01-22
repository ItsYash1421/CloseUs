import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  DimensionValue,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import THEME from '../../constants/theme';

interface ShimmerPlaceholderProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}

export const ShimmerPlaceholder = ({
  width = '100%',
  height = 20,
  borderRadius = THEME.borderRadius.sm,
  style,
}: ShimmerPlaceholderProps) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    );
    loop.start();

    return () => loop.stop();
  }, [animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300], // Adjust based on likely max width
  });

  return (
    <View style={[styles.container, { width, height, borderRadius }, style]}>
      <Animated.View
        style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}
      >
        <LinearGradient
          colors={[
            'rgba(255, 255, 255, 0.03)',
            'rgba(255, 255, 255, 0.1)',
            'rgba(255, 255, 255, 0.03)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    overflow: 'hidden',
  },
});
