import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Animated,
} from 'react-native';
import { GradientBackground } from '../../components/common';
import {
  ProfileStats,
  RelationshipInfo,
  ProfileMenu,
} from '../../components/profile';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { useCoupleStore } from '../../store/coupleStore';
import { useNavigation } from '@react-navigation/native';
import { differenceInDays } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuthStore();
  const { couple, partner, stats, fetchCoupleStats } = useCoupleStore();
  const [daysTogether, setDaysTogether] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchCoupleStats();
  }, []);

  useEffect(() => {
    if (couple?.startDate) {
      const start = new Date(couple.startDate);
      const now = new Date();
      setDaysTogether(differenceInDays(now, start));
    }
  }, [couple]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      "Are you sure you want to logout? You'll need to sign in again to access your space.",
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            // Navigation will automatically handle auth state change
          },
        },
      ],
    );
  };

  return (
    <GradientBackground variant="background" scrollY={scrollY}>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      >
        {/* Spacer for status bar/top padding since we removed header */}
        <View style={{ height: 60 }} />

        {/* Profile Header Section (Inlined) */}
        <View style={styles.headerContent}>
          {/* Avatars */}
          <View style={styles.avatarsContainer}>
            <View style={styles.avatarWrapper}>
              {/* User Avatar (Left / Front) */}
              <View style={[styles.avatarFrame, styles.userAvatar]}>
                <Image
                  source={
                    user?.photoUrl
                      ? { uri: user.photoUrl }
                      : require('../../assets/images/Logo-Male-2.png')
                  }
                  style={styles.avatarImage}
                />
              </View>

              {/* Partner Avatar (Right / Behind) */}
              <View style={[styles.avatarFrame, styles.partnerAvatar]}>
                <Image
                  source={
                    partner?.photoUrl
                      ? { uri: partner.photoUrl }
                      : require('../../assets/images/Logo-Female-2.png')
                  }
                  style={styles.avatarImage}
                />
              </View>

              {/* Heart badge removed as per request ("icon bich m remove kr de") */}
            </View>
          </View>

          {/* Names */}
          <View style={styles.namesContainer}>
            <Text style={styles.names}>
              {user?.name?.split(' ')[0] || 'Me'} &{' '}
              {partner?.name?.split(' ')[0] || 'Partner'}
            </Text>
            <View style={styles.tagContainer}>
              <Text style={styles.tag}>
                {couple?.coupleTag || '#Us'} on CloseUs
              </Text>
            </View>
          </View>
        </View>

        <ProfileStats
          daysTogether={daysTogether}
          questionsCount={stats?.questionsAnswered || 0}
          gamesWon={stats?.gamesWon || 0}
        />

        <RelationshipInfo
          status={
            user?.relationshipStatus
              ? {
                  dating: 'Dating',
                  engaged: 'Engaged',
                  married: 'Married',
                  other: 'Other',
                }[user.relationshipStatus] || 'Dating'
              : 'Dating'
          }
          style={
            user?.livingStyle
              ? {
                  long_distance: 'Long Distance',
                  same_city: 'Same City',
                  living_together: 'Living Together',
                }[user.livingStyle] || 'Same City'
              : 'Same City'
          }
          anniversary={
            user?.anniversary
              ? new Date(user.anniversary).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : couple?.startDate
                ? new Date(couple.startDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Select Date'
          }
        />

        <ProfileMenu />

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.9}
          >
            <Icon name="logout" size={20} color={COLORS.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom padding for scroll */}
        <View style={{ height: 40 }} />
      </Animated.ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 0,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  avatarsContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    // Total width logic:
    // 2 avatars of w-28 (112px).
    // -space-x-6 (approx -24px overlap).
    // Total visible width approx 112 + (112 - 24) = 200px.
    width: 200,
    height: 112,
  },
  avatarFrame: {
    width: 112, // w-28
    height: 112, // h-28
    borderRadius: 999,
    borderWidth: 4,
    borderColor: COLORS.zinc900, // border-[#18181B]
    backgroundColor: COLORS.zinc800,
    overflow: 'hidden',
    position: 'absolute',
    shadowColor: 'rgba(0,0,0,0.3)', // shadow-soft
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 40,
    shadowOpacity: 1,
    elevation: 8,
  },
  // User First (Left)
  userAvatar: {
    left: 0,
    zIndex: 10, // On top
  },
  // Partner Second (Right)
  partnerAvatar: {
    right: 0,
    zIndex: 0, // Behind
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  namesContainer: {
    alignItems: 'center',
    gap: 8,
  },
  names: {
    fontSize: 24, // text-2xl
    fontWeight: '800', // font-extrabold
    color: COLORS.white,
    lineHeight: 30,
    textAlign: 'center',
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tag: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.blue300,
    letterSpacing: 0.5,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    marginTop: 40,
    marginBottom: 48,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    backgroundColor: 'transparent',
  },
  logoutText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
