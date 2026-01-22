import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import { BLUR_CONFIG } from '../../constants/blur';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_BAR_HEIGHT = 70;
const TAB_BAR_WIDTH = SCREEN_WIDTH * 0.85; // 85% of screen width

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

interface TabItemProps {
  icon: string;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const TabItem: React.FC<TabItemProps> = ({
  icon,
  label,
  isActive,
  onPress,
}) => {
  const scaleAnim = React.useRef(
    new Animated.Value(isActive ? 1 : 0.9),
  ).current;
  const opacityAnim = React.useRef(
    new Animated.Value(isActive ? 1 : 0.6),
  ).current;

  React.useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isActive ? 1 : 0.9,
      useNativeDriver: true,
      damping: 15,
      stiffness: 150,
    }).start();

    Animated.spring(opacityAnim, {
      toValue: isActive ? 1 : 0.6,
      useNativeDriver: true,
    }).start();
  }, [isActive]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.tabItem, isActive && styles.activeTabItem]}
    >
      <Animated.View
        style={[styles.tabContent, { transform: [{ scale: scaleAnim }] }]}
      >
        <Animated.Text
          style={[
            styles.tabLabel,
            { opacity: opacityAnim },
            isActive && styles.activeTabLabel,
          ]}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export const CustomTabBar: React.FC<TabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  // Hide tab bar on Chat screen
  const currentRoute = state.routes[state.index];
  if (currentRoute.name === 'Chat') {
    return null;
  }

  const getTabIcon = (routeName: string) => {
    switch (routeName) {
      case 'Home':
        return '🏠';
      case 'Chat':
        return '💬';
      case 'Questions':
        return '❓';
      case 'Games':
        return '🎮';
      case 'Profile':
        return '👤';
      default:
        return '•';
    }
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom + 10 }]}>
      <View style={styles.container}>
        {/* Glass Background - Use BlurView for both iOS and Android */}
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType={BLUR_CONFIG.blurType}
          blurAmount={BLUR_CONFIG.blurAmount}
          reducedTransparencyFallbackColor={BLUR_CONFIG.fallbackColor}
        />

        {/* Dark tint overlay for better contrast */}
        <View style={styles.tintOverlay} />

        {/* Border Overlay for Glass Effect */}
        <View style={styles.borderOverlay} />

        {/* Tabs Container */}
        <View style={styles.tabsContainer}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TabItem
                key={route.key}
                icon={getTabIcon(route.name)}
                label={label}
                isActive={isFocused}
                onPress={onPress}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    pointerEvents: 'box-none', // Allow touches to pass through wrapper
  },
  container: {
    width: TAB_BAR_WIDTH,
    height: TAB_BAR_HEIGHT,
    borderRadius: 35,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
    pointerEvents: 'auto', // Tab bar itself should handle touches
  },
  tintOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: BLUR_CONFIG.tints.none,
    pointerEvents: 'none',
  },
  borderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 35,
    ...BLUR_CONFIG.borders.medium,
    pointerEvents: 'none',
  },
  tabsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: THEME.spacing.sm,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    paddingHorizontal: THEME.spacing.xs,
  },
  activeTabItem: {
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: 'rgba(255, 255, 255, 0.08)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: THEME.fontSizes.sm,
    fontWeight: THEME.fontWeights.semibold,
    color: 'rgba(255,255,255,255)',
  },
  activeTabLabel: {
    fontWeight: THEME.fontWeights.bold,
    color: COLORS.textPrimary,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
});
