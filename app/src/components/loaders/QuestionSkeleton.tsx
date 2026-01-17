import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';

export const QuestionSkeleton = () => {
    return (
        <View style={styles.container}>
            {/* Badge Skeleton */}
            <View style={styles.badge} />

            {/* Question Text Skeleton */}
            <View style={styles.questionLine1} />
            <View style={styles.questionLine2} />

            {/* Button Skeleton */}
            <View style={styles.button} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: THEME.borderRadius.lg,
        padding: THEME.spacing.lg,
        marginBottom: THEME.spacing.lg,
    },
    badge: {
        width: 120,
        height: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: THEME.borderRadius.full,
        marginBottom: THEME.spacing.md,
    },
    questionLine1: {
        width: '100%',
        height: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: THEME.borderRadius.sm,
        marginBottom: THEME.spacing.sm,
    },
    questionLine2: {
        width: '70%',
        height: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: THEME.borderRadius.sm,
        marginBottom: THEME.spacing.lg,
    },
    button: {
        width: '100%',
        height: 48,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: THEME.borderRadius.md,
    },
});
