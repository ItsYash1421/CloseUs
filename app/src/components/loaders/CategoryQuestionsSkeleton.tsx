import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ShimmerPlaceholder } from '../common';
import THEME from '../../constants/theme';

export const CategoryQuestionsSkeleton = () => {
  return (
    <View style={styles.container}>
      {/* Stats Card */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <ShimmerPlaceholder
            width={80}
            height={80}
            style={{ borderRadius: 40, marginBottom: 8 }}
          />
          <ShimmerPlaceholder width={60} height={12} />
        </View>

        <View style={styles.centerStat}>
          <ShimmerPlaceholder
            width={50}
            height={32}
            style={{ marginBottom: 4, borderRadius: 8 }}
          />
          <ShimmerPlaceholder width={80} height={10} />
        </View>

        <View style={styles.statItem}>
          <ShimmerPlaceholder
            width={80}
            height={80}
            style={{ borderRadius: 40, marginBottom: 8 }}
          />
          <ShimmerPlaceholder width={60} height={12} />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsCard}>
        <ShimmerPlaceholder
          width="100%"
          height={48}
          style={{ borderRadius: 30 }}
        />
      </View>

      {/* Question Cards */}
      {[1, 2, 3, 4].map(item => (
        <View key={item} style={styles.questionCard}>
          <ShimmerPlaceholder
            width="90%"
            height={20}
            style={{ marginBottom: 12 }}
          />
          <ShimmerPlaceholder
            width="70%"
            height={20}
            style={{ marginBottom: 16 }}
          />
          <ShimmerPlaceholder
            width={100}
            height={36}
            style={{ borderRadius: 12, alignSelf: 'flex-end' }}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: THEME.spacing.lg,
    paddingTop: 100,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  centerStat: {
    alignItems: 'center',
  },
  tabsCard: {
    marginBottom: 24,
  },
  questionCard: {
    minHeight: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
});
