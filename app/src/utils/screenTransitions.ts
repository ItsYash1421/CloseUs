import { StackNavigationOptions } from '@react-navigation/stack';
import {
  CardStyleInterpolators,
  StackCardInterpolationProps,
} from '@react-navigation/stack';
import { Easing, Animated } from 'react-native';

/**
 * Custom screen transition configurations for smooth animations
 *
 * Usage:
 * - Forward navigation: Slides from right to left
 * - Back navigation: Slides from left to right
 */

export const screenTransitionConfig: StackNavigationOptions = {
  // Gesture configuration
  gestureEnabled: true,
  gestureDirection: 'horizontal',

  // Use the horizontal slide interpolator (right-to-left when going forward)
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,

  // Keep previous screen attached during transition
  detachPreviousScreen: false,

  // UPDATED: Spring animation for ultra-smooth feel
  transitionSpec: {
    open: {
      animation: 'spring',
      config: {
        stiffness: 350,
        damping: 35,
        mass: 1,
      },
    },
    close: {
      animation: 'spring',
      config: {
        stiffness: 350,
        damping: 35,
        mass: 1,
      },
    },
  },

  // No header by default (screens can override)
  headerShown: false,
};

/**
 * Smooth fade + slide transition (iOS-like)
 */
export const fadeSlideTransition = ({
  current,
  layouts,
}: StackCardInterpolationProps) => {
  return {
    cardStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [layouts.screen.width * 0.08, 0],
          }),
        },
        {
          scale: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.98, 1],
          }),
        },
      ],
    },
  };
};

/**
 * Alternative: Fade transition (if needed for specific screens)
 */
export const fadeTransitionConfig: StackNavigationOptions = {
  gestureEnabled: false,
  cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 200,
        easing: Easing.out(Easing.cubic),
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 200,
        easing: Easing.in(Easing.cubic),
      },
    },
  },
  headerShown: false,
};

/**
 * Modal-style transition (bottom to top)
 */
export const modalTransitionConfig: StackNavigationOptions = {
  gestureEnabled: true,
  gestureDirection: 'vertical',
  cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
  transitionSpec: {
    open: {
      animation: 'spring',
      config: {
        stiffness: 300,
        damping: 30,
        mass: 1,
      },
    },
    close: {
      animation: 'spring',
      config: {
        stiffness: 300,
        damping: 30,
        mass: 1,
      },
    },
  },
  headerShown: false,
};

/**
 * Scale + fade transition config
 */
export const scaleFadeTransitionConfig: StackNavigationOptions = {
  gestureEnabled: true,
  cardStyleInterpolator: fadeSlideTransition,
  transitionSpec: {
    open: {
      animation: 'spring',
      config: {
        stiffness: 320,
        damping: 32,
        mass: 1,
      },
    },
    close: {
      animation: 'spring',
      config: {
        stiffness: 320,
        damping: 32,
        mass: 1,
      },
    },
  },
  headerShown: false,
};
