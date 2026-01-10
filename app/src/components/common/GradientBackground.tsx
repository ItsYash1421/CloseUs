import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { GRADIENTS } from '../../constants/colors';

interface GradientBackgroundProps {
    children: React.ReactNode;
    variant?: 'background' | 'primary' | 'secondary' | 'purple';
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
    children,
    variant = 'background',
}) => {
    const gradientColors = GRADIENTS[variant];

    return (
        <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradient}>
            {children}
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
});
