import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';

interface OurJourneyProps {
  currentDays: number;
  nextMilestone: number;
  progress: number;
  onViewHistory?: () => void;
}

export const OurJourney: React.FC<OurJourneyProps> = ({
  currentDays,
  nextMilestone,
  progress,
  onViewHistory,
}) => {
  return (
    <View style={styles.card}>
      {/* Header - Moved inside to match ChatSection style */}
      <View style={styles.header}>
        <Text style={styles.title}>Our Journey</Text>
        <TouchableOpacity onPress={onViewHistory} activeOpacity={0.7}>
          <Text style={styles.viewHistory}>View History</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardContent}>
        {/* Milestone Info */}
        <View style={styles.milestoneRow}>
          <View style={styles.milestoneInfo}>
            <Text style={styles.milestoneLabel}>NEXT MILESTONE</Text>
            <Text style={styles.milestoneValue}>{nextMilestone} Days</Text>
          </View>
          <View style={styles.progressBadge}>
            <Text style={styles.progressBadgeText}>{currentDays} Days</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            {/* Progress fill */}
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />

            {/* Diagonal pattern overlay */}
            <View style={styles.progressBarPattern} />
          </View>
        </View>

        {/* Quote */}
        <Text style={styles.quote}>
          "Love is not about how many days, months, or years you have been
          together. Love is about how much you love each other every single
          day."
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20, // Matched with ChatSection
    overflow: 'hidden',
    gap: THEME.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: THEME.fontSizes.lg,
    fontWeight: THEME.fontWeights.bold,
    color: COLORS.textPrimary,
  },
  viewHistory: {
    fontSize: THEME.fontSizes.sm,
    fontWeight: THEME.fontWeights.bold,
    color: COLORS.primary,
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
    gap: THEME.spacing.xs / 2, // 2px
  },
  milestoneLabel: {
    fontSize: THEME.fontSizes.xs,
    fontWeight: THEME.fontWeights.semibold,
    color: COLORS.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  milestoneValue: {
    fontSize: 24,
    fontWeight: THEME.fontWeights.extrabold,
    color: COLORS.textPrimary,
  },
  progressBadge: {
    backgroundColor: 'rgba(178, 223, 252, 0.1)',
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs / 2,
    borderRadius: 999,
  },
  progressBadgeText: {
    fontSize: THEME.fontSizes.xs,
    fontWeight: THEME.fontWeights.bold,
    color: '#B2DFFC', // secondary-blue
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBarBackground: {
    height: 16,
    backgroundColor: '#334155', // slate-700
    borderRadius: 999,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBarFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#B2DFFC', // secondary-blue
    borderRadius: 999,
  },
  progressBarPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.3,
    // Diagonal stripes will be added via additional view or SVG if needed
  },
  quote: {
    fontSize: THEME.fontSizes.sm,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    lineHeight: 20,
    textAlign: 'center',
  },
});
