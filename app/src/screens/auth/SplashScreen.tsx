import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { GradientBackground } from '../../components/common';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { useCoupleStore } from '../../store/coupleStore';

export const SplashScreen = ({ navigation }: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const hasNavigated = useRef(false); // Guard to prevent double navigation

  const checkAuth = useAuthStore(state => state.checkAuth);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const isLoading = useAuthStore(state => state.isLoading);
  const fetchCoupleInfo = useCoupleStore(state => state.fetchCoupleInfo);

  useEffect(() => {
    // Animate logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
      }),
    ]).start();

    // Check authentication
    checkAuth();
  }, []);

  useEffect(() => {
    // Prevent multiple navigations
    if (!isLoading && !hasNavigated.current) {
      setTimeout(async () => {
        console.log('[SplashScreen] isAuthenticated:', isAuthenticated);
        console.log('[SplashScreen] user:', user);
        console.log(
          '[SplashScreen] isOnboardingComplete:',
          user?.isOnboardingComplete,
        );
        console.log('[SplashScreen] coupleId:', user?.coupleId);

        // Mark as navigated to prevent re-running
        hasNavigated.current = true;

        if (isAuthenticated && user) {
          if (!user.isOnboardingComplete) {
            console.log(
              '[SplashScreen] Navigating to GenderSelection (onboarding not complete)',
            );
            navigation.replace('GenderSelection');
          } else if (!user.coupleId) {
            console.log('[SplashScreen] Navigating to CreateKey (no couple)');
            navigation.replace('CreateKey');
          } else {
            // Fetch couple data before navigating to main tabs
            console.log('[SplashScreen] Fetching couple info');
            try {
              await fetchCoupleInfo();
            } catch (error) {
              console.error('Failed to fetch couple info:', error);
            }
            console.log('[SplashScreen] Navigating to MainTabs');
            navigation.replace('MainTabs');
          }
        } else {
          console.log(
            '[SplashScreen] Navigating to Welcome (not authenticated)',
          );
          navigation.replace('Welcome');
        }
      }, 1500);
    }
  }, [isLoading, isAuthenticated, user]);

  return (
    <GradientBackground variant="background">
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image
            source={require('../../assets/images/Logo-Main.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 300,
  },
});
