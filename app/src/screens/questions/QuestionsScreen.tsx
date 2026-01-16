import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { GradientBackground, Card, Header } from '../../components/common';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';

const CATEGORIES = [
    { id: '1', name: 'Getting to Know You', emoji: '👋', count: 50 },
    { id: '2', name: 'Deep Conversations', emoji: '💭', count: 45 },
    { id: '3', name: 'Fun & Playful', emoji: '🎉', count: 40 },
    { id: '4', name: 'Future Together', emoji: '🔮', count: 35 },
    { id: '5', name: 'Memories', emoji: '📸', count: 30 },
    { id: '6', name: 'Love & Romance', emoji: '💕', count: 42 },
];

export const QuestionsScreen = ({ navigation }: any) => {
    return (
        <GradientBackground variant="background">
            <Header title="Daily Questions" />
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.subtitle}>
                        Answer questions together and learn more about each other
                    </Text>
                </View>

                {/* Daily Question */}
                <Card variant="glass" padding="large" style={styles.dailyCard}>
                    <View style={styles.dailyBadge}>
                        <Text style={styles.dailyBadgeText}>Today's Question</Text>
                    </View>
                    <Text style={styles.dailyQuestion}>
                        What's one thing you've always wanted to try together?
                    </Text>
                    <TouchableOpacity style={styles.answerButton}>
                        <Text style={styles.answerButtonText}>Answer Now →</Text>
                    </TouchableOpacity>
                </Card>

                {/* Categories */}
                <Text style={styles.sectionTitle}>Browse Categories</Text>
                <View style={styles.categoriesGrid}>
                    {CATEGORIES.map(category => (
                        <TouchableOpacity key={category.id} activeOpacity={0.8}>
                            <Card variant="glass" padding="medium" style={styles.categoryCard}>
                                <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                                <Text style={styles.categoryName}>{category.name}</Text>
                                <Text style={styles.categoryCount}>{category.count} questions</Text>
                            </Card>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Stats */}
                <Card variant="glass" padding="medium" style={styles.statsCard}>
                    <View style={styles.statRow}>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>12</Text>
                            <Text style={styles.statLabel}>Answered</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>3</Text>
                            <Text style={styles.statLabel}>This Week</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>180</Text>
                            <Text style={styles.statLabel}>Available</Text>
                        </View>
                    </View>
                </Card>
            </ScrollView>
        </GradientBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: THEME.spacing.lg,
    },
    header: {
        marginTop: THEME.spacing.xl,
        marginBottom: THEME.spacing.xl,
    },
    title: {
        fontSize: THEME.fontSizes.xxxl,
        fontWeight: THEME.fontWeights.bold,
        color: COLORS.white,
        marginBottom: THEME.spacing.sm,
    },
    subtitle: {
        fontSize: THEME.fontSizes.md,
        color: COLORS.textSecondary,
        lineHeight: 22,
    },
    dailyCard: {
        marginBottom: THEME.spacing.xl,
    },
    dailyBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: THEME.spacing.md,
        paddingVertical: THEME.spacing.xs,
        borderRadius: THEME.borderRadius.full,
        alignSelf: 'flex-start',
        marginBottom: THEME.spacing.md,
    },
    dailyBadgeText: {
        fontSize: THEME.fontSizes.xs,
        fontWeight: THEME.fontWeights.semibold,
        color: COLORS.white,
    },
    dailyQuestion: {
        fontSize: THEME.fontSizes.lg,
        fontWeight: THEME.fontWeights.semibold,
        color: COLORS.white,
        lineHeight: 28,
        marginBottom: THEME.spacing.lg,
    },
    answerButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: THEME.spacing.md,
        borderRadius: THEME.borderRadius.md,
        alignItems: 'center',
    },
    answerButtonText: {
        fontSize: THEME.fontSizes.md,
        fontWeight: THEME.fontWeights.semibold,
        color: COLORS.white,
    },
    sectionTitle: {
        fontSize: THEME.fontSizes.lg,
        fontWeight: THEME.fontWeights.semibold,
        color: COLORS.white,
        marginBottom: THEME.spacing.md,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: THEME.spacing.md,
        marginBottom: THEME.spacing.xl,
    },
    categoryCard: {
        width: (THEME.SCREEN_WIDTH - THEME.spacing.lg * 2 - THEME.spacing.md) / 2,
        alignItems: 'center',
    },
    categoryEmoji: {
        fontSize: 40,
        marginBottom: THEME.spacing.sm,
    },
    categoryName: {
        fontSize: THEME.fontSizes.sm,
        fontWeight: THEME.fontWeights.semibold,
        color: COLORS.white,
        textAlign: 'center',
        marginBottom: THEME.spacing.xs,
    },
    categoryCount: {
        fontSize: THEME.fontSizes.xs,
        color: COLORS.textSecondary,
    },
    statsCard: {
        marginBottom: THEME.spacing.xl,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: THEME.fontSizes.xxl,
        fontWeight: THEME.fontWeights.bold,
        color: COLORS.primary,
        marginBottom: THEME.spacing.xs,
    },
    statLabel: {
        fontSize: THEME.fontSizes.xs,
        color: COLORS.textSecondary,
    },
    statDivider: {
        width: 1,
        backgroundColor: COLORS.border,
    },
});
