import { Platform } from 'react-native';

/**
 * Glassmorphism / Blur Effect Configuration
 * Use this for consistent blur effects across the app
 */

export const BLUR_CONFIG = {
    // BlurView settings for @react-native-community/blur
    blurType: Platform.OS === 'ios' ? 'dark' : 'dark' as const,
    blurAmount: Platform.OS === 'ios' ? 20 : 15,
    fallbackColor: 'rgba(10, 10, 15, 0.9)',

    // Overlay tints for additional effects
    tints: {
        none: 'rgba(0, 0, 0, 0)',
        subtle: 'rgba(0, 0, 0, 0.05)',
        light: 'rgba(0, 0, 0, 0.1)',
        medium: 'rgba(0, 0, 0, 0.2)',
        dark: 'rgba(0, 0, 0, 0.3)',
    },

    // Glass border styles
    borders: {
        subtle: {
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        medium: {
            borderWidth: 1.5,
            borderColor: 'rgba(255, 255, 255, 0.15)',
        },
        strong: {
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.2)',
        },
    },

    // Pre-defined glass styles for common use cases
    styles: {
        // For floating cards/containers
        card: {
            backgroundColor: 'rgba(15, 15, 25, 0.8)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
        },
        // For navigation bars
        navbar: {
            backgroundColor: 'rgba(10, 10, 15, 0.95)',
            borderWidth: 1.5,
            borderColor: 'rgba(255, 255, 255, 0.15)',
        },
        // For modals/overlays
        modal: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.2)',
        },
    },
};

/**
 * Example usage:
 * 
 * import { BlurView } from '@react-native-community/blur';
 * import { BLUR_CONFIG } from '../constants/blur';
 * 
 * <BlurView
 *   style={StyleSheet.absoluteFill}
 *   blurType={BLUR_CONFIG.blurType}
 *   blurAmount={BLUR_CONFIG.blurAmount}
 *   reducedTransparencyFallbackColor={BLUR_CONFIG.fallbackColor}
 * />
 * 
 * // Add tint overlay:
 * <View style={{ 
 *   ...StyleSheet.absoluteFill,
 *   backgroundColor: BLUR_CONFIG.tints.light 
 * }} />
 * 
 * // Glass border:
 * <View style={BLUR_CONFIG.borders.medium} />
 */
