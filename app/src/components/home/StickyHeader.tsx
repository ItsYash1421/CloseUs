import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { BLUR_CONFIG } from '../../constants/blur';
import { BlurView } from '@react-native-community/blur';

interface StickyHeaderProps {
    hashtag?: string;
    scrollY: Animated.Value;
}

export const StickyHeader: React.FC<StickyHeaderProps> = ({ hashtag, scrollY }) => {
    const insets = useSafeAreaInsets();

    // Header appears when scroll > 100
    const headerOpacity = scrollY.interpolate({
        inputRange: [80, 120],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const headerTranslateY = scrollY.interpolate({
        inputRange: [80, 120],
        outputRange: [-60, 0],
        extrapolate: 'clamp',
    });

    if (!hashtag) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    paddingTop: insets.top,
                    opacity: headerOpacity,
                    transform: [{ translateY: headerTranslateY }],
                },
            ]}
        >
            {/* Glass Background */}
            <BlurView
                style={StyleSheet.absoluteFill}
                blurType={BLUR_CONFIG.blurType}
                blurAmount={BLUR_CONFIG.blurAmount}
                reducedTransparencyFallbackColor={BLUR_CONFIG.fallbackColor}
            />

            {/* Tint Overlay */}
            <View style={styles.tintOverlay} />

            {/* Border */}
            <View style={styles.border} />

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.hashtagText}>{hashtag}</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        overflow: 'hidden',
    },
    tintOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: BLUR_CONFIG.tints.light,
    },
    border: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    content: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: THEME.spacing.lg,
    },
    hashtagText: {
        fontSize: 28,
        fontWeight: THEME.fontWeights.extrabold,
        color: COLORS.textPrimary,
        letterSpacing: 0.5,
    },
});
