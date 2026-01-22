import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Animated,
  Image,
} from 'react-native';
import { TouchableOpacity } from 'react-native';
import { GradientBackground, Spinner } from '../../components/common';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useAuthStore } from '../../store/authStore';
import Toast from 'react-native-toast-message';
import apiClient from '../../services/apiClient';
import { getErrorMessage } from '../../utils/errorHandler';

export const AnniversaryScreen = ({ navigation }: any) => {
  const getAllData = useOnboardingStore(state => state.getAllData);
  const resetOnboarding = useOnboardingStore(state => state.reset);
  const setUser = useAuthStore(state => state.setUser);
  const updateUser = useAuthStore(state => state.updateUser);

  // Load existing data from store
  const storeData = getAllData();
  const [partnerName, setPartnerName] = useState(storeData.partnerName || '');

  // Parse anniversary date if exists
  const existingAnniversary = storeData.anniversary
    ? new Date(storeData.anniversary)
    : null;
  const [day, setDay] = useState(
    existingAnniversary
      ? existingAnniversary.getDate().toString().padStart(2, '0')
      : '',
  );
  const [month, setMonth] = useState(
    existingAnniversary
      ? (existingAnniversary.getMonth() + 1).toString().padStart(2, '0')
      : '',
  );
  const [year, setYear] = useState(
    existingAnniversary ? existingAnniversary.getFullYear().toString() : '',
  );

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState<'name' | 'date' | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  // Animated values for smooth transitions
  const logoOpacity = useRef(new Animated.Value(1)).current;
  const nameOpacity = useRef(new Animated.Value(1)).current;
  const dateOpacity = useRef(new Animated.Value(1)).current;
  const nameTranslateY = useRef(new Animated.Value(0)).current;
  const dateTranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
        setFocusedInput(null);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  // Animate logo based on keyboard state
  useEffect(() => {
    const duration = 250;
    if (isKeyboardVisible) {
      Animated.timing(logoOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }).start();
    }
  }, [isKeyboardVisible]);

  // Animate inputs based on focus state - runs immediately on focus change
  useEffect(() => {
    const duration = 250;

    if (focusedInput === 'name') {
      // Show name input and move it up
      Animated.parallel([
        Animated.timing(nameOpacity, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(nameTranslateY, {
          toValue: -50,
          duration,
          useNativeDriver: true,
        }),
        // Hide date input
        Animated.timing(dateOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(dateTranslateY, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (focusedInput === 'date') {
      // Hide name input
      Animated.parallel([
        Animated.timing(nameOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(nameTranslateY, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
        // Show date input and move it up
        Animated.timing(dateOpacity, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(dateTranslateY, {
          toValue: -130,
          duration,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // No input focused - reset all to visible
      Animated.parallel([
        Animated.timing(nameOpacity, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(nameTranslateY, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(dateOpacity, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(dateTranslateY, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focusedInput]);

  const handleDayChange = (text: string) => {
    if (text.length <= 2 && /^\d*$/.test(text)) {
      setDay(text);
    }
  };

  const handleMonthChange = (text: string) => {
    if (text.length <= 2 && /^\d*$/.test(text)) {
      setMonth(text);
    }
  };

  const handleYearChange = (text: string) => {
    if (text.length <= 4 && /^\d*$/.test(text)) {
      setYear(text);
    }
  };

  const handleContinue = async () => {
    // Validate inputs
    if (!day || !month || !year || !partnerName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill in all fields',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    const dayNum = parseInt(day);
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (
      dayNum < 1 ||
      dayNum > 31 ||
      monthNum < 1 ||
      monthNum > 12 ||
      yearNum < 1900
    ) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Date',
        text2: 'Please enter a valid anniversary date',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    const anniversary = new Date(yearNum, monthNum - 1, dayNum, 12, 0, 0);

    try {
      setLoading(true);

      // Get all onboarding data
      const onboardingData = getAllData();

      console.log('[AnniversaryScreen] Starting onboarding completion');
      console.log('[AnniversaryScreen] Onboarding data:', onboardingData);

      // Prepare complete onboarding payload
      const payload = {
        gender: onboardingData.gender,
        name: onboardingData.name,
        photoUrl: onboardingData.photoUrl,
        dob: onboardingData.dob,
        relationshipStatus: onboardingData.relationshipStatus,
        livingStyle: onboardingData.livingStyle,
        anniversary,
        partnerName: partnerName.trim(),
      };

      console.log('[AnniversaryScreen] Payload:', payload);

      // Send single API call with all onboarding data
      console.log(
        '[AnniversaryScreen] Calling API: /api/users/complete-onboarding',
      );
      const response: any = await apiClient.post(
        '/api/users/complete-onboarding',
        payload,
      );

      console.log('[AnniversaryScreen] API Response:', response);
      console.log('[AnniversaryScreen] Response data:', response.data);
      console.log('[AnniversaryScreen] Response user:', response.data?.user);

      // Update user in auth store with response data
      if (response.data && response.data.user) {
        console.log(
          '[AnniversaryScreen] Updating user with API response:',
          response.data.user,
        );
        console.log(
          '[AnniversaryScreen] isOnboardingComplete in response:',
          response.data.user.isOnboardingComplete,
        );
        setUser(response.data.user);

        // Verify state was updated
        setTimeout(() => {
          const currentUser = useAuthStore.getState().user;
          console.log('[AnniversaryScreen] User after setUser:', currentUser);
          console.log(
            '[AnniversaryScreen] isOnboardingComplete after update:',
            currentUser?.isOnboardingComplete,
          );
        }, 100);
      } else {
        // Fallback: manually set onboarding complete
        console.log('[AnniversaryScreen] No user in response, using fallback');
        const currentUser = useAuthStore.getState().user;
        console.log(
          '[AnniversaryScreen] Current user before fallback:',
          currentUser,
        );
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            isOnboardingComplete: true,
          };
          console.log(
            '[AnniversaryScreen] Setting user with fallback:',
            updatedUser,
          );
          setUser(updatedUser as any);
        }
      }

      // Clear onboarding store
      resetOnboarding();

      Toast.show({
        type: 'success',
        text1: 'Setup Complete',
        text2: 'Your profile is ready!',
        position: 'top',
        visibilityTime: 2000,
      });

      // Wait for state to persist
      console.log('[AnniversaryScreen] Waiting for state to persist...');
      await new Promise<void>(resolve => setTimeout(resolve, 1000));

      // Verify final state before navigation
      const finalUser = useAuthStore.getState().user;
      console.log(
        '[AnniversaryScreen] Final user state before navigation:',
        finalUser,
      );
      console.log(
        '[AnniversaryScreen] Final isOnboardingComplete:',
        finalUser?.isOnboardingComplete,
      );

      // Navigate to CreateKey screen
      console.log('[AnniversaryScreen] Navigating to CreateKey');
      navigation.reset({
        index: 0,
        routes: [{ name: 'CreateKey' }],
      });
    } catch (error: any) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Setup Failed',
        text2: getErrorMessage(error),
        position: 'top',
        visibilityTime: 3000,
      });
    }
  };

  return (
    <GradientBackground variant="background">
      <Toast />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
        </View>

        {/* Header - Fixed */}
        <View style={styles.header}>
          <Text style={styles.title}>Special Dates</Text>
          <Text style={styles.subtitle}>When did your journey begin?</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Logo - Hides when keyboard opens */}
          <Animated.View
            style={[styles.logoContainer, { opacity: logoOpacity }]}
          >
            <Image
              source={require('../../assets/images/Logo-HandInHand.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Partner Name - First */}
          <Animated.View
            style={[
              styles.inputContainer,
              {
                opacity: nameOpacity,
                transform: [{ translateY: nameTranslateY }],
              },
            ]}
            pointerEvents={
              isKeyboardVisible && focusedInput !== 'name' ? 'none' : 'auto'
            }
          >
            <Text style={styles.inputLabel}>Partner's Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your partner's name"
              placeholderTextColor={COLORS.textMuted}
              value={partnerName}
              onChangeText={setPartnerName}
              autoCapitalize="words"
              onFocus={() => setFocusedInput('name')}
              onBlur={() => setFocusedInput(null)}
            />
          </Animated.View>

          {/* Anniversary Date - Second */}
          <Animated.View
            style={[
              styles.inputContainer,
              {
                opacity: dateOpacity,
                transform: [{ translateY: dateTranslateY }],
              },
            ]}
            pointerEvents={
              isKeyboardVisible && focusedInput !== 'date' ? 'none' : 'auto'
            }
          >
            <Text style={styles.inputLabel}>Anniversary Date</Text>
            <View style={styles.dateInputContainer}>
              <View style={styles.dateBox}>
                <TextInput
                  style={styles.dateInput}
                  placeholder="DD"
                  placeholderTextColor={COLORS.textMuted}
                  value={day}
                  onChangeText={handleDayChange}
                  keyboardType="numeric"
                  maxLength={2}
                  onFocus={() => setFocusedInput('date')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              <View style={styles.dateBox}>
                <TextInput
                  style={styles.dateInput}
                  placeholder="MM"
                  placeholderTextColor={COLORS.textMuted}
                  value={month}
                  onChangeText={handleMonthChange}
                  keyboardType="numeric"
                  maxLength={2}
                  onFocus={() => setFocusedInput('date')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              <View style={styles.dateBoxYear}>
                <TextInput
                  style={styles.dateInput}
                  placeholder="YYYY"
                  placeholderTextColor={COLORS.textMuted}
                  value={year}
                  onChangeText={handleYearChange}
                  keyboardType="numeric"
                  maxLength={4}
                  onFocus={() => setFocusedInput('date')}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>
          </Animated.View>

          {!isKeyboardVisible && (
            <Text style={styles.note}>
              💡 You'll pair with your partner in the next step
            </Text>
          )}
        </View>

        {/* Footer - Hidden immediately when any input focused */}
        {!focusedInput && !isKeyboardVisible && (
          <View style={styles.footer}>
            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.nextButton,
                (!day || !month || !year || !partnerName || loading) &&
                  styles.nextButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={!day || !month || !year || !partnerName || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <Spinner size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.nextButtonText}>Complete Setup</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
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
  },
  logoContainer: {
    alignSelf: 'center',
    marginBottom: THEME.spacing.xxl,
  },
  logo: {
    width: 150,
    height: 150,
  },
  inputContainer: {
    marginBottom: THEME.spacing.lg,
  },
  inputLabel: {
    fontSize: THEME.fontSizes.md,
    fontWeight: THEME.fontWeights.semibold,
    color: COLORS.white,
    marginBottom: THEME.spacing.sm,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: THEME.spacing.md,
    fontSize: THEME.fontSizes.md,
    color: COLORS.white,
  },
  dateInputContainer: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
  },
  dateBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: THEME.spacing.md,
  },
  dateBoxYear: {
    flex: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: THEME.spacing.md,
  },
  dateInput: {
    fontSize: THEME.fontSizes.md,
    color: COLORS.white,
    textAlign: 'center',
  },
  note: {
    fontSize: THEME.fontSizes.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: THEME.spacing.lg,
    lineHeight: 20,
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
