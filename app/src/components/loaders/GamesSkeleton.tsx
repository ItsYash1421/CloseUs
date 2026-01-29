
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ShimmerPlaceholder } from '../common';
import THEME from '../../constants/theme';
import { COLORS } from '../../constants/colors';

const { spacing } = THEME;

export const GamesSkeleton = () => {
    return (
        <View style={styles.container}>
            {/* Header Area */}
            <View style={styles.header}>
                <ShimmerPlaceholder width={120} height={24} style={styles.title} />
                <ShimmerPlaceholder width={100} height={36} style={{ borderRadius: 20 }} />
            </View>

            {/* Daily Question Card Mimic */}
            <View style={styles.dailyQuestionCard}>
                <View style={styles.dailyHeader}>
                    <ShimmerPlaceholder width={100} height={20} />
                    <ShimmerPlaceholder width={60} height={20} />
                </View>
                <ShimmerPlaceholder width="90%" height={24} style={{ marginTop: 12, marginBottom: 8 }} />
                <ShimmerPlaceholder width="60%" height={24} />
            </View>

            {/* Trending Section */}
            <View style={styles.sectionHeader}>
                <ShimmerPlaceholder width={140} height={24} />
                <ShimmerPlaceholder width={60} height={16} />
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.trendingScroll}
            >
                {[1, 2, 3].map((item) => (
                    <View key={item} style={styles.trendingCard}>
                        <ShimmerPlaceholder style={styles.trendingImage} />
                        <ShimmerPlaceholder width={100} height={16} style={{ marginTop: 12 }} />
                        <ShimmerPlaceholder width={80} height={12} style={{ marginTop: 6 }} />
                    </View>
                ))}
            </ScrollView>

            {/* Categories Grid */}
            <View style={[styles.sectionHeader, { marginTop: spacing.xl }]}>
                <ShimmerPlaceholder width={100} height={24} />
            </View>

            <View style={styles.grid}>
                {[1, 2, 3, 4].map((item) => (
                    <View key={item} style={styles.gridItem}>
                        <ShimmerPlaceholder width={40} height={40} style={{ borderRadius: 20, marginBottom: 12 }} />
                        <ShimmerPlaceholder width={80} height={16} />
                        <ShimmerPlaceholder width={60} height={12} style={{ marginTop: 6 }} />
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    title: {
        borderRadius: 8,
    },
    dailyQuestionCard: {
        padding: spacing.lg,
        borderRadius: THEME.borderRadius.lg,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: spacing.xl,
    },
    dailyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    trendingScroll: {
        marginHorizontal: -spacing.lg,
        paddingHorizontal: spacing.lg,
    },
    trendingCard: {
        width: 180,
        height: 220,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        marginRight: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    trendingImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    gridItem: {
        width: (THEME.SCREEN_WIDTH - spacing.lg * 2 - spacing.md) / 2,
        aspectRatio: 1,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
