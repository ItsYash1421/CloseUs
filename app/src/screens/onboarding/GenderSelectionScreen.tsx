import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { GradientBackground } from '../../components/common';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { useOnboardingStore } from '../../store/onboardingStore';

export const GenderSelectionScreen = ({ navigation }: any) => {
  const [selectedGender, setSelectedGenderLocal] = useState<
    'male' | 'female' | null
  >(null);
  const setGender = useOnboardingStore(state => state.setGender);

  const handleContinue = () => {
    if (!selectedGender) return;

    // Save to onboarding store (instant, no API call)
    setGender(selectedGender);

    // Navigate instantly
    navigation.navigate('PersonalInfo');
  };

  return (
    <GradientBackground variant="background">
      <View style={styles.container}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '20%' }]} />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>How do you identify?</Text>
          <Text style={styles.subtitle}>
            A little detail to make CloseUs feel more you
          </Text>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => setSelectedGenderLocal('female')}
              activeOpacity={0.8}
            >
              <Image
                source={require('../../assets/images/Logo-Female.png')}
                style={[
                  styles.genderIcon,
                  selectedGender === 'female' && styles.genderIconSelected,
                ]}
                resizeMode="cover"
              />
              <Text style={styles.optionLabel}>Woman</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => setSelectedGenderLocal('male')}
              activeOpacity={0.8}
            >
              <Image
                source={require('../../assets/images/Logo-Male.png')}
                style={[
                  styles.genderIcon,
                  selectedGender === 'male' && styles.genderIconSelected,
                ]}
                resizeMode="cover"
              />
              <Text style={styles.optionLabel}>Man</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              !selectedGender && styles.nextButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selectedGender}
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
    marginBottom: THEME.spacing.xl,
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
  content: {
    flex: 1,
    paddingTop: THEME.spacing.xxl,
  },
  title: {
    fontSize: THEME.fontSizes.xxxl,
    fontWeight: THEME.fontWeights.bold,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: THEME.spacing.md,
  },
  subtitle: {
    fontSize: THEME.fontSizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: THEME.spacing.xxl,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: THEME.spacing.xl,
    marginTop: THEME.spacing.xxl,
  },
  optionCard: {
    alignItems: 'center',
    padding: THEME.spacing.md,
  },
  optionCardSelected: {
    transform: [{ scale: 1.05 }],
  },
  genderIcon: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: THEME.spacing.md,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  genderIconSelected: {
    borderColor: COLORS.white,
    borderWidth: 4,
  },
  optionLabel: {
    fontSize: THEME.fontSizes.lg,
    fontWeight: THEME.fontWeights.semibold,
    color: COLORS.white,
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
