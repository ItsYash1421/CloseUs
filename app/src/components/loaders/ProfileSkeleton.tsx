import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ShimmerPlaceholder } from '../common';
import THEME from '../../constants/theme';
import { COLORS } from '../../constants/colors';

export const ProfileSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Header / Avatars */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <ShimmerPlaceholder
            width={112}
            height={112}
            style={{
              borderRadius: 56,
              position: 'absolute',
              left: 0,
              zIndex: 10,
            }}
          />
          <ShimmerPlaceholder
            width={112}
            height={112}
            style={{
              borderRadius: 56,
              position: 'absolute',
              right: 0,
              zIndex: 0,
            }}
          />
        </View>
        <ShimmerPlaceholder
          width={180}
          height={30}
          style={{ borderRadius: 8, marginTop: 24, marginBottom: 8 }}
        />
        <ShimmerPlaceholder
          width={100}
          height={24}
          style={{ borderRadius: 12 }}
        />
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        {[1, 2, 3].map((_, index) => (
          <View key={index} style={styles.statItem}>
            <ShimmerPlaceholder
              width={40}
              height={30}
              style={{ borderRadius: 4, marginBottom: 4 }}
            />
            <ShimmerPlaceholder
              width={60}
              height={12}
              style={{ borderRadius: 4 }}
            />
          </View>
        ))}
      </View>

      {/* Info Cards */}
      <View style={styles.infoContainer}>
        {[1, 2].map((_, index) => (
          <View key={index} style={styles.infoCard}>
            <ShimmerPlaceholder
              width={32}
              height={32}
              style={{ borderRadius: 16, marginBottom: 8 }}
            />
            <ShimmerPlaceholder
              width={80}
              height={16}
              style={{ borderRadius: 4, marginBottom: 4 }}
            />
            <ShimmerPlaceholder
              width={100}
              height={12}
              style={{ borderRadius: 4 }}
            />
          </View>
        ))}
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {[1, 2, 3, 4].map((_, index) => (
          <View key={index} style={styles.menuItem}>
            <ShimmerPlaceholder
              width={24}
              height={24}
              style={{ borderRadius: 12, marginRight: 16 }}
            />
            <ShimmerPlaceholder
              width={120}
              height={16}
              style={{ borderRadius: 4 }}
            />
            <ShimmerPlaceholder
              width={16}
              height={16}
              style={{ borderRadius: 8, marginLeft: 'auto' }}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: THEME.spacing.xl,
    paddingTop: 80,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    width: 200,
    height: 112,
    position: 'relative',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  infoCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
});
