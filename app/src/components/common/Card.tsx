import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';

interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    variant?: 'glass' | 'solid';
    padding?: 'none' | 'small' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({
    children,
    style,
    variant = 'glass',
    padding = 'medium',
}) => {
    return (
        <View
            style={[
                styles.card,
                variant === 'glass' ? styles.cardGlass : styles.cardSolid,
                styles[`padding_${padding}`],
                style,
            ]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: THEME.borderRadius.lg,
        ...THEME.shadows.md,
    },
    cardGlass: {
        backgroundColor: COLORS.glass,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    cardSolid: {
        backgroundColor: COLORS.backgroundCard,
    },
    padding_none: {
        padding: 0,
    },
    padding_small: {
        padding: THEME.spacing.sm,
    },
    padding_medium: {
        padding: THEME.spacing.md,
    },
    padding_large: {
        padding: THEME.spacing.lg,
    },
});
