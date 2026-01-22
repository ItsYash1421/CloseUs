import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

interface SpinnerProps {
  size?: 'small' | 'large';
  color?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'small',
  color = '#FFFFFF',
}) => {
  return <ActivityIndicator size={size} color={color} style={styles.spinner} />;
};

const styles = StyleSheet.create({
  spinner: {
    // Additional styling if needed
  },
});
