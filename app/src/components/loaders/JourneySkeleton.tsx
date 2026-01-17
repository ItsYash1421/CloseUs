import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ShimmerPlaceholder } from '../common';
import THEME from '../../constants/theme';

export const JourneySkeleton = () => {
    return (
        <View style={styles.container}>
            {/* Header Skeleton */}
            <View style={styles.header}>
                <ShimmerPlaceholder width={120} height={24} borderRadius={4} />
                <ShimmerPlaceholder width={80} height={16} borderRadius={4} />
            </View>

            {/* Card Skeleton */}
            <View style={styles.card}>
                <View style={styles.cardContent}>
                    {/* Milestone Row */}
                    <View style={styles.milestoneRow}>
                        <View style={styles.milestoneInfo}>
                            <ShimmerPlaceholder width={100} height={12} style={{ marginBottom: 4 }} />
                            <ShimmerPlaceholder width={80} height={32} />
                        </View>
                        <ShimmerPlaceholder width={60} height={24} borderRadius={20} />
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressBarContainer}>
                        <ShimmerPlaceholder width="100%" height={16} borderRadius={999} />
                    </View>

                    {/* Quote */}
                    <View style={styles.quoteContainer}>
                        <ShimmerPlaceholder width="100%" height={14} style={{ marginBottom: 4 }} />
                        <ShimmerPlaceholder width="80%" height={14} />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: THEME.spacing.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        padding: THEME.spacing.lg,
        overflow: 'hidden',
    },
    cardContent: {
        gap: THEME.spacing.md,
    },
    milestoneRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    milestoneInfo: {
        gap: 4,
    },
    progressBarContainer: {
        width: '100%',
        marginVertical: 8,
    },
    quoteContainer: {
        marginTop: 4,
    }
});
