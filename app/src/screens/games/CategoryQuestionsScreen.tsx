
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { RouteProp, useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GradientBackground, Header, Card } from '../../components/common';
import { GamesStats } from '../../components/games/GamesStats';
import { CategoryQuestionsSkeleton } from '../../components/loaders';
import { useKeyboardAnimation } from '../../hooks/useKeyboardAnimation';
import { COLORS } from '../../constants/colors';
import THEME from '../../constants/theme';
import gamesService, { GameQuestion } from '../../services/gamesService';
import { RootStackParamList } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { useCoupleStore } from '../../store/coupleStore';
import { BlurView } from '@react-native-community/blur';
import { BLUR_CONFIG } from '../../constants/blur';

const { width } = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

type CategoryQuestionsScreenRouteProp = RouteProp<
  RootStackParamList,
  'CategoryQuestions'
>;
type NavigationProp = StackNavigationProp<
  RootStackParamList,
  'CategoryQuestions'
>;

interface GamesStats {
  totalQuestions: number;
  userAnsweredCount: number;
  partnerAnsweredCount: number;
  bothAnsweredCount: number;
}

export const CategoryQuestionsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CategoryQuestionsScreenRouteProp>();
  const { categoryId, categoryName, categoryEmoji, categoryColor } =
    route.params;

  // Store Data
  const user = useAuthStore(state => state.user);
  const partner = useCoupleStore(state => state.partner);

  // State
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [stats, setStats] = useState<GamesStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'available' | 'completed'>(
    'available',
  );

  // Track if this is the initial load to prevent white flash on focus
  const isInitialLoad = useRef(true);

  // Animation
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchData(true); // Initial load with skeleton
  }, []);

  // Auto-refresh when returning from GameQuestionDetailScreen - SILENT refresh
  useFocusEffect(
    useCallback(() => {
      // Skip refresh on initial mount (already handled by useEffect)
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        return;
      }

      console.log('[CategoryQuestionsScreen] Screen focused, silent refresh...');
      fetchData(false); // Silent refresh without skeleton
    }, [categoryId])
  );

  const fetchData = async (showLoader = true) => {
    try {
      // Only show loading skeleton on initial load, not on focus refresh
      if (showLoader) {
        setIsLoading(true);
      }

      const data = await gamesService.getQuestionsByCategory(categoryId);
      setQuestions(data.questions);
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to load questions:', error);
      Alert.alert('Error', 'Failed to load questions. Please try again.');
    } finally {
      if (showLoader) {
        setIsLoading(false);
      }
    }
  };

  const handleQuestionPress = (question: GameQuestion) => {
    if (activeTab === 'completed') {
      // Logic for completed tab
      if (question.isAnsweredByPartner) {
        // Navigate to reveal/detail screen
        // Assuming 'GameQuestionDetail' handles showing answers
        navigation.navigate('GameQuestionDetail', {
          questionId: question._id,
          text: question.text,
          categoryName,
          categoryEmoji,
          categoryColor,
        });
      } else {
        // Waiting for partner
        Alert.alert(
          'Waiting for Partner',
          'Your partner hasn\'t answered this question yet. Nudge them to play!',
        );
      }
    } else {
      // Logic for available tab (Play)
      navigation.navigate('GameQuestionDetail', {
        questionId: question._id,
        text: question.text,
        categoryName,
        categoryEmoji,
        categoryColor,
      });
    }
  };

  const filteredQuestions = questions.filter(q => {
    if (activeTab === 'available') return !q.isAnsweredByUser;
    return q.isAnsweredByUser;
  });

  const renderStatsCard = () => {
    // Determine which logo to show based on user's gender
    const userLogo =
      user?.gender === 'male'
        ? require('../../assets/images/Logo-Male-2.png')
        : require('../../assets/images/Logo-Female-2.png');

    // Partner sees opposite gender logo
    const partnerLogo =
      user?.gender === 'male'
        ? require('../../assets/images/Logo-Female-2.png')
        : require('../../assets/images/Logo-Male-2.png');

    return (
      <View style={styles.statsCard}>
        {/* User Stat */}
        <View style={styles.statItem}>
          <View style={styles.avatarContainer}>
            <Image source={userLogo} style={styles.avatar} resizeMode="cover" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{stats?.userAnsweredCount || 0}</Text>
            </View>
          </View>
          <Text style={styles.statLabel}>{user?.name || 'You'}</Text>
        </View>

        {/* Center Broad Stat */}
        <View style={styles.centerStat}>
          <Text style={styles.centerStatValue}>{stats?.bothAnsweredCount || 0}</Text>
          <Text style={styles.centerStatLabel}>Both Answered</Text>
        </View>

        {/* Partner Stat */}
        <View style={styles.statItem}>
          <View style={styles.avatarContainer}>
            <Image source={partnerLogo} style={styles.avatar} resizeMode="cover" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {stats?.partnerAnsweredCount || 0}
              </Text>
            </View>
          </View>
          <Text style={styles.statLabel}>{partner?.name || 'Partner'}</Text>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <GradientBackground variant="background">
        <Header title={categoryName} showBack onBack={() => navigation.goBack()} />
        <CategoryQuestionsSkeleton />
      </GradientBackground>
    );
  }

  return (
    <GradientBackground variant="background" scrollY={scrollY}>
      <Header title={categoryName} showBack onBack={() => navigation.goBack()} />

      <View style={styles.container}>
        <AnimatedFlatList
          data={filteredQuestions}
          keyExtractor={(item: any) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
          ListHeaderComponent={
            <View>
              {renderStatsCard()}

              {/* Tabs */}
              <View style={styles.tabsContainerWrapper}>
                <View style={styles.tabsContainer}>
                  {/* Glass Background */}
                  <BlurView
                    style={StyleSheet.absoluteFill}
                    blurType={BLUR_CONFIG.blurType}
                    blurAmount={BLUR_CONFIG.blurAmount}
                    reducedTransparencyFallbackColor={BLUR_CONFIG.fallbackColor}
                  />
                  {/* Tint Overlay */}
                  <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.05)' }} />

                  <View style={styles.tabsContent}>
                    <TouchableOpacity
                      style={[
                        styles.tab,
                        activeTab === 'available' && styles.activeTab,
                      ]}
                      onPress={() => setActiveTab('available')}
                    >
                      <Text
                        style={[
                          styles.tabText,
                          activeTab === 'available' && styles.activeTabText,
                        ]}
                      >
                        Available
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.tab,
                        activeTab === 'completed' && styles.activeTab,
                      ]}
                      onPress={() => setActiveTab('completed')}
                    >
                      <Text
                        style={[
                          styles.tabText,
                          activeTab === 'completed' && styles.activeTabText,
                        ]}
                      >
                        Completed
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          }
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleQuestionPress(item)}
              style={styles.cardWrapper}
            >
              <View style={styles.questionCard}>
                <View style={styles.cardHeader}>
                  {/* Status Badges for Completed Tab */}
                  {activeTab === 'completed' && (
                    <View style={[
                      styles.statusBadge,
                      item.isAnsweredByPartner ? styles.statusSuccess : styles.statusWaiting
                    ]}>
                      <Text style={[
                        styles.statusText,
                        item.isAnsweredByPartner ? styles.textSuccess : styles.textWaiting
                      ]}>
                        {item.isAnsweredByPartner ? '✓ See Answers' : '⏳ Waiting'}
                      </Text>
                    </View>
                  )}
                </View>

                <Text style={styles.questionText} numberOfLines={3}>
                  {item.text}
                </Text>

                {activeTab === 'available' && (
                  <View style={styles.playButton}>
                    <Text style={styles.playButtonText}>Tap to play</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {activeTab === 'available'
                  ? "You've answered all questions!"
                  : "No answered questions yet."}
              </Text>
            </View>
          }
        />
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: 100,
    paddingBottom: 40,
  },
  // Stats Card
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
  avatarContainer: {
    width: 80,
    height: 80,
    marginBottom: 8,
    position: 'relative',
    backgroundColor: 'rgba(128, 128, 128, 0.15)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  badge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: COLORS.white,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
    zIndex: 10,
  },
  badgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  centerStat: {
    alignItems: 'center',
  },
  centerStatValue: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 4,
  },
  centerStatLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  // Tabs
  tabsContainerWrapper: {
    marginBottom: 24,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  tabsContainer: {
    backgroundColor: 'transparent',
    position: 'relative',
  },
  tabsContent: {
    flexDirection: 'row',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 26, // Slightly less than container
  },
  activeTab: {
    backgroundColor: COLORS.white,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  activeTabText: {
    color: '#1F1F1F',
    fontWeight: '700',
  },
  // Card Styles
  cardWrapper: {
    marginBottom: 16,
  },
  questionCard: {
    minHeight: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    overflow: 'hidden',
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  questionNumberBadge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  questionNumberText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusSuccess: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  statusWaiting: {
    backgroundColor: 'rgba(255, 152, 0, 0.15)',
  },
  textSuccess: {
    color: '#4CAF50',
  },
  textWaiting: {
    color: '#FF9800',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  questionText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 16,
  },
  playButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  playButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F1F1F',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
});
