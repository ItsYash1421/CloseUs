import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GradientBackground } from '../../components/common';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { useOnboardingStore } from '../../store/onboardingStore';

const STATUSES = [
  { value: 'dating', label: 'In Relationship' },
  { value: 'engaged', label: 'Just Talking' },
  { value: 'married', label: 'Married' },
];

export const RelationshipStatusScreen = ({ navigation }: any) => {
  const relationshipStatus = useOnboardingStore(
    state => state.relationshipStatus,
  );
  const setRelationshipStatus = useOnboardingStore(
    state => state.setRelationshipStatus,
  );

  const [selected, setSelected] = useState(relationshipStatus || '');

  const handleContinue = () => {
    if (!selected) return;

    // Save to onboarding store (instant, no API call)
    setRelationshipStatus(selected);

    // Navigate instantly
    navigation.navigate('LivingStyle');
  };

  return (
    <GradientBackground variant="background">
      <View style={styles.container}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '60%' }]} />
          </View>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Relationship Status</Text>
          <Text style={styles.subtitle}>What's your current status?</Text>
        </View>

        <View style={styles.content}>
          {STATUSES.map(status => (
            <TouchableOpacity
              key={status.value}
              onPress={() => setSelected(status.value)}
              style={[
                styles.card,
                selected === status.value && styles.cardSelected,
              ]}
              activeOpacity={0.8}
            >
              {/* Circle Indicator */}
              <View style={styles.circleContainer}>
                <View
                  style={[
                    styles.circle,
                    selected === status.value && styles.circleFilled,
                  ]}
                >
                  {selected === status.value && (
                    <View style={styles.innerCircle} />
                  )}
                </View>
              </View>
              <Text style={styles.label}>{status.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.nextButton, !selected && styles.nextButtonDisabled]}
            onPress={handleContinue}
            disabled={!selected}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: THEME.spacing.xl,
  },
  progressContainer: {
    marginTop: THEME.spacing.md,
    marginBottom: THEME.spacing.lg,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 2,
  },
  header: {
    marginBottom: THEME.spacing.xl,
  },
  title: {
    fontSize: THEME.fontSizes.xxxl,
    fontWeight: THEME.fontWeights.bold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: THEME.spacing.sm,
  },
  subtitle: {
    fontSize: THEME.fontSizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    gap: THEME.spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: THEME.spacing.lg,
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(255, 182, 193, 0.1)',
  },
  circleContainer: {
    marginRight: THEME.spacing.xs,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.white,
  },
  label: {
    fontSize: THEME.fontSizes.lg,
    fontWeight: THEME.fontWeights.semibold,
    color: COLORS.white,
    flex: 1,
  },
  footer: {
    paddingBottom: THEME.spacing.lg,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.lg,
    height: 48,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: THEME.fontSizes.md,
    fontWeight: THEME.fontWeights.semibold,
    color: '#1F1F1F',
  },
});
