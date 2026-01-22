import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { GradientBackground, Card } from '../../components/common';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';

const GAMES = [
  {
    id: '1',
    name: 'Never Have I Ever',
    emoji: '🙈',
    description: 'Discover new things about each other',
    isActive: true,
  },
  {
    id: '2',
    name: 'Would You Rather',
    emoji: '🤔',
    description: 'Make tough choices together',
    isActive: false,
  },
  {
    id: '3',
    name: 'Who Knows Better',
    emoji: '🎯',
    description: 'Test how well you know each other',
    isActive: false,
  },
  {
    id: '4',
    name: 'Truth or Dare',
    emoji: '💋',
    description: 'Spice things up',
    isActive: false,
  },
];

export const GamesScreen = ({ navigation }: any) => {
  return (
    <GradientBackground variant="background">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Couple Games</Text>
          <Text style={styles.subtitle}>
            Have fun and bond through interactive games
          </Text>
        </View>

        {/* Games Grid */}
        <View style={styles.gamesGrid}>
          {GAMES.map(game => (
            <TouchableOpacity
              key={game.id}
              activeOpacity={0.8}
              disabled={!game.isActive}
            >
              <Card
                variant="glass"
                padding="large"
                style={[
                  styles.gameCard,
                  !game.isActive && styles.gameCardDisabled,
                ]}
              >
                <Text style={styles.gameEmoji}>{game.emoji}</Text>
                <Text style={styles.gameName}>{game.name}</Text>
                <Text style={styles.gameDescription}>{game.description}</Text>
                {!game.isActive && (
                  <View style={styles.comingSoonBadge}>
                    <Text style={styles.comingSoonText}>Coming Soon</Text>
                  </View>
                )}
                {game.isActive && (
                  <View style={styles.playButton}>
                    <Text style={styles.playButtonText}>Play Now →</Text>
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats */}
        <Card variant="glass" padding="large" style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Game Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Games Played</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>42</Text>
              <Text style={styles.statLabel}>Questions Answered</Text>
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
  gamesGrid: {
    gap: THEME.spacing.lg,
    marginBottom: THEME.spacing.xl,
  },
  gameCard: {
    alignItems: 'center',
  },
  gameCardDisabled: {
    opacity: 0.6,
  },
  gameEmoji: {
    fontSize: 64,
    marginBottom: THEME.spacing.md,
  },
  gameName: {
    fontSize: THEME.fontSizes.xl,
    fontWeight: THEME.fontWeights.bold,
    color: COLORS.white,
    marginBottom: THEME.spacing.xs,
  },
  gameDescription: {
    fontSize: THEME.fontSizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: THEME.spacing.md,
  },
  comingSoonBadge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.full,
  },
  comingSoonText: {
    fontSize: THEME.fontSizes.xs,
    fontWeight: THEME.fontWeights.semibold,
    color: COLORS.white,
  },
  playButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
  },
  playButtonText: {
    fontSize: THEME.fontSizes.md,
    fontWeight: THEME.fontWeights.semibold,
    color: COLORS.white,
  },
  statsCard: {
    marginBottom: THEME.spacing.xl,
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
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: THEME.fontSizes.xxxl,
    fontWeight: THEME.fontWeights.bold,
    color: COLORS.primary,
    marginBottom: THEME.spacing.xs,
  },
  statLabel: {
    fontSize: THEME.fontSizes.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
});
