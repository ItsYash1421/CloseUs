import { StackNavigationOptions } from '@react-navigation/stack';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { Easing } from 'react-native';

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

    // Transition spec with cubic bezier easing for ultra-smooth animations
    transitionSpec: {
        open: {
            animation: 'timing',
            config: {
                duration: 300,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Cubic bezier ease-in-out
            },
        },
        close: {
            animation: 'timing',
            config: {
                duration: 280,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Cubic bezier ease-in-out
            },
        },
    },

    // No header by default (screens can override)
    headerShown: false,
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
            },
        },
        close: {
            animation: 'timing',
            config: {
                duration: 200,
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
    headerShown: false,
};
