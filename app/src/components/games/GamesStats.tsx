import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../common';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { GameCategory } from '../../services/gamesService';

interface GamesStatsProps {
    games: GameCategory[];
}

export const GamesStats = ({ games }: GamesStatsProps) => {
    const activeGamesCount = games.filter(c => c.isActive).length;
    const totalQuestions = games.reduce((sum, c) => sum + c.questionCount, 0);
    const totalPlays = games.reduce((sum, c) => sum + c.timesPlayed, 0);

    return (
        <Card variant="glass" padding="large" style={styles.statsCard}>
            <Text style={styles.statsTitle}>📊 Your Stats</Text>
            <View style={styles.statsRow}>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{activeGamesCount}</Text>
                    <Text style={styles.statLabel}>Games</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{totalQuestions}</Text>
                    <Text style={styles.statLabel}>Questions</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{totalPlays}</Text>
                    <Text style={styles.statLabel}>Total Plays</Text>
                </View>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    statsCard: {
        marginBottom: THEME.spacing.lg,
    },
    statsTitle: {
        fontSize: THEME.fontSizes.lg,
        fontWeight: THEME.fontWeights.semibold,
        color: COLORS.white,
        marginBottom: THEME.spacing.lg,
        textAlign: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    stat: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 32,
        fontWeight: THEME.fontWeights.bold,
        color: COLORS.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: THEME.fontSizes.xs,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: COLORS.border,
    },
});
