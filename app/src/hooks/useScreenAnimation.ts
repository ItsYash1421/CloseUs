import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

interface ScreenAnimationConfig {
  duration?: number;
  useSlide?: boolean;
  slideDistance?: number;
}

/**
 * Hook for smooth screen enter/exit animations
 * Automatically triggers when screen gains/loses focus
 */
export const useScreenAnimation = (config: ScreenAnimationConfig = {}) => {
  const isFocused = useIsFocused();

  const { duration = 300, useSlide = true, slideDistance = 20 } = config;

  // Animation values
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(slideDistance)).current;
  const scale = useRef(new Animated.Value(0.98)).current;

  useEffect(() => {
    if (isFocused) {
      // Enter animation
      const animations: Animated.CompositeAnimation[] = [
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ];

      if (useSlide) {
        animations.push(
          Animated.timing(translateY, {
            toValue: 0,
            duration,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        );
      }

      Animated.parallel(animations).start();
    } else {
      // Reset for exit
      opacity.setValue(0);
      translateY.setValue(slideDistance);
      scale.setValue(0.98);
    }
  }, [isFocused, duration, useSlide, slideDistance]);

  return {
    opacity,
    translateY: useSlide ? translateY : new Animated.Value(0),
    scale,
    isFocused,
  };
};
