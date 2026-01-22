import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { GradientBackground, Button } from '../../components/common';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { getErrorMessage } from '../../utils/errorHandler';

// Custom Toast Config
const toastConfig = {
  error: (props: any) => (
    <View style={toastStyles.errorContainer}>
      <Text style={toastStyles.title}>{props.text1}</Text>
      {props.text2 && <Text style={toastStyles.message}>{props.text2}</Text>}
    </View>
  ),
};

export const WelcomeScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const login = useAuthStore(state => state.login);

  const handleGoogleSignIn = async () => {
    // Check if user agreed to terms
    if (!agreedToTerms) {
      Toast.show({
        type: 'error',
        text1: 'Terms Required',
        text2: 'Please agree to our Terms of Service and Privacy Policy',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      await login();

      // Get updated user after login
      const loggedInUser = useAuthStore.getState().user;

      // Navigate based on onboarding status
      if (!loggedInUser?.isOnboardingComplete) {
        // New user - go to onboarding
        navigation.replace('GenderSelection');
      } else if (!loggedInUser?.coupleId) {
        // Onboarded but not paired
        navigation.replace('CreateKey');
      } else {
        // Fully set up user - go to main app
        navigation.replace('MainTabs');
      }
    } catch (error: any) {
      setLoading(false);
      console.error('Google Sign-In Error:', error);
      Alert.alert('Sign-In Failed', getErrorMessage(error));
    }
  };

  return (
    <GradientBackground variant="background">
      <Toast config={toastConfig} />
      <View style={styles.container}>
        <View style={styles.content}>
          <Image
            source={require('../../assets/images/Logo-Main.png')}
            style={styles.logo}
            resizeMode="cover"
          />
          <Text style={styles.tagline}>Stay Close, Stay Connected</Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.googleButton,
              loading && styles.googleButtonDisabled,
            ]}
            onPress={handleGoogleSignIn}
            disabled={loading}
            activeOpacity={0.8}
          >
            {!loading ? (
              <>
                <Text style={styles.googleIcon}>G</Text>
                <Text style={styles.googleButtonText}>Sign in with Google</Text>
              </>
            ) : (
              <Text style={styles.googleButtonText}>Signing in...</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            activeOpacity={0.7}
          >
            <View
              style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}
            >
              {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>
              Agree to our <Text style={styles.link}>Terms of Service</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: THEME.spacing.xl,
  },
  content: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 500,
    height: 200,
    marginBottom: 0,
  },
  tagline: {
    fontSize: THEME.fontSizes.lg,
    fontWeight: THEME.fontWeights.semibold,
    color: COLORS.white,
    textAlign: 'center',
    marginTop: -50,
    marginBottom: THEME.spacing.sm,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.lg,
    gap: THEME.spacing.sm,
    height: 48,
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: THEME.fontWeights.bold,
    color: '#4285F4',
  },
  googleButtonText: {
    fontSize: THEME.fontSizes.md,
    fontWeight: THEME.fontWeights.semibold,
    color: '#1F1F1F',
  },
  footer: {
    gap: THEME.spacing.md,
    paddingBottom: THEME.spacing.xxl,
    marginTop: -150,
    marginBottom: 40,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
    paddingVertical: THEME.spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: THEME.fontWeights.bold,
  },
  checkboxText: {
    flex: 1,
    fontSize: THEME.fontSizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  link: {
    color: COLORS.primary,
    fontWeight: THEME.fontWeights.semibold,
    textDecorationLine: 'underline',
  },
});

const toastStyles = StyleSheet.create({
  errorContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.lg,
    borderRadius: 16,
    marginTop: THEME.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: THEME.fontSizes.lg,
    fontWeight: THEME.fontWeights.bold,
    color: COLORS.white,
    marginBottom: THEME.spacing.xs,
  },
  message: {
    fontSize: THEME.fontSizes.md,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
});
