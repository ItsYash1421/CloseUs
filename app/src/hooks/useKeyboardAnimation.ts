import { useRef, useEffect } from 'react';
import { Animated, Keyboard, Platform, KeyboardEvent } from 'react-native';

export const useKeyboardAnimation = (config = {}) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const imageOpacity = useRef(new Animated.Value(1)).current;
  const imageScale = useRef(new Animated.Value(1)).current;
  const buttonOpacity = useRef(new Animated.Value(1)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Default configuration
  const {
    translateYValue = -150,
    imageScaleValue = 0.8,
    buttonScaleValue = 0.8,
  } = config as { translateYValue?: number; imageScaleValue?: number; buttonScaleValue?: number };

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (event: KeyboardEvent) => {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: translateYValue,
          tension: 50, // Slightly higher tension for snappier feel
          friction: 9,
          useNativeDriver: true,
        }),
        Animated.spring(imageScale, {
          toValue: imageScaleValue,
          useNativeDriver: true,
        }),
        Animated.timing(imageOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        // Hide button
        Animated.parallel([
          Animated.timing(buttonOpacity, {
            toValue: 0,
            duration: 150, // Faster than show
            useNativeDriver: true,
          }),
          Animated.spring(buttonScale, {
            toValue: buttonScaleValue,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    };

    const onHide = (event: KeyboardEvent) => {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          tension: 50,
          friction: 9,
          useNativeDriver: true,
        }),
        Animated.spring(imageScale, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(imageOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        // Show button
        Animated.parallel([
          Animated.timing(buttonOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.spring(buttonScale, {
            toValue: 1,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    };

    const showListener = Keyboard.addListener(showEvent, onShow);
    const hideListener = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, [translateYValue, imageScaleValue, buttonScaleValue]);

  return {
    translateY,
    imageOpacity,
    imageScale,
    buttonOpacity,
    buttonScale,
  };
};
