import { View, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { GRADIENTS, COLORS } from '../../constants/colors';

interface GradientBackgroundProps {
    children: React.ReactNode;
    variant?: 'background' | 'primary' | 'secondary' | 'purple';
    scrollY?: Animated.Value;
    scrollInputRange?: number[];
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
    children,
    variant = 'background',
    scrollY,
    scrollInputRange = [0, 400], // Default scroll distance for full transition
}) => {
    // If standard variant (not background) or no scrollY, render static
    if (variant !== 'background' || !scrollY) {
        return (
            <LinearGradient
                colors={GRADIENTS[variant]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradient}>
                {children}
            </LinearGradient>
        );
    }

    // Dynamic Scroll Implementation
    // We layer two gradients and animate opacity for better performance
    const opacity = scrollY.interpolate({
        inputRange: scrollInputRange,
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.container}>
            {/* Layer 1: Light Gradient (Bottom Layer - Always Visible) */}
            <LinearGradient
                colors={COLORS.gradientBackgroundLight}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Layer 2: Dark Gradient (Top Layer - Fades In) */}
            <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>
                <LinearGradient
                    colors={COLORS.gradientBackgroundDark}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={StyleSheet.absoluteFill}
                />
            </Animated.View>

            {/* Content Container */}
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight, // Fallback
    },
    gradient: {
        flex: 1,
    },
    content: {
        flex: 1,
        zIndex: 1,
    }
});
