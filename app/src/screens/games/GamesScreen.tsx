import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { GradientBackground, Card } from '../../components/common';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import gamesService, { GameCategory } from '../../services/gamesService';

export const GamesScreen = ({ navigation }: any) => {
  const [categories, setCategories] = useState<GameCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGameCategories();
  }, []);

  const fetchGameCategories = async () => {
    try {
      setIsLoading(true);
      const data = await gamesService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load game categories:', error);
      Alert.alert('Error', 'Failed to load games. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGamePress = (category: GameCategory) => {
    if (!category.isActive) return;

    navigation.navigate('CategoryQuestions', {
      categoryId: category._id,
      categoryName: category.name,
      categoryEmoji: category.emoji,
      categoryColor: category.color,
    });
  };

  if (isLoading) {
    return (
      <GradientBackground variant="background">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading games...</Text>
        </View>
      </GradientBackground>
    );
  }

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
          {categories.map(category => (
            <TouchableOpacity
              key={category._id}
              activeOpacity={0.8}
              disabled={!category.isActive}
              onPress={() => handleGamePress(category)}
            >
              <Card
                variant="glass"
                padding="large"
                style={[
                  styles.gameCard,
                  !category.isActive && styles.gameCardDisabled,
                ]}
              >
                <Text style={styles.gameEmoji}>{category.emoji}</Text>
                <Text style={styles.gameName}>{category.name}</Text>
                <Text style={styles.gameDescription}>
                  {category.questionCount} questions available
                </Text>
                {!category.isActive && (
                  <View style={styles.comingSoonBadge}>
                    <Text style={styles.comingSoonText}>Coming Soon</Text>
                  </View>
                )}
                {category.isActive && (
                  <View style={styles.playButton}>
                    <Text style={styles.playButtonText}>Play Now →</Text>
                  </View>
                )}

                {/* Times Played Badge */}
                {category.timesPlayed > 0 && (
                  <View style={styles.playedBadge}>
                    <Text style={styles.playedText}>
                      Played {category.timesPlayed}x
                    </Text>
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats - Can be enhanced with real stats later */}
        <Card variant="glass" padding="large" style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Game Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {categories.filter(c => c.isActive).length}
              </Text>
              <Text style={styles.statLabel}>Games Available</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {categories.reduce((sum, c) => sum + c.questionCount, 0)}
              </Text>
              <Text style={styles.statLabel}>Total Questions</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    marginTop: THEME.spacing.md,
    fontSize: THEME.fontSizes.md,
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
    position: 'relative',
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
  playedBadge: {
    position: 'absolute',
    top: THEME.spacing.sm,
    right: THEME.spacing.sm,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.sm,
  },
  playedText: {
    fontSize: THEME.fontSizes.xs,
    color: COLORS.white,
    fontWeight: THEME.fontWeights.medium,
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
