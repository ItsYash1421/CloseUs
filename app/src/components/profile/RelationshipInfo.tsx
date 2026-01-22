import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';

interface RelationshipInfoProps {
  status: string;
  style: string;
  anniversary: string;
}

export const RelationshipInfo: React.FC<RelationshipInfoProps> = ({
  status,
  style,
  anniversary,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>RELATIONSHIP INFO</Text>

      <View style={styles.grid}>
        {/* Status */}
        <View style={styles.glassPanel}>
          <Icon
            name="verified-user"
            size={24}
            color={COLORS.blue400}
            style={styles.icon}
          />
          <Text style={styles.label}>STATUS</Text>
          <Text style={styles.value}>{status}</Text>
        </View>

        {/* Style */}
        <View style={styles.glassPanel}>
          <Icon
            name="near-me"
            size={24}
            color={COLORS.blue400}
            style={styles.icon}
          />
          <Text style={styles.label}>STYLE</Text>
          <Text style={styles.value}>{style}</Text>
        </View>

        {/* Anniversary */}
        <View style={styles.glassPanel}>
          <Icon
            name="cake"
            size={24}
            color={COLORS.blue400}
            style={styles.icon}
          />
          <Text style={styles.label}>ANNIVERSARY</Text>
          <Text style={styles.value}>{anniversary}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20, // px-5
    marginTop: 32, // mt-8 (32px)
  },
  sectionTitle: {
    fontSize: 12, // text-xs
    fontWeight: '700', // font-bold
    color: COLORS.profileSectionTitle, // White section title
    marginBottom: 12, // mb-3
    paddingLeft: 8, // pl-2
    letterSpacing: 2, // tracking-widest
    textTransform: 'uppercase', // uppercase
  },
  grid: {
    flexDirection: 'row',
    gap: 12, // gap-3
  },
  glassPanel: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)', // Match ChatSection
    borderRadius: 8, // rounded-lg
    padding: 12, // p-3
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)', // Match ChatSection
    gap: 4, // gap-1
  },
  icon: {
    marginBottom: 4,
  },
  label: {
    fontSize: 10, // text-[10px]
    fontWeight: '700', // font-bold
    color: COLORS.zinc400, // text-text-muted
    textTransform: 'uppercase', // uppercase
  },
  value: {
    fontSize: 12, // text-xs
    fontWeight: '600', // font-semibold
    color: COLORS.white, // text-white
    textAlign: 'center',
  },
});
